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
        // 1: Register a dom listener (see finished investments)
        // 2: Get reference to all rows
        //  - See an example of how a row like this looks like in the button.
        // 3: Get the cell with the 'data-m-label' value of of 'Next Payment Date' using:
        //  getElementByAttribute (elements, attribute, value)
        // like: var cell = getElementByAttribute(row, 'data-m-label', 'Next Payment Date')
        // 4: Read the innerText
        // - Maybe it's just a '-' ? see the screenshot. In this case, we don't wanna do anything. The '-' appear when a loan is late.
        // - Maybe it's a date as: '10.09.2019'
        //  In this case, calculate it to a date, and calculate the time in days between this string (as a date), and now.
        // see this code for an example of how to calculate days between two dates:
        // var days    = Math.floor(Math.abs((toDate(DATE 1 HERE AS STRING).getTime() - toDate(DATE 2 HERE AS STRING).getTime()) / 86400000));
        // if either of them is already a date type, skip the toDate call.
        // write the value days + ' days' to innerText
    }
    
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


/*
 *
 *  Example of a cell:   <td data-m-label="Next Payment Date" class="m-loan-issued m-labeled-col"><span>09.09.2019</span></td>
 */
