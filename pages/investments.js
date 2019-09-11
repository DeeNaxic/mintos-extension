
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
    'InvestmentsUseTableLinks'  : false
},
function (data)
{
    /*
     *  This takes the current query string, splits it up into components and it
     *  then iterates through all the key, value pairs. If there is any existing
     *  keys, which matches the one we are trying to insert, it is removed. This
     *  means that any existing query parameters are kept intact, such that, the
     *  final path returned, always have the same path with the new key appended
     */
    function $createLink (key, target)
    {
        for (var queries = window.location.search.substr(1).split('&'), results = [], i = 0; i < queries.length; i++)
        {
            if (queries[i].startsWith(key) == false)
            {
                results.push(queries[i]);
            }
        }
        
        return window.location.pathname + '?' + results.join('&') + '&' + key + '=' + target;
    }
    
    /*
     *  This registers a DomMonitor which listens for changes, in the data table
     *  and on any change including initially, it runs this code. It iterates on
     *  all rows in the investment table and inserts on the loan type cells, the
     *  link, to the current page, with the same query parameters, but filtering
     *  on the selected loan type only. This's done simply by reloading the page
     */
    if (data.InvestmentsUseTableLinks)
    {
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells = rows[i].querySelectorAll('td');
                var data  =
                {
                    'Mortgage Loan'     : '1',
                    'Car Loan'          : '2',
                    'Personal Loan'     : '4',
                    'Invoice Financing' : '5',
                    'Pawnbroking Loan'  : '6',
                    'Agricultural Loan' : '7',
                    'Short-Term Loan'   : '8',
                    'Business Loan'     : '32'
                };
                
                cells[4].innerHTML = '<a href="' + $createLink('pledge_groups[]', data[cells[4].innerText]) + '">' + cells[4].innerText + '</a>';
            }
        });
    }
});
