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
    'InvestmentsShowDuration'   : true
},
function (data)
{
    if (data.InvestmentsShowDuration)
    {
        // Create the header cell:
        
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('a');
            nodeInner.innerText = 'Duration';
            nodeOuter.appendChild(nodeInner);
            
        $thead.querySelectorAll('tr')[0].appendChild(nodeOuter);
        
        // Create the header cell tooltip:
        
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('i')
            nodeInner.classList.add('fas');
            nodeInner.classList.add('fa-info-circle');
            nodeInner.classList.add('tooltip-color-gray');
            nodeInner.setAttribute ('data-tooltip-trigger', 'hover,click');
            nodeInner.setAttribute ('data-theme', 'dark');
            nodeInner.setAttribute ('data-placement', 'bottom');
            nodeInner.setAttribute ('data-tooltip', 'The total amount of days which you held this note.');
            nodeOuter.appendChild(nodeInner);
            
        $thead.querySelectorAll('tr')[1].appendChild(nodeOuter);
        
        // Monitor the datable for changes and update cells on change:
        
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
        // Create the header cell:
        
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('a');
            nodeInner.innerHTML = 'Profit';
            nodeOuter.appendChild(nodeInner);
            
        $thead.querySelectorAll('tr')[0].appendChild(nodeOuter);
        
        // Create the header cell tooltip:
        
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('i')
            nodeInner.classList.add('fas');
            nodeInner.classList.add('fa-info-circle');
            nodeInner.classList.add('tooltip-color-gray');
            nodeInner.setAttribute ('data-tooltip-trigger', 'hover,click');
            nodeInner.setAttribute ('data-theme', 'dark');
            nodeInner.setAttribute ('data-placement', 'bottom');
            nodeInner.setAttribute ('data-tooltip', 'The total profit made from this note, calculated as the total received payments minus the investment amount you spend on buying it.');
            nodeOuter.appendChild(nodeInner);
            
        $thead.querySelectorAll('tr')[1].appendChild(nodeOuter);
        
        // Monitor the datable for changes and update cells on change:
        
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
                
                node.setAttribute('style', 'color:' + (profit > 0.0 ? 'green' : 'red') + ';');
                node.innerText = '€ ' + profit.toFixed(2);
            }
        });
    }
});
