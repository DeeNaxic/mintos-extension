
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    'InvestmentsShowDaysToNext' : true,
    'InvestmentsHighlightLate'  : true
},
function (data)
{
    var $dataTable      = document.querySelector('#investor-investments-table');
    var $thead          = $dataTable.querySelector('thead');
    var $tbody          = $dataTable.querySelector('tbody');
    
    /*
     *  This will replace the 'next payment date' columns, so instead of showing
     *  the date of the next payment, it shows the amount of days instead. Those
     *  loans whitch are late, doesn't change. Any any loan date today, is shown
     *  as 0 days. It hides the original field, rather than replacing the values
     */
    if (data.InvestmentsShowDaysToNext)
    {
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cell  = getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Next Payment Date');
                var time  = cell.querySelectorAll('span')[0];
                var node  = cell.querySelectorAll('span')[1];
                
                if (node == undefined)
                {
                    cell.appendChild(node = document.createElement('span'));
                    cell.classList.add('global-align-right');
                    time.style.display = 'none';
                }
                
                if (time.innerText.trim() == '-')
                {
                    node.innerText = '-';
                }
                else
                {
                    node.innerText = Math.floor((toDate(time.innerText).getTime() - new Date().getTime()) / 86400000) + ' days';
                }
            }
        });
    }
    
    /* 
     *  This will register a listener for the data table, and on any changes, it 
     *  will go through all rows, and if the 'Term' column is 'Late'. Then it'll 
     *  change the background to a slight red color, to highlight late loans. If 
     *  they are not late, it sets the default white background, on each re-draw 
     */ 
    if (data.InvestmentsHighlightLate) 
    { 
        DomMonitor($dataTable, function (mutations) 
        { 
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++) 
            { 
                if (getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Term').innerText.indexOf('Late') + 1 > 0) 
                { 
                    rows[i].style.background = '#d4574e22'; 
                } 
                else 
                { 
                    rows[i].style.background = 'white'; 
                } 
            } 
        }); 
    } 
});
