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
    'InvestmentsUseTableLinks'  : true
},
function (data)
{
	function $createLink (k, v, results = [])
    {
        for (var qs = window.location.search.substr(1).split('&'), i = 0; i < qs.length; i++)
        {
            if (qs[i].startsWith(k) == false)
            {
                results.push(qs[i]);
            }
        }
        
        return window.location.pathname + '?' + results.join('&') + '&' + k + '=' + v;
    }
	
	if (data.InvestmentsUseTableLinks)
    {
        // Monitor the data table for changes and update cells on change:
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var data    =
                {
                    'Agricultural Loan' : '7',
                    'Business Loan'     : '32',
                    'Car Loan'          : '2',
                    'Invoice Financing' : '5',
                    'Mortgage Loan'     : '1',
                    'Pawnbroking Loan'  : '6',
                    'Personal Loan'     : '4',
                    'Short-Term Loan'   : '8'
                };
                
                cells[4].innerHTML = '<a href="' + $createLink('pledge_groups[]', data[cells[4].innerText]) + '">' + cells[4].innerHTML + '</a>';
            }
        });
    }
});
