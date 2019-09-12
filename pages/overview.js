
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    'OverviewHideZeroes'        : true,
    'OverviewShowPercentages'   : true,
    'OverviewShowButtonInstead' : true,
    'OverviewNegativeNumbers'   : true
},
function (data)
{
    var $boxes          = document.querySelectorAll('table');
    var $boxBalance     = $boxes[0];
    var $boxReturns     = $boxes[1];
    var $boxAmount      = $boxes[2];
    var $boxNumber      = $boxes[3];
    var $balance        = toFloat($boxBalance.querySelector('.em span').innerText);
    var $amount         = toFloat($boxAmount .querySelector('.em span').innerText);
    var $number         = toFloat($boxNumber .querySelector('.em span').innerText);
    var $toggle         = 0;
    
    /*
     *  This goes through all of the four boxes, on the overview page, including
     *  the initially hidden one. It then iterate through all rows, in the boxes
     *  and picks the value column. If this value when cast to a float, and then
     *  to a string is zero, an inline display style of none is added to hide it
     */
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
    
    /*
     *  This will insert a third column to all tables where the percentage makes
     *  sense. This includes the balance box, and the investment summaries boxes
     *  It declares a local function, which can be used to insert the cell, with
     *  two floats, the current number and the total amount. This will calculate
     *  percentage automatically. This also handles switching the existing style
     */
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
    
    /*
     *  This is a purely cosmetic change, which doesn't do anything. It replaces
     *  the two raido button, for switching between displayed loans, to the type
     *  of button used in the other two columns. It just hides the original ones
     *  and then registers an event listener, on the new button, whitch switches
     *  between clicking on either of the radio buttons in a very cruede fashion
     */
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
            nodeInner.classList.add('btn');
            nodeInner.classList.add('btn-primary');
            nodeInner.innerText = 'Switch Metric';
            nodeInner.addEventListener('click', toggle, false);
            nodeOuter.appendChild(nodeInner);
            
        document.querySelector('.radios').appendChild(nodeOuter);
    }
    
    /*
     *  This will add an inline style, of color red to any number which is below
     *  zero. It does this by iterating all rows, in the returns box, and taking
     *  the second cell in each of them, which is the value that hold the number
     *  and then checks the value. Note that it only checks the box returns rows
     */
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
