/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {assert, getElementByAttribute, DomMonitor} from '../common/util';

chrome.storage.sync.get
(
    {
        'InvestmentsShowCountryColumn'      : true,
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
                return setTimeout(runtime, 100, settings);
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
             *  This will hide the country flag which is currently being shown inside of
             *  the loan ID. Instead of having it here, this will create an entirely new
             *  column, at the beginning of the line which has both the country flag and
             *  the country name. This is not sortable, and shows full country name text
             */
            if (settings.InvestmentsShowCountryColumn)
            {
                thead.firstChild.insertBefore(createHeader (localization('Country')           ), thead.firstChild.firstChild);
                thead.lastChild .insertBefore(createTooltip(localization('CountryDescription')), thead.lastChild .firstChild);
                
                DomMonitor(dataTable, function (mutations)
                {
                    fixSummaryRows(tbody);
    
                    for (var rows = tbody.querySelectorAll('tr:not(.total-row)'), i = 0; i < rows.length; i++)
                    {
                        var link  = rows[i].querySelector('td.loan-id-col');
                        var node  = getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Country');
                        
                        if (node === null)
                        {
                            const flag                                  = document.createElement('img');
                            const text                                  = document.createElement('span');
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
        }
        
        function localization (field)
        {
            var translations =
            {
                'Country' :
                {
                    'en' : 'Country',
                    'de' : 'Land',
                    'pl' : 'Kraj',
                    'cs' : 'Stát',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'CountryDescription' :
                {
                    'en' : 'The country where this loan was taken out.',
                    'de' : 'Das Land in welchem dieses Darlehen bezogen wurde.',
                    'pl' : 'Kraj w którym została wzięta pozyczka.',
                    'cs' : 'Stát ve kterém byla půjčka poskytnuta.',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                }
            };
            
            return translations[field][document.location.pathname.substring(1, 3)];
        }
        
        function fixSummaryRows (tbody)
        {
            for (const row of tbody.querySelectorAll('tr.total-row'))
            {
                if (row.querySelector('td.loan-country-col') !== null)
                    continue;
    
                const countryCell = document.createElement('td');
                countryCell.classList.add('loan-country-col');
                
                // move summary labels to the new first row
                for (const child of row.querySelector('.loan-id-col').childNodes)
                    countryCell.append(child);

                row.insertAdjacentElement("afterbegin", countryCell);
            }
        }
        
        runtime(settings);
    }
);
