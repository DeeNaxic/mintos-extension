
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


var countries = {
    "Albania"               : "ALB",
    "Armenia"               : "ARM",
    "Botswana"              : "BWA",
    "Bulgaria"              : "BGR",
    "Colombia"              : "COL",
    "Czech Republic"        : "CZE",
    "Denmark"               : "DNK",
    "Estonia"               : "EST",
    "Finland"               : "FIN",
    "Georgia"               : "GEO",
    "Indonesia"             : "IDN",
    "Kazakhstan"            : "KAZ",
    "Kenya"                 : "KEN",
    "Kosovo"                : "UNK",
    "Latvia"                : "LVA",
    "Lithuania"             : "LTU",
    "Mexico"                : "MEX",
    "Moldova"               : "MDA",
    "Namibia"               : "NAM",
    "North Macedonia"       : "MKD",
    "Philippines"           : "PHL",
    "Poland"                : "POL",
    "Romania"               : "ROU",
    "Russian Federation"    : "RUS",
    "South Africa"          : "ZAF",
    "Spain"                 : "ESP",
    "Sweden"                : "SWE",
    "Ukraine"               : "UKR",
    "United Kingdom"        : "GBR",
    "Vietnam"               : "VNM",
    "Zambia"                : "ZMB"
};