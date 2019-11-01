/*
 *  @project >> Investment Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'InvestmentsShowDaysToNextPayment'  : true,
        'InvestmentsHighlightLateLoans'     : true,
        'InvestmentsShowPremiumDiscount'    : true,
		'InvestmentsUseLoanTypeLinks'       : true
    },
    
    function (settings)
    {
        function runtime (settings)
        {
            /*
             *  This try catch is meant to handle the cases, where Mintos have not fully
             *  loaded the website yet. As a result, some things might not have appeared
             *  on the website. We try to get everything and if anything turns out to be
             *  empty (null or undefined), we stop further execution and reload the page
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
             *  This will replace the 'next payment date' columns, so instead of showing
             *  the date of the next payment, it shows the amount of days instead. Those
             *  loans whitch are late, doesn't change. Any any loan date today, is shown
             *  as 0 days. It hides the original field, rather than replacing the values
             */
            if (settings.InvestmentsShowDaysToNextPayment)
            {
                getElementByAttribute(document.querySelector('thead tr').querySelectorAll('th'), 'data-sort-field', 'next_planned_payment_date').querySelector('span').innerHTML = localization('DaysToNext');
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cell  = getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', localization('$NextPayment'));
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
                            node.innerText = Math.floor((toDate(time.innerText) - new Date().setHours(0, 0, 0, 0)) / 86400000) + ' ' + localization('Days');
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
            if (settings.InvestmentsHighlightLateLoans)
            {
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        if (getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', localization('$Term')).innerText.indexOf(localization('$Late')) + 1 > 0)
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
            
            /*
             *  This adds a percentage counter after each note, that is for sale showing
             *  the added premium as a + number or discount as some negative number. The
             *  original number is still shown, but it becomes easier to see which notes
             *  have been set on sale with a premium / discount, no change is also shown
             */
            if (settings.InvestmentsShowPremiumDiscount)
            {
                function $getPercentage (input) 
                {
                    return parseFloat(/(-?\d+\.\d+)%/g.exec(input)[0]);
                }
                
                DomMonitor(dataTable, function (mutations)
                {
                    for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                    {
                        var cell    = rows[i].lastElementChild;
                        var span    = cell.querySelectorAll('span')[1];
                        var percent = $getPercentage(span.getAttribute('data-tooltip'));
                        
                        if (span.hasAttribute('data-value') == false)
                        {
                            span.setAttribute('data-value', span.innerText);
                        }
                        
                        span.innerHTML = span.getAttribute('data-value') + ' <span style="color:' + (percent < 0.0 ? 'green' : (percent > 0.0 ? 'red' : 'black')) + ';">' + (percent < 0.0 ? ' - ' : ' + ') + Math.abs(percent).toFixed(1) + '%</span>';
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
						var node	 		  = rows[i].querySelector('.m-loan-id span');
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
        
        function localization (key)
        {
            var translations =
            {
                'DaysToNext' :
                {
                    'en' : 'Days To<br>Next Payment',
                    'de' : 'Tage bis zur<br>nächsten Zahlung',
					'pl' : 'Dni do<br>następnej opłaty',
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
                '$Late' :
                {
                    'en' : 'Late',
                    'de' : 'In Verzug',
					'pl' : 'Opóźnienie',
					'cs' : '?',
					'es' : '?',
					'lv' : '?',
					'ru' : '?'
                },
                '$NextPayment' :
                {
                    'en' : 'Next Payment Date',
                    'de' : 'Nächster Zahlungstermin',
					'pl' : 'Data następnej płatności',
					'cs' : '?',
					'es' : '?',
					'lv' : '?',
					'ru' : '?'
                },
                '$Term' :
                {
                    'en' : 'Term',
                    'de' : 'Laufzeit',
					'pl' : 'Okres',
					'cs' : '?',
					'es' : '?',
					'lv' : '?',
					'ru' : '?'
                }
            };
            
            return translations[key][document.location.pathname.substring(1, 3)];
        }
        
        runtime(settings);
    }
);
