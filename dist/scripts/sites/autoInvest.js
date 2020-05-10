import { a as assert, i as insertElementBefore, t as toFloat } from '../../util-0f82c846.js';

/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'AutoInvestHighlightUtilityUse'     : true,
        'AutoInvestShowUtilizationPercent'  : true
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
                var table           = assert(document.querySelector('.autoinvest-list'));
                var tableHead       = assert(document.querySelector('.autoinvest-list__head'));
                var tableBody       = assert(document.querySelector('.autoinvest-list__body'));
                var callbacks       = assert([]);
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            /*
             *  This will highlight the background of rows where the utilization is over
             *  80% with a green tint, and rows with a utilization of below 20% in a red
             *  tint. This help you see which strategies has to be adjusted, as they are
             *  not actually getting enough loans, with the current settings, to max out
             */
            if (settings.AutoInvestHighlightUtilityUse)
            {
                function $redrawBackground ()
                {
                    tableBody.querySelectorAll('tr').forEach(function (row)
                    {
                        var cells   = row.querySelectorAll('.autoinvest-list__portfolio-size__amount-wrapper span');
                        var percent = toFloat(cells[0].innerText) / toFloat(cells[1].innerText) * 100.00;
                        
                        if (percent > 80.00)
                        {
                            row.style.background = '#efffed';
                        }
                        else
                        if (percent < 20.00)
                        {
                            row.style.background = '#ffeded';
                        }
                        else
                        {
                            row.style.background = '';
                        }
                    });
                }
                
                callbacks.push($redrawBackground); $redrawBackground();
            }
            
            /*
             *  This will inject a column into the auto invest strategy table, which has
             *  the percent utilization shown. This is calculated as current investments
             *  and the target portfolio size. This number is useful, to see utilization
             */
            if (settings.AutoInvestShowUtilizationPercent)
            {
                function $addPercentages ()
                {
                    tableBody.querySelectorAll('tr').forEach(function (row)
                    {
                        var cells   = row.querySelectorAll('.autoinvest-list__portfolio-size__amount-wrapper span');
                        var percent = toFloat(cells[0].innerText) / toFloat(cells[1].innerText) * 100.00;
                        var node    = row.querySelector('.percent');
                        
                        if (node == null)
                        {
                            node = document.createElement('td');
                            node.classList.add('percent');
                            node.style.textAlign = 'right';
                            insertElementBefore(node, row.querySelector('.autoinvest-list__portfolio-size'));
                        }
                        
                        node.innerText = percent.toFixed(2) + '%';
                    });
                }
                
                var node = document.createElement('th');
                    node.innerText = localization('Utilization');
                    insertElementBefore(node, tableHead.querySelector('.autoinvest-list__head__invested-amount'));
                
                callbacks.push($addPercentages); $addPercentages();
            }
            
            for (var ls = document.querySelectorAll('.autoinvest-list__priority__button, .ai-currency-tabs__button'), i = 0; i < ls.length; i++)
            {
                ls[i].addEventListener('click', function ()
                {
                    setTimeout(function ()
                    {
                        callbacks.forEach(function (callback)
                        {
                            callback();
                        });
                    },
                    100
                    );
                });
            }
        }
        
        function localization (field)
        {
            var translations =
            {
                'Utilization' :
                {
                    'en' : 'Utilization',
                    'de' : 'Nutzung',
                    'pl' : 'Wykorzystanie',
                    'cs' : 'Naplnění limitu',
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
