/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import u from 'umbrellajs';

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
 * @returns {Date}
 */
export function today ()
{
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

/**
 * Calculate the number of toDays from millis
 * @param {Number} millis
 * @returns {Number} number of toDays (rounded)
 */
export function toDays (millis)
{
    const millisPerDay = 1000 * 60 * 60 * 24;
    return Math.round(millis / millisPerDay);
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

function queryAllSelectors (selectors, from)
{
    const result = {};
    for (const [name, selector] of Object.entries(selectors))
    {
        const node = from.querySelector(selector);
        if (!node)
            return null;
        result[name] = node;
    }
    return result;
}

/**
 * Wait for elements matched by given selectors to be available in the document.
 * When all selectors match against the document, the resulting promise'strNotEmpty resolve method is called
 * with a mapping of selector to a matching node. If however the timeout is reached before all selectors match,
 * the promise'strNotEmpty fail method is called with the time passed (millis).
 * The timeout is checked when any mutations are detected in the target node.
 *
 * @param {object} selectors - list of selectors to match against document.
 * @param {Element} from
 * @param {number} timeout - time in milliseconds after the resulting promise fails.
 * @returns {Promise}
 */
export function onNodesAvailable (selectors, from = undefined, timeout = 30000)
{
    const start = new Date();
    from = from || document;
    let resolved = false;
    return new Promise((resolve, reject) =>
    {
        const nodes = queryAllSelectors(selectors, from);
        if (nodes)
        {
            resolve(nodes);
            return;
        }
        
        const mo = new MutationObserver(function (_)
        {
            const nodes = queryAllSelectors(selectors, from);
            if (nodes)
            {
                resolved = true;
                mo.disconnect();
                resolve(nodes);
            }
        });
        
        mo.observe(from, {
            childList : true,
            subtree   : true,
        });
        
        if (timeout)
            setTimeout(onTimeout, timeout);
        
        function onTimeout ()
        {
            if (!resolved)
            {
                mo.disconnect();
                reject(new Error(`Selectors didn't resolve within timeout of ${new Date() - start}ms`));
            }
        }
    });
}

/**
 * Promise-based chrome API.
 * Methods instead taking callback, return a Promise.
 */
export const chrome = {
    storage : {
        sync : {
            get : (keys) => new Promise((resolve, _) => window.chrome.storage.sync.get(keys, resolve)),
        }
    }
};

/**
 * This is a DEBUGGING utility. It shows which selectors are available from the first load of the page and which become
 * available at later stages
 *
 * @param {Array} selectors
 */
function doReportNodesAvailable (selectors)
{
    let selectorMap = querySelectors(selectors);
    let stage = 0;
    console.info(`stage ${stage}`, selectorMap);
    
    const observer = new MutationObserver(mutationHandler);
    
    function querySelectors (selectors)
    {
        return new Map(Object.entries(selectors
            .map(selector => ({[selector] : u(selector).length !== 0}))
            .reduce((r, v) => ({...r, ...v}), {})));
    }
    
    function mutationHandler (mutations)
    {
        ++stage;
        const availability = querySelectors(selectors);
        const report = new Map();
        for (const [key, value] of availability.entries())
            if (selectorMap.get(key) !== value)
                report.set(key, value);
        
        if (report.size)
            console.info(`stage ${stage}`, report);
        
        selectorMap = availability;
        
        if (![...selectorMap.values()].includes(false))
            observer.disconnect();
    }
    
    observer.observe(document, {
        childList : true,
        subtree   : true,
    });
}

/**
 * This method is intended for helping development. In development mode (NODE_ENV != production) it will report the
 * changing availability of elements (as described by CSS selectors) in the document DOM tree.
 * If the code is built with NODE_ENV = production, it does nothing.
 */
export const reportNodesAvailable =
    process.env.NODE_ENV === 'production'
        ? () => {}
        : doReportNodesAvailable;
