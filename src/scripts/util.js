/*
 *  @project >> Investment Extensions
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 */

function assert (selector)
{
    if (selector == null)
    {
        throw 'NullException';
    }
    
    return selector;
}

function toNumber (text)
{
    return String(text).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ')
}

function toFloat (text)
{
    return parseFloat(text.replace(/[^0-9\.\-]/g, ''));
}

function toDate (text)
{
    return new Date(parseInt(text.split('.')[2]), parseInt(text.split('.')[1]) - 1, parseInt(text.split('.')[0]));
}

function getElementByAttribute (elements, attribute, value)
{
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i].hasAttribute(attribute) && elements[i].getAttribute(attribute) == value)
        {
            return elements[i];
        }
    }
}

function getCurrencySymbol (text)
{
    return text.substr(0, 1);
}

var DomMonitor = (function ()
{
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    return function (source, callback)
    {
        if (!source || !source.nodeType === 1)
        {
            return;
        }
        
        if (MutationObserver)
        {
            var obs = new MutationObserver(function(mutations, observer)
            {
                callback(mutations);
            });
            
            obs.observe(source,
            {
                childList   : true,
                subtree     : false
            });
        }
        else
        if (window.addEventListener)
        {
            source.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();
