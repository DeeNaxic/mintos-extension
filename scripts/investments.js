/*
 *  @project >> Investment Extensions
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 */

chrome.storage.sync.get(
{
    'InvestmentsUseLoanTypeLinks'       : true,
    'InvestmentsShowCountryColumn'      : true,
},
function (settings)
{
    var dataTable       = document.querySelector('#investor-investments-table');
    var thead           = dataTable.querySelector('thead');
    var tbody           = dataTable.querySelector('tbody');
    
    /*
     *  This creates a header cell, according to the ones used in the investment
     *  data table. It uses the same styles, and takes as input the headers text
     */
    function createHeader (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('a');
            nodeInner.innerText    = text;
            nodeInner.style.cursor = 'not-allowed';
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  This creates a new element, to use in the data table header row. This is
     *  the tooltip part of the header row. It creates both the icon and tooltip
     *  box, which appears when hovering or clicking on the icon. For styling it
     *  uses the same style classes, as the built-in ones, so it appears similar
     */
    function createTooltip (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('i')
            nodeInner.classList.add('fas');
            nodeInner.classList.add('fa-info-circle');
            nodeInner.classList.add('tooltip-color-gray');
            nodeInner.setAttribute ('data-tooltip-trigger', 'hover,click');
            nodeInner.setAttribute ('data-theme', 'dark');
            nodeInner.setAttribute ('data-placement', 'bottom');
            nodeInner.setAttribute ('data-tooltip', text);
            nodeOuter.appendChild  (nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  This takes the current query string, splits it up into components and it
     *  then iterates through all the key, value pairs. If there is any existing
     *  keys, which matches the one we are trying to insert, it is removed. This
     *  means that any existing query parameters are kept intact, such that, the
     *  final path returned, always have the same path with the new key appended
     */
    function createLink (key, target)
    {
        for (var queries = window.location.search.substr(1).split('&'), results = [], i = 0; i < queries.length; i++)
        {
            if (queries[i].toLowerCase().startsWith(key.toLowerCase()) == false)
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
    if (settings.InvestmentsUseLoanTypeLinks)
    {
        DomMonitor(dataTable, function (mutations)
        {
            for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var node = rows[i].querySelector('td.m-loan-type');
                var data =
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
                
                node.innerHTML = '<a href="' + createLink('pledge_groups[]', data[node.innerText]) + '">' + node.innerText + '</a>';
            }
        });
    }
    
    /*
     *  This will hide the country flag which is currently being shown inside of
     *  the loan ID. Instead of having it here, this will create an entirely new
     *  column, at the beginning of the line which has both the country flag and
     *  the country name. This is not sortable, and shows full country name text
     */
    if (settings.InvestmentsShowCountryColumn)
    {
        thead.firstChild.insertBefore(createHeader ('Country'                                   ), thead.firstChild.firstChild);
        thead.lastChild .insertBefore(createTooltip('The country where this loan was taken out.'), thead.lastChild .firstChild);
        
        DomMonitor(dataTable, function (mutations)
        {
            for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var link  = rows[i].querySelector('td.loan-id-col');
                var node  = getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Country');
                
                if (node === undefined)
                {
                    flag                                        = document.createElement('img');
                    text                                        = document.createElement('span');
                    node                                        = document.createElement('td');
                    flag.style.padding                          = '0px 0px 2px 0px';
                    link.style.padding                          = '0px 0px 0px 0px';
                    link.querySelector('a')  .style.paddingLeft = '0px';
                    link.querySelector('img').style.display     = 'none';
                    
                    node.setAttribute('data-m-label', 'Country');
                    node.appendChild(flag);
                    node.appendChild(text);
                    
                    rows[i].insertBefore(node, rows[i].firstChild);
                }
                
                node.querySelector('img' ).src       = link.querySelector('img').src;
                node.querySelector('span').innerText = ' ' + link.querySelector('img').title;
            }
        });
    }
});
