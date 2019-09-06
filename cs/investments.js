
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */




function toFloat (source)
{
    return parseFloat(source.replace(/[^0-9\.]/g, ''));
}




var $dataTable  = document.querySelector('#investor-investments-table')
var $thead      = $dataTable.querySelector('thead');
var $tbody      = $dataTable.querySelector('tbody');

chrome.storage.sync.get(
{
    'setting_mi_ShowProfit'         : true,
},
function (data)
{
    if (data.setting_mi_ShowProfit)
    {
        var nodeOuter = document.createElement('th');
            nodeOuter.setAttribute ('data-sort-field', 'Total Profit');
            nodeOuter.classList.add('global-align-center');
            nodeOuter.classList.add('text-nowrap');
            nodeOuter.classList.add('sortable');
            
        var nodeInner = document.createElement('a');
            nodeInner.innerHTML = 'Total Profit';
            nodeOuter.appendChild(nodeInner);
            
        $thead.querySelectorAll('tr')[0].appendChild(nodeOuter);
        $thead.querySelectorAll('tr')[1].appendChild(document.createElement('th'));
        
        var DOM = (function ()
        {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            
            return function (obj, callback)
            {
                if (!obj || !obj.nodeType === 1)
                {
                    return;
                }
                
                if (MutationObserver)
                {
                    var obs = new MutationObserver(function(mutations, observer)
                    {
                        callback(mutations);
                    });
                    
                    obs.observe(obj,
                    {
                        childList   : true,
                        subtree     : false
                    });
                }
                else
                if (window.addEventListener)
                {
                    obj.addEventListener('DOMNodeRemoved', callback, false);
                }
            }
        })();
        
        DOM($dataTable, function (mutations)
        {
            for (var es = $tbody.querySelectorAll('tr'), i = 0; i < es.length - 1; i++)
            {
                var tds = es[i].querySelectorAll('td');
                var dif = toFloat(tds[7].innerText) - toFloat(tds[3].innerText)
                
                if (tds.length == 10)
                {
                    var nodeOuter = document.createElement('td');
                        nodeOuter.setAttribute ('data-m-label', 'Total Profit');
                        nodeOuter.classList.add('m-labeled-col');
                        nodeOuter.classList.add('global-align-right');
                        
                    var nodeInner = document.createElement('span');
                        nodeOuter.appendChild(nodeInner);
                        
                    es[i].appendChild(nodeOuter);
                }
                else
                {
                    var nodeInner = tds[10].querySelector('span');
                }
                
                nodeInner.setAttribute('style', 'color : ' + (dif > 0.0 ? 'green' : 'red') + ';');
                nodeInner.innerText = '€ ' + dif.toFixed(2);
            }
        });
    }
});
