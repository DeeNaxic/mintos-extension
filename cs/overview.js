
/*
 *  Auxiliaries:
 */
function toFloat (source)
{
    return parseFloat(source.replace(/[€\s]/g, ''));
}

function setPercent (source, total, digits = 1)
{
    return source + ' <span style="font-family: monospace; color:blue;">(' + (toFloat(source) / total * 100.00).toFixed(digits).toString().padStart(3 + digits, '0') + '%)</span>';
}




/*
 *  References:
 */
var $boxes      = document.querySelectorAll('table');
var $boxAmount  = $boxes[2];
var $boxNumber  = $boxes[3];
var $amount     = $boxAmount.querySelector('.em span').innerText;
var $number     = $boxNumber.querySelector('.em span').innerText;
var $toggle     = 0;




/*
 *  Runtime:
 */
chrome.storage.sync.get(
{
    'setting_ow_HideZeros'          : true,
    'setting_ow_ShowPercentages'    : true,
    'setting_ow_ShowButtonInstead'  : true
},
function (data)
{
    if (data.setting_ow_HideZeros)
    {
        for (var i = 0; i < $boxes.length; i++)
        {
            for (var es = $boxes[i].querySelector('tbody').querySelectorAll('tr'), j = 0; j < es.length - 1; j++)
            {
                if (es[j].querySelectorAll('td')[1].innerText.replace(/[€\s\+Earnmore]/g, '') == '0.00' || es[j].querySelectorAll('td')[1].innerText.replace(/[€\s\+Earnmore]/g, '') == '0')
                {
                    es[j].style.display = 'none';
                }
            }
        }
    }
    
    if (data.setting_ow_ShowPercentages)
    {
        for (var es = $boxAmount.querySelector('tbody').querySelectorAll('tr'), j = 0; j < es.length - 1; j++)
        {
            es[j].querySelector('span').innerHTML = setPercent(es[j].querySelector('span').innerText, toFloat($amount));
        }
        
        for (var es = $boxNumber.querySelector('tbody').querySelectorAll('tr'), j = 0; j < es.length - 1; j++)
        {
            es[j].querySelector('span').innerHTML = setPercent(es[j].querySelector('span').innerText, toFloat($number));
        }
    }
    
    if (data.setting_ow_ShowButtonInstead)
    {
        function toggle ()
        {
            document.querySelector('.radios').querySelectorAll('label')[$toggle == 1 ? ($toggle = 0) : ($toggle = 1)].click();
        }
        
        document.querySelectorAll('.radios label')[0].style.display = 'none';
        document.querySelectorAll('.radios label')[1].style.display = 'none';
        
        var nodeOuter = document.createElement('div');
            nodeOuter.classList.add('btn-container');
            nodeOuter.classList.add('mod-pb');
            
        var nodeInner = document.createElement('a');
            nodeInner.innerText = 'test';
            nodeInner.classList.add('btn');
            nodeInner.classList.add('btn-primary');
            nodeInner.innerText = 'Switch Measure';
            nodeInner.addEventListener('click', toggle, false);
            nodeOuter.appendChild(nodeInner);
        
        document.querySelector('.radios').appendChild(nodeOuter);
    }
});
