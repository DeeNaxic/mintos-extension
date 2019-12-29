/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'InvestmentsShowProfitColumn'       : true,
        'InvestmentsShowDurationColumn'     : true,
        'InvestmentsUseLoanTypeLinks'       : false
    },
    
    function (settings)
    {
        function runtime (settings)
        {
            /*
             *  This try catch is meant to handle the cases, where Mintos have not fully
             *  loaded the website yet. As a result, some things might not have appeared
             *  on the website. We try to get everything and if anything turns out to be
             *  empty (null or undefined), we stop further execution and reload the code
             *  in 0.1 seconds using a timeout. This is done until the page successfully
             *  loads, and has everything assigned, at which point the runtime continues
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
                thead.firstChild.appendChild(createHeader (localization('Duration')));
                thead.lastChild .appendChild(createTooltip(localization('DurationDescription')));
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cells = rows[i].querySelectorAll('td');
                        var days  = Math.floor(Math.abs((toDate(rows[i].querySelector('td.m-loan-issued').innerText).getTime() - toDate(getElementByAttribute(cells, 'data-m-label', localization('$Finished')).innerText).getTime()) / 86400000));
                        var node  = getElementByAttribute(cells, 'data-m-label', 'Duration');
                        
                        if (node === undefined)
                        {
                            node  = document.createElement('td');
                            node.setAttribute  ('data-m-label', 'Duration');
                            node.classList.add ('global-align-right');
                            rows[i].appendChild(node);
                        }
                        
                        node.innerText = days + ' ' + localization('Days');
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
                thead.firstChild.appendChild(createHeader (localization('Profit')));
                thead.lastChild .appendChild(createTooltip(localization('ProfitDescription')));
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cells   = rows[i].querySelectorAll('td');
                        var profit  = toFloat(getElementByAttribute(cells, 'data-m-label', localization('$ReceivedPayments')).innerText) - toFloat(getElementByAttribute(cells, 'data-m-label', localization('$MyInvestment')).innerText);
                        var node    = getElementByAttribute(cells, 'data-m-label', 'Profit');
                        
                        if (node === undefined)
                        {
                            node = document.createElement('td');
                            node.setAttribute  ('data-m-label', 'Profit');
                            node.classList.add ('global-align-right');
                            rows[i].appendChild(node);
                        }
                        
                        if (profit < 0.00)
                        {
                            node.style.color = 'black';
                            node.innerText   = 'n/a';
                        }
                        else
                        {
                            node.style.color = 'green';
                            node.innerText   = getCurrencySymbol(getElementByAttribute(cells, 'data-m-label', localization('$ReceivedPayments')).innerText) + ' ' + profit.toFixed(2);
                        }
                    }
                });
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
                    for (var data = {}, lines = document.querySelectorAll('#sel-pledge-groups option'), i = 0; i < lines.length; i++)
                    {
                        data[lines[i].innerText] = lines[i].value;
                    }
                    
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var node              = rows[i].querySelector('td.m-loan-type');
                            node.style.color  = '#3f85f4';
                            node.style.cursor = 'pointer';
                            
                            node.onclick = function (e)
                            {
                                window.location.href = createLink('pledge_groups[]', data[e.target.innerText]);
                            }
                    }
                });
            }
        }
        
        function localization (field)
        {
            var translations =
            {
                'Duration' :
                {
                    'en' : 'Duration',
                    'de' : 'Dauer',
                    'pl' : 'Czas trwania',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'DurationDescription' :
                {
                    'en' : 'The total amount of days which you held this note.',
                    'de' : 'Zeitraum des Darlehens in Tagen.',
                    'pl' : 'Łączna liczba dni, w których posiadałeś pożyczkę.',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Days' :
                {
                    'en' : 'days',
                    'de' : 'tage',
                    'pl' : 'dni',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Profit' :
                {
                    'en' : 'Profit',
                    'de' : 'Profitieren',
                    'pl' : 'Zysk',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'ProfitDescription' :
                {
                    'en' : 'The total profit made from this note, calculated as the total received payments minus the investment amount you spent on buying it.',
                    'de' : 'Der Gesamtgewinn des Darlehens berechnet als gesamt erhaltene Zahlung minus der Summe, die Sie zum Kauf aufgewendet haben.',
                    'pl' : 'Całkowity zysk uzyskany z pożyczki, obliczany na podstawie uzyskanych zapłat minus wkład inwestycyjny włożony w kupno.',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$Finished' :
                {
                    'en' : 'Finished',
                    'de' : 'Zurückgezahlt',
                    'pl' : 'Finished',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$ReceivedPayments' :
                {
                    'en' : 'Received Payments',
                    'de' : 'Eingegangene Zahlungen',
                    'pl' : 'Otrzymane płatności',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$MyInvestment' :
                {
                    'en' : 'My Investment',
                    'de' : 'Meine Investition',
                    'pl' : 'Moja inwestycja',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                }
            };
            
            return translations[field][document.location.pathname.substring(1, 3)];
        }
        
        runtime(settings);
    }
);
