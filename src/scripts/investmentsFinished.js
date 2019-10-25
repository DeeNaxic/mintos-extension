/*
 *  @project >> Investment Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 */

chrome.storage.sync.get
(
    {
        'InvestmentsShowProfitColumn'       : true,
        'InvestmentsShowDurationColumn'     : true
    },
    
    function (settings)
    {
        function runtime (settings)
        {
            /*
             *  This try catch is meant to handle the cases, where Mintos have not fully
             *  loaded the website yet. As a result, some things might not have appeared
             *  on the website. We try to get everything and if anything turns out to be
             *  empty (null or undefined), we stop the execution and attempt a reloading
             */
            try
            {
                var dataTable       = assert(document.querySelector('#investor-investments-table'));
                var thead           = assert(dataTable.querySelector('thead'));
                var tbody           = assert(dataTable.querySelector('tbody'));
            }
            catch
            {
                return setTimeout(runtime, 0.1, settings);
            }
            
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
             *  This will add a column with total duration to the end of each row in the
             *  data table, for finished investments. It starts by inserting the headers
             *  of the table, and then registers a DomListener. This listener trigger on
             *  both sorting and filtering actions, and if the cell already exists, then
             *  it will simply update it. If it does not, then it inserts the data cells
             */
            if (settings.InvestmentsShowDurationColumn)
            {
                thead.firstChild.appendChild(createHeader ('Duration')); // todo: localize
                thead.lastChild .appendChild(createTooltip('The total amount of days which you held this note.')); // todo: localize
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cells = rows[i].querySelectorAll('td');
                        var days  = Math.floor(Math.abs((toDate(rows[i].querySelector('td.m-loan-issued').innerText).getTime() - toDate(getElementByAttribute(cells, 'data-m-label', 'Finished').innerText).getTime()) / 86400000));
                        var node  = getElementByAttribute(cells, 'data-m-label', 'Duration'); // todo: localize
                        
                        if (node === undefined)
                        {
                            node  = document.createElement('td');
                            node.setAttribute  ('data-m-label', 'Duration'); // todo: localize
                            node.classList.add ('global-align-right');
                            rows[i].appendChild(node);
                        }
                        
                        node.innerText = days + ' days'; // todo: localize
                    }
                });
            }
            
            /*
             *  This will add a column with assumed profit to the end of each row in the
             *  data table, for finished investments. It starts by inserting the headers
             *  of the table, and then registers a DomListener. This listener trigger on
             *  both sorting and filtering actions, and if the cell already exists, then
             *  it will simply update it. If it does not, then it inserts the data cells
             */
            if (settings.InvestmentsShowProfitColumn)
            {
                thead.firstChild.appendChild(createHeader ('Profit')); // todo: localize
                thead.lastChild .appendChild(createTooltip('The total profit made from this note, calculated as the total received payments minus the investment amount you spent on buying it.')); // todo: localize
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cells   = rows[i].querySelectorAll('td');
                        var profit  = toFloat(getElementByAttribute(cells, 'data-m-label', 'Received Payments').innerText) - toFloat(getElementByAttribute(cells, 'data-m-label', 'My Investment').innerText); // todo: localize
                        var node    = getElementByAttribute(cells, 'data-m-label', 'Profit'); // todo: localize
                        
                        if (node === undefined)
                        {
                            node = document.createElement('td');
                            node.setAttribute  ('data-m-label', 'Profit'); // todo: localize
                            node.classList.add ('global-align-right');
                            rows[i].appendChild(node);
                        }
                        
                        node.style.color = profit > 0.00 ? 'green' : 'red';
                        node.innerText   = getCurrencySymbol(getElementByAttribute(cells, 'data-m-label', 'Received Payments').innerText) + ' ' + profit.toFixed(2); // todo: localize
                    }
                });
            }
        }
        
        runtime(settings);
    }
);
