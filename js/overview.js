
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

var $boxes          = document.querySelectorAll('table');
var $boxBalance     = $boxes[0];
var $boxReturns     = $boxes[1];
var $boxAmount      = $boxes[2];
var $boxNumber      = $boxes[3];
var $balance        = toFloat($boxBalance.querySelector('.em span').innerText);
var $amount         = toFloat($boxAmount .querySelector('.em span').innerText);
var $number         = toFloat($boxNumber .querySelector('.em span').innerText);
var $toggle         = 0;

chrome.storage.sync.get(
{
    'OverviewHideZeroes'        : true,
    'OverviewShowPercentages'   : true,
    'OverviewShowButtonInstead' : true,
    'OverviewNegativeNumbers'   : true
},
function (data)
{
    if (data.OverviewHideZeroes)
    {
        for (var i = 0; i < $boxes.length; i++)
        {
            for (var rows = $boxes[i].querySelector('tbody').querySelectorAll('tr'), j = 0; j < rows.length - 1; j++)
            {
                if (toFloat(rows[j].querySelectorAll('td')[1].innerText).toFixed(2) == '0.00')
                {
                    rows[j].style.display = 'none';
                }
            }
        }
    }
    
    if (data.OverviewShowPercentages)
    {
        function insertPercentageCell (original, total)
        {
            var percent         = toFloat(original.innerText) / total * 100.00;
            var node            = document.createElement('td');
                node.innerText  = percent.toFixed(2) + '%';
                
            original.setAttribute('style', 'text-align:right;');
            original.parentNode.insertBefore(node, original.nextSibling);
        }
        
        for (var rows = $boxBalance.querySelector('tbody').querySelectorAll('tr'), i = 0; i < rows.length; i++)
        {
            insertPercentageCell(rows[i].querySelectorAll('td')[1], $balance);
        }
        
        for (var rows = $boxAmount .querySelector('tbody').querySelectorAll('tr'), i = 0; i < rows.length; i++)
        {
            insertPercentageCell(rows[i].querySelectorAll('td')[1], $amount );
        }
        
        for (var rows = $boxNumber .querySelector('tbody').querySelectorAll('tr'), i = 0; i < rows.length; i++)
        {
            insertPercentageCell(rows[i].querySelectorAll('td')[1], $number );
        }
    }
    
    if (data.OverviewShowButtonInstead)
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
    
    if (data.OverviewNegativeNumbers)
    {
        for (var rows = $boxReturns.querySelectorAll('tr'), i = 0; i < rows.length; i++)
        {
            if (toFloat(rows[i].querySelectorAll('td')[1].innerText) < 0.00)
            {
                rows[i].querySelectorAll('td')[1].setAttribute('style', 'color:red;');
            }
        }
    }
});
