/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'AccountOverviewUseFourDecimals'    : false,
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
                var dataSummary     = assert(document.querySelector('#overview-results tbody'));
                var dataTable       = assert(document.querySelector('#overview-details tbody'));
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            /*
             *  This replaces the default two digit representation with four digits. The
             *  problem with the default implementation is, that it might show a gain of
             *  '0.00' which can be confusing. Mintos solved this by including the value
             *  in the hover-text. This is also where the actual text value is gotten of
             */
            if (settings.AccountOverviewUseFourDecimals)
            {
                function $formatDecimals ()
                {
                    dataSummary.querySelectorAll('.mod-pointer').forEach(function (row)
                    {
                        row.innerText           = row.getAttribute('data-tooltip').replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    });
                    
                    dataTable.querySelectorAll('tr').forEach(function (row)
                    {
                        var turnover            = row.querySelector('.turnover span');
                            turnover.innerText  = turnover .title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                        
                        var remainder           = row.querySelector('.remainder span');
                            remainder.innerText = remainder.title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    });
                }
                
                DomMonitorAggressive(dataTable, function (mutations)
                {
                    $formatDecimals();
                });
                
                $formatDecimals();
                $add_timespan_always();
            }
        }

        function $add_timespan_always() {

            const always_a = document.createElement('a');
            always_a.innerText = localization('timespan');
            always_a.href = 'javascript:;';
            always_a.setAttribute('data-value', 'always');

            always_a.addEventListener('click', function (event) {
                document.querySelectorAll('li.m-quickfilter-item > a:not([data-value = "always"])').forEach(function (elem) {
                    elem.classList.remove('active')
                });
                always_a.classList.add('active');
                document.querySelector('#period-from').value = '1.1.1950';
                var d = new Date();
                document.querySelector('#period-to').value = d.getDate()
                    + '.' + d.getMonth()
                    + '.' + d.getFullYear();
                document.querySelector('#filter-button').click()
            });

            const always_li = document.createElement('li');
            always_li.classList.add('m-quickfilter-item');
            always_li.appendChild(always_a);
            document.querySelector('#quickfilters').appendChild(always_li);

            document.querySelectorAll('li.m-quickfilter-item > a:not([data-value = "always"])').forEach(function (elem) {
                elem.addEventListener('click', function (event) {
                    always_a.classList.remove('active');
                })
            });
        }

        function localization (field)
        {
            var translations =
                {
                    'timespan' :
                        {
                            'en' : 'All the time',
                            'de' : 'Ganze Zeit',
                            'pl' : 'Od początku',
                            'cs' : '?',
                            'es' : '?',
                            'lv' : '?',
                            'ru' : '?'
                        }
                };

                    'en' : 'Alltime',
                    'de' : 'Ganze Zeit',
                    'pl' : 'Od początku',
                    'cs' : 'Kompletní historie',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                }
            return translations[field][document.location.pathname.substring(1, 3)];
        }

        runtime(settings);
    }
);
