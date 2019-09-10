/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

var $dataTable      = document.querySelector('#investor-investments-table');
var $thead          = $dataTable.querySelector('thead');
var $tbody          = $dataTable.querySelector('tbody');

chrome.storage.sync.get(
{
    'InvestmentsShowDaysToNext' : true,
    'InvestmentsHighlightLate'  : true
},
function (data)
{
    if (data.InvestmentsShowDaysToNext)
    {
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr.m-loan-entry'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');

                if (cells[5].innerText === '-' || cells[5].innerText.split(' ')[1] === 'days')
                {
                    continue;
                }

                var days    = Math.floor(Math.abs((toDate(cells[5].innerText).getTime() - new Date().getTime()) / 86400000));
                var node    = getElementByAttribute(cells, "data-m-label", 'Next Payment Date');

                node.innerText = days + ' days';
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