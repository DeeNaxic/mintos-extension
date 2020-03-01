/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export function assert (selector)
{
    if (selector == null)
    {
        throw 'NullException';
    }
    
    return selector;
}

export function getCurrencyPrefix (text)
{
    return text.match(/^\S+/)[0];
}

export function toNumber (text)
{
    return String(text).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ')
}

export function toFloat (text)
{
    return parseFloat(text.replace(/[^0-9\.\-]/g, ''));
}

export function toDate (text)
{
    return new Date(parseInt(text.split('.')[2]), parseInt(text.split('.')[1]) - 1, parseInt(text.split('.')[0]));
}

/**
 * @param {Date} a
 * @param {Date} b
 * @returns {number} number of days between a and b
 */
export function daysBetween(a, b){
    const millisPerDay = 1000 * 60 * 60 * 24;
    return (b.getTime() - a.getTime()) / millisPerDay
}

export function insertElementBefore (element, node)
{
    node.parentNode.insertBefore(element, node);
}

export function getElementByAttribute (elements, attribute, value)
{
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i].hasAttribute(attribute) && elements[i].getAttribute(attribute) == value)
        {
            return elements[i];
        }
    }
    
    return null;
}

export const DomMonitor = (function ()
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

export const DomMonitorAggressive = (function ()
{
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var ready            = true;
    
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
                if (ready && (ready = false) == false)
                {
                    callback(mutations); setTimeout(function () {ready = true}, 0.2);
                }
            });
            
            obs.observe(source,
            {
                childList   : true,
                subtree     : true
            });
        }
        else
        if (window.addEventListener)
        {
            source.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();
