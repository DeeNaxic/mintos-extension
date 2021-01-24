/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import './investments';

import moment from "moment";
import u from 'umbrellajs';
import {
    assert,
    chrome,
    debug,
    DomMonitor,
    DomMonitorAggressive,
    mintosDateFormat,
    onNodesAvailable,
    reportNodesAvailable,
} from '../common/util';
import {
    enhanceTableDom,
    renderModelLoans,
} from "../components/investments";
import {localization} from "../common/localization";

const model = {
    loans : [],
};

export async function handle ()
{
    reportNodesAvailable([
        '.table-wrapper .loan-table',
        '.table-wrapper .loan-table thead',
        '.table-wrapper .loan-table tbody',
    ]);
    
    const settings = await chrome.storage.sync.get(
        {
            InvestmentsShowDaysToNextPayment : true,
            InvestmentsHighlightLateLoans    : true,
            InvestmentsShowPremiumDiscount   : true,
            InvestmentsUseLoanTypeLinks      : false
        }
    )
    
    try
    {
        const {
                  table,
              } = await onNodesAvailable({
            table : '.table-wrapper .loan-table',
        })
        
        enhanceDom(settings, {table});
        
        updatePage(settings, {table});
        
        DomMonitorAggressive(table, () => updatePage(settings, {table}));
    } catch (x)
    {
        console.error(x);
    }
}

function enhanceDom (settings, nodes)
{
    enhanceTableDom(settings, nodes.table);
}

function updatePage (settings, nodes)
{
    updateLoansModel(nodes.table, model);
    enhanceModel(model);
    debug(model);
    renderModelLoans(settings, model, nodes.table);
}

function updateLoansModel (table, model)
{
    model.loans.length = 0;
    u('tr:not(.total-row,.tooltip-row)', table).each(row => model.loans.push(createLoanModel(row)));
}

function createLoanModel (row)
{
    return {
        nextPaymentDate : u(`td div[data-m-label="${localization('$NextPayment')}"] > span:first-of-type`, row)
            .text()
            .trim(),
        late            : u(`div[data-m-label="${localization('$Term')}"] > span > span:first-child`, row)
            .text()
            .trim()
            .indexOf(localization('$Late')) > -1,
    };
}

function enhanceModel (model)
{
    const today = moment().startOf('day');
    const enhanceLoanModel = (loan) =>
    {
        const date = moment(loan.nextPaymentDate, mintosDateFormat);
        if (date.isValid())
        {
            loan.nextPaymentDays = date.diff(today, 'days')
        }
    }
    model.loans.forEach(enhanceLoanModel);
    
}


chrome.storage.sync.get
(
    {
        'InvestmentsShowDaysToNextPayment'  : true,
        'InvestmentsHighlightLateLoans'     : true,
        'InvestmentsShowPremiumDiscount'    : true,
        'InvestmentsUseLoanTypeLinks'       : false
    },
    
    function (settings)
    {
        function runtime (settings)
        {
            /*
             *  This try catch is meant to handle the cases, where Mintos have not fully
             *  loaded the website yet. As a result, some things might not have appeared
             *  on the website. We try to get everything and if anything turns out to be
             *  empty (null or undefined), we stop further execution and reload the code
             *  in 0.1 seconds using a timeout. This is done until the page successfully
             *  loads, and has everything assigned, at which point the runtime continues
             */
            try
            {
                var dataTable       = assert(document.querySelector('#investor-investments-table'));
                var thead           = assert(dataTable.querySelector('thead'));
                var tbody           = assert(dataTable.querySelector('tbody'));
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            /*
             *  This takes the current query string, splits it up into components and it
             *  then iterates through all the key, value pairs. If there is any existing
             *  keys, which matches the one we are trying to insert, it is removed. This
             *  means that any existing query parameters are kept intact, such that, the
             *  final path returned, always have the same path with the new key appended
             */
            function createLink (key, target)
            {
                for (var queries = window.location.search.substr(1).split('&'), results = [], i = 0; i < queries.length; i++)
                {
                    if (queries[i].toLowerCase().startsWith(key.toLowerCase()) == false)
                    {
                        results.push(queries[i]);
                    }
                }
                
                return window.location.pathname + '?' + results.join('&') + '&' + key + '=' + target;
            }
            
            /*
             *  This adds a percentage counter after each note, that is for sale showing
             *  the added premium as a + number or discount as some negative number. The
             *  original number is still shown, but it becomes easier to see which notes
             *  have been set on sale with a premium / discount, no change is also shown
             */
            if (settings.InvestmentsShowPremiumDiscount)
            {
                function $getPercentage (input) 
                {
                    return parseFloat(/(-?\d+\.\d+)%/g.exec(input)[0]);
                }
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var cells = tbody.querySelectorAll('td.placeholder'), i = 0; i < cells.length; i++)
                    {
                        cells[i].parentElement.removeChild(cells[i]);
                    }
                    
                    for (var rows = tbody.querySelectorAll('tr:not(.total-row)'), i = 0; i < rows.length; i++)
                    {
                        var cell    = rows[i].lastElementChild;
                        var span    = cell.querySelectorAll('span')[1];
                        
                        if (span == undefined)
                        {
                            continue;
                        }
                        
                        if (span.getAttribute('data-tooltip') == null)
                        {
                            var e = document.createElement('td');
                                e.classList.add('placeholder')
                                
                            rows[i].appendChild(e);
                            
                            continue;
                        }
                        
                        var percent = $getPercentage(span.getAttribute('data-tooltip'));
                        
                        if (span.hasAttribute('data-value') == false)
                        {
                            span.setAttribute('data-value', span.innerText);
                        }
                        
                        span.innerHTML = span.getAttribute('data-value') + ' <span style="color:' + (percent < 0.0 ? 'green' : (percent > 0.0 ? 'red' : 'black')) + ';">' + (percent < 0.0 ? ' - ' : ' + ') + Math.abs(percent).toFixed(1) + '%</span>';
                    }
                });
            }
            
            /*
             *  This registers a DomMonitor which listens for changes, in the data table
             *  and on any change including initially, it runs this code. It iterates on
             *  all rows in the investment table and inserts on the loan type cells, the
             *  link, to the current page, with the same query parameters, but filtering
             *  on the selected loan type only. This's done simply by reloading the page
             */
            if (settings.InvestmentsUseLoanTypeLinks)
            {
                DomMonitor(dataTable, function (mutations)
                {
                    for (var data = {}, lines = document.querySelectorAll('#sel-pledge-groups option'), i = 0; i < lines.length; i++)
                    {
                        data[lines[i].innerText] = lines[i].value;
                    }
                    
                    for (var rows = tbody.querySelectorAll('tr:not(.total-row)'), i = 0; i < rows.length; i++)
                    {
                        var node              = rows[i].querySelector('.m-loan-id span');
                            node.style.color  = '#3f85f4';
                            node.style.cursor = 'pointer';
                            
                            node.onclick = function (e)
                            {
                                window.location.href = createLink('pledge_groups[]', data[e.target.innerText]);
                            }
                    }
                });
            }
        }
        
        runtime(settings);
    }
);
