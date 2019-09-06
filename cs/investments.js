
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */




var $thead      = document.querySelector('#investor-investments-table').querySelector('thead');
var $tbody      = document.querySelector('#investor-investments-table').querySelector('tbody');




chrome.storage.sync.get(
{
    
},
function (data)
{
    if (true)
    {
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
                        subtree     : true
                    });
                }
                else
                if (window.addEventListener)
                {
                    obj.addEventListener('DOMNodeInserted', callback, false);
                    obj.addEventListener('DOMNodeRemoved',  callback, false);
                }
            }
        })();
        
        DOM(document.querySelector('table'), function (change)
        {
            console.log('Element was changed');
        });
    }
});
