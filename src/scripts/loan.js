/*
 *  @project >> Investment Extensions
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 */

chrome.storage.sync.get(
{
    'LoanShowCountryRow'                : true,
    'LoanShowOntimePaymentPercent'      : true,
    'LoanFormatInvestmentBreakdown'     : true,
    'LoanShowNextPaymentRow'            : true
},
function (settings)
{
    if (document.location.pathname.match(/^\/\w{2}\/[0-9]+-[0-9]+/g) === null)
    {
        return;
    }
    
    var tables          = document.querySelectorAll('tbody');
    var details         = tables[0];
    var borrower        = tables[1];
    var schedule        = tables[2];
    
    function createDetailsRow (header, content)
    {
        var nodeOuter = document.createElement('tr');
            
        var nodeInner           = document.createElement('td');
            nodeInner.innerText = header;
            nodeInner.classList.add('field-description');
            nodeOuter.appendChild(nodeInner);
            
        var nodeInner           = document.createElement('td');
            nodeInner.innerText = content;
            nodeInner.classList.add('value');
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  Show a column at the beginning of the detail window, with the country of
     *  the loan, written out as text. There is no flag in this value field. The
     *  reason for this, is that the flag is already shown at the top. But maybe
     *  we should remove it from there, and then add it to the left of the names
     */
    if (settings.LoanShowCountryRow)
    {
        details.insertBefore(createDetailsRow('Country', document.querySelector('.m-h1 img').title), details.firstChild);
    }

    /*
     * Show the number of days untill the next payment in the loan details window.
     * If the loan status are finished or default, then next payment will not be
     * shown. Also, if the loan are in grace period and there are only one scheduled
     * payment left, then the next payment will not be shown, since negative days
     * does not make sence.
     */
    if (['Finished', 'Default'].includes(details.lastChild.lastChild.innerText.trim()) == false && settings.LoanShowNextPaymentRow)
    {
        var days = 0;

        for (var rows = schedule.querySelectorAll('tr'), i = 0; i < rows.length; i++) 
        {
            var columns     = rows[i].querySelectorAll('td');
            var date        = toDate(columns[0].innerText);
            var status      = columns[6].innerText;

            if (status === 'Scheduled')
            {                            
                days = Math.floor((date - new Date().setHours(0, 0, 0, 0)) / 86400000);
                if (days >= 0)
                {
                    break;
                }
            }
        }

        if (days >= 0)
        {
            details.appendChild(createDetailsRow('Next Payment', days + ' days'));
        }
    }
    
    /*
     *
     *  Experimental: Highlight dangerous information.
     *
     */
    if (false)
    {
        if (['Current', 'Finished'].includes(details.lastChild.lastChild.innerText.trim()) == false)
        {
            details.lastChild.style.background = '#d4574e22';
        }
    }
    
    /*
     *  This shows a percentage calculation, of how many payments, which were on
     *  time, and how many were delayed. It is shown as a percent out of hundred
     *  and it excludes scheduled payments which has not yet been made. If there
     *  is only scheduled payments the 'n/a' is shown instead of some percentage
     */
    if (settings.LoanShowOntimePaymentPercent)
    {
        var $ontime  = 0;
        var $others  = 0;
        
        schedule.querySelectorAll('tr').forEach(function (element)
        {
            if (element.lastChild.innerText == 'Paid')
            {
                $ontime++;
            }
            else
            if (element.lastChild.innerText == 'Scheduled')
            {
                
            }
            else
            {
                $others++;
            }
        });
        
        var percent  = $others + $ontime > 0 ? ($ontime / ($others + $ontime) * 100.00).toFixed(0) + '%' : 'n/a';
        var node     = createDetailsRow('On-time Payments', percent);
        
        details.appendChild(node);
    }
    
    /*
     *  Replace the investment breakdown unordered list, with a table. The table
     *  shows the same informations, and the same colours but formated with rows
     *  and cells nicely aligned. It also adds decimals to the value calculation
     */
    if (settings.LoanFormatInvestmentBreakdown)
    {
        function $createHeader ()
        {
            var nodeOuter                   = document.createElement('tr');
                
            var nodeInner                   = document.createElement('th');
                nodeInner.innerText         = '';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('th');
                nodeInner.innerText         = 'Name';
                nodeInner.style.textAlign   = 'left';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('th');
                nodeInner.innerText         = 'Percent';
                nodeInner.style.textAlign   = 'right';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('th');
                nodeInner.innerText         = 'Amount';
                nodeInner.style.textAlign   = 'right';
                nodeOuter.appendChild(nodeInner);
                
            return nodeOuter;
        }
        
        function $createRow (id, groups)
        {
            var nodeOuter                   = document.createElement('tr');
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerHTML         = '<ul id="legend"><li class="' + id + '" style="padding:0px 0px 0px 12px">&nbsp;</li></ul>';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = groups[1];
                nodeInner.style.whiteSpace  = 'nowrap';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = groups[2];
                nodeInner.style.textAlign   = 'right';
                nodeInner.style.whiteSpace  = 'nowrap';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = toNumber(toFloat(groups[3]).toFixed(2)) + ' ' + getCurrencySymbol(groups[3]);
                nodeInner.style.textAlign   = 'right';
                nodeInner.style.whiteSpace  = 'nowrap';
                nodeOuter.appendChild(nodeInner);
                
            return nodeOuter
        }
        
        var observer = new MutationObserver(function (mutations)
        {
            var chart                       = document.querySelector('.chart-data');
                
            var list                        = chart.querySelector('#legend');
                
            var nodeTable                   = document.createElement('table');
                nodeTable.style.width       = '100%';
                nodeTable.style.fontSize    = '0.85em';
                nodeTable.appendChild($createHeader());
                
            list.querySelectorAll('li').forEach(function (element)
            {
                nodeTable.appendChild($createRow(element.getAttribute('class'), element.innerText.match(/^(.*?)- (\d+%).*?\/ (.*)/)));
            });
            
            list.style.display  = 'none';
            chart.insertBefore(nodeTable, list);
            observer.disconnect();
        });
        
        observer.observe(document.querySelector('.chart-data'),
        {
            childList       : true,
            subtree         : true,
            attributes      : false,
            characterData   : false
        });
    }
});
