/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'AccountOverviewUseFourDecimals'    : false,
        'AccountOverviewShowAllTimeButton'  : true,
        'AccountOverviewSplitDetailsTable'  : true,
    },
    
    function (settings)
    {
        if (!Object.values(settings).includes(true))
            return;
        
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
                var dataSummary     = assert(document.querySelector('#overview-results tbody'));
                var dataTable       = assert(document.querySelector('#overview-details tbody'));
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            const enhancers = [];
            const dataTableRowEnhancers = [];
    
            /*
             *  This replaces the default two digit representation with four digits. The
             *  problem with the default implementation is, that it might show a gain of
             *  '0.00' which can be confusing. Mintos solved this by including the value
             *  in the hover-text. This is also where the actual text value is gotten of
             */
            if (settings.AccountOverviewUseFourDecimals)
            {
                enhancers.push(() =>
                    dataSummary.querySelectorAll('.mod-pointer').forEach(function (row)
                    {
                        row.innerText           = row.getAttribute('data-tooltip').replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    }
                    ));
        
                dataTableRowEnhancers.push(
                    function (row)
                    {
                        var turnover            = row.querySelector('.turnover span');
                            turnover.innerText  = turnover .title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                        
                        // Remainder column is not present when searching by transaction type 
                        var remainder           = row.querySelector('.remainder span');
                        if (remainder)
                            remainder.innerText = remainder.title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    });
            }
            
            if (settings.AccountOverviewSplitDetailsTable)
            {
                enhancers.push(addDataTableSplitHeaderCells);
        
                dataTableRowEnhancers.push(splitDataTableRow);
            }
    
            function handleChanges ()
            {
                enhancers.forEach(enhancer => enhancer());
        
                if (dataTableRowEnhancers)
                    dataTable.querySelectorAll('tr')
                        .forEach(row => dataTableRowEnhancers
                            .forEach(enhancer => enhancer(row)));
            }
                
                DomMonitorAggressive(dataTable, function (mutations)
                {
                handleChanges();
                });
                
            handleChanges();
                
            if (settings.AccountOverviewShowAllTimeButton)
                $add_timespan_always();
        }
        
        runtime(settings);
    }
);

/*
*  This adds an 'All time' button to the account overview, which sets the time
*  period, to show all your investments on Mintos. This is helpful when you
*  want the total progression over time without setting selecting the dates
*/
function $add_timespan_always ()
{
    const always_a = document.createElement('a');
    always_a.innerText = localization('alltime');
    always_a.href = 'javascript:;';
    always_a.setAttribute('data-value', 'always');
    always_a.addEventListener('click', function (event)
    {
        document.querySelectorAll('li.m-quickfilter-item > a:not([data-value = "always"])').forEach(function (e)
        {
            e.classList.remove('active');
        });
        always_a.classList.add('active');
        document.querySelector('#period-from').value = '1.1.1950';
        document.querySelector('#period-to')  .value = '1.1.2050';
        document.querySelector('#filter-button').click()
    });
    
    const always_li = document.createElement('li');
    always_li.classList.add('m-quickfilter-item');
    always_li.appendChild(always_a);
    
    document.querySelector('#quickfilters').appendChild(always_li);
    document.querySelectorAll('li.m-quickfilter-item > a:not([data-value = "always"])').forEach(function (e)
    {
        e.addEventListener('click', function (event)
        {
            always_a.classList.remove('active');
        })
    });
}

function addDataTableSplitHeaderCells ()
{
    const headerRow = document.querySelector('#overview-details thead tr');
    if (headerRow.childElementCount !== 4)
        return;
    
    const headersNode = document.createElement('template');
    headersNode.innerHTML = `
        <th>Transaction ID</th>
        <th>Loan ID</th>
        <th>Transaction Type</th>
        <th>Reference ID</th>
        `;
    const detailsHeadCell = headerRow.children[1];
    detailsHeadCell.classList.add('invext-hidden');
    headerRow.insertBefore(headersNode.content, detailsHeadCell);
}

const detailsNode = document.createElement('template');
detailsNode.innerHTML = `
    <td class="invext-tx-id" />
    <td class="invext-loan-id" />
    <td class="invext-tx-type" />
    <td class="invext-tx-ref-id" />
`;

function parseTransactionDetails (text)
{
    const result = {};
    const parts = text.split(' - ');
    
    result.txId = parts[0].match(/^Transaction ID: (\d+)$/)[1];
    
    const typeAndRef = parts[parts.length - 1];
    const match = typeAndRef.match(/^(\D+) (\d+).$/);
    if (match)
    {
        result.txType = match[1];
        result.txRef = match[2];
    }
    else
        result.txType = typeAndRef;
    
    
    return result;
}

function splitDataTableRow (row)
{
    const detailsCell = row.querySelector('td.m-transaction-details');
    if (!detailsCell.classList.contains('invext-hidden'))
    {
        detailsCell.classList.add('invext-hidden');
        row.insertBefore(detailsNode.content.cloneNode(true), row.children[1]);
    }
    
    const details = parseTransactionDetails(detailsCell.innerText);
    if (details.txId === row.querySelector('.invext-tx-id').innerText)
        // MutationObserver caught our changes and called us again.
        return;
    
    
    row.querySelector('.invext-tx-id').innerText = details.txId;
    
    
    const loanCell = row.querySelector('.invext-loan-id');
    loanCell.innerHTML = '';
    const a = detailsCell.querySelector('a');
    if (a)
        loanCell.appendChild(a.cloneNode(true));
    
    
    row.querySelector('.invext-tx-type').innerText = details.txType;
    row.querySelector('.invext-tx-ref-id').innerText = 'txRef' in details ? details.txRef : '';
}

function localization (field)
{
    var translations =
            {
                'alltime' :
                    {
                        'en' : 'All time',
                        'de' : 'Alle Zeit',
                        'pl' : 'Od początku',
                        'cs' : 'Kompletní historie',
                        'es' : '?',
                        'lv' : '?',
                        'ru' : '?'
                    }
            };
    
    return translations[field][document.location.pathname.substring(1, 3)];
}

