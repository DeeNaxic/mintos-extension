/*
 *  @project >> Investments++
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    'LoanShowCountryRow'                : true,
    'LoanShowOntimePaymentPercent'      : true,
    'LoanFormatInvestmentBreakdown'     : true
},
function (data)
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
     *  the note, written out as text. There is no flag in this value field. The
     *  reason for this, is that the flag is already shown at the top. But maybe
     *  we should remove it from there, and then add it to the left of the names
     */
    if (data.LoanShowCountryRow)
    {
        details.insertBefore(createDetailsRow('Country', document.querySelector('.m-h1 img').title), details.firstChild);
    }
    
    /*
     *
     *  Experimental: Highlight dangerous information.
     *
     */
    if (true)
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
    if (data.LoanShowOntimePaymentPercent)
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
        var node     = createDetailsRow('On Time Payments', percent);
        
        details.appendChild(node);
    }
    
    /*
     *  Replace the investment breakdown unordered list, with a table. The table
     *  shows the same informations, and the same colours but formated with rows
     *  and cells nicely aligned. It also adds decimals to the value calculation
     */
    if (data.LoanFormatInvestmentBreakdown)
    {
        function $createRow (id, groups)
        {
            var nodeOuter                   = document.createElement('tr');
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerHTML         = '<ul id="legend"><li class="' + id + '" style="padding:0px 0px 0px 12px">&nbsp;</li></ul>';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = groups[1];
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = groups[2];
                nodeInner.style.textAlign   = 'right';
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner                   = document.createElement('td');
                nodeInner.innerText         = toFloat(groups[3]).toFixed(2) + ' ' + getCurrencySymbol(groups[3]);
                nodeInner.style.textAlign   = 'right';
                nodeOuter.appendChild(nodeInner);
                
            return nodeOuter
        }
        
        var observer = new MutationObserver(function (mutations)
        {
            var chart               = document.querySelector('.chart-data');
                
            var list                = chart.querySelector('#legend');
                list.style.display  = 'none';
                
            var node                = document.createElement('table');
                node.style.width    = '100%';
                node.style.fontSize = '0.85em';
            
            list.querySelectorAll('li').forEach(function (element)
            {
                node.appendChild($createRow(element.getAttribute('class'), element.innerText.match(/^(.*?)- (\d+%).*?\/ (.*)/)));
            });
            
            chart.insertBefore(node, list);
            
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
