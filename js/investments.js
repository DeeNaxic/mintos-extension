/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

var $dataTable      = document.querySelector('#investor-investments-table');
var $thead          = $dataTable.querySelector('thead');
var $tbody          = $dataTable.querySelector('tbody');

chrome.storage.sync.get(
{
    'InvestmentsShowProfit'     : true,
    'InvestmentsShowDuration'   : true,
    'InvestmentsUseTableLinks'  : true
},
function (data)
{
    function $insertHeader (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('a');
            nodeInner.innerText = text;
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    function $insertTooltip (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('i')
            nodeInner.classList.add('fas');
            nodeInner.classList.add('fa-info-circle');
            nodeInner.classList.add('tooltip-color-gray');
            nodeInner.setAttribute ('data-tooltip-trigger', 'hover,click');
            nodeInner.setAttribute ('data-theme', 'dark');
            nodeInner.setAttribute ('data-placement', 'bottom');
            nodeInner.setAttribute ('data-tooltip', text);
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    function $createLink (k, v, results = [])
    {
        for (var qs = window.location.search.substr(1).split('&'), i = 0; i < qs.length; i++)
        {
            if (qs[i].startsWith(k) == false)
            {
                results.push(qs[i]);
            }
        }
        
        return window.location.pathname + '?' + results.join('&') + '&' + k + '=' + v;
    }
    
    if (data.InvestmentsUseTableLinks)
    {
        // Monitor the data table for changes and update cells on change:
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var data    =
                {
                    'Agricultural Loan' : '7',
                    'Business Loan'     : '32',
                    'Car Loan'          : '2',
                    'Invoice Financing' : '5',
                    'Mortgage Loan'     : '1',
                    'Pawnbroking Loan'  : '6',
                    'Personal Loan'     : '4',
                    'Short-Term Loan'   : '8'
                };
                
                cells[4].innerHTML = '<a href="' + $createLink('pledge_groups[]', data[cells[4].innerText]) + '">' + cells[4].innerHTML + '</a>';
            }
        });
    }
    
    if (data.InvestmentsShowDuration)
    {
        // Insert header and tooltip:
        
        $thead.querySelectorAll('tr')[0].appendChild($insertHeader ('Duration'));
        $thead.querySelectorAll('tr')[1].appendChild($insertTooltip('The total amount of days which you held this note.'));
        
        // Monitor the data table for changes and update cells on change:
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var days    = Math.floor(Math.abs((toDate(cells[2].innerText).getTime() - toDate(cells[9].innerText).getTime()) / 86400000));
                var node    = getElementByAttribute(cells, "data-m-label", 'Duration');
                
                if (node === undefined)
                {
                    node = document.createElement('td');
                    node.setAttribute ('data-m-label', 'Duration');
                    node.classList.add('global-align-right');
                    rows[i].appendChild(node);
                }
                
                node.innerText = days + ' days';
            }
        });
    }
    
    if (data.InvestmentsShowProfit)
    {
        // Insert header and tooltip:
        
        $thead.querySelectorAll('tr')[0].appendChild($insertHeader ('Profit'));
        $thead.querySelectorAll('tr')[1].appendChild($insertTooltip('The total profit made from this note, calculated as the total received payments minus the investment amount you spent on buying it.'));
        
        // Monitor the data table for changes and update cells on change:
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var profit  = toFloat(cells[7].innerText) - toFloat(cells[3].innerText);
                var node    = getElementByAttribute(cells, "data-m-label", 'Profit');
                
                if (node === undefined)
                {
                    node = document.createElement('td');
                    node.setAttribute ('data-m-label', 'Profit');
                    node.classList.add('global-align-right');
                    rows[i].appendChild(node);
                }
                
                node.setAttribute('style', 'color:' + (profit > 0.00 ? 'green' : 'red') + ';');
                node.innerText = '€ ' + profit.toFixed(2);
            }
        });
    }
});
