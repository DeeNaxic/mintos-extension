/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {iso_code} from '../common/data'
import {assert, DomMonitorAggressive, insertElementBefore, toFloat} from '../common/util';

chrome.storage.sync.get
(
    {
        'OverviewHideEmptyRows'             : true,
        'OverviewShowPercentages'           : true,
        'OverviewShowButtonInstead'         : true,
        'OverviewHighlightNegativeNumbers'  : true,
        'OverviewGrayOutVisitedNews'        : true,
        'OverviewBreakdownRewards'          : true
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
                var boxes           = assert(document.querySelectorAll('table'));
                var boxBalance      = assert(boxes[0]);
                var boxReturns      = assert(boxes[1]);
                var boxAmount       = assert(boxes[2]);
                var boxNumber       = assert(boxes[3]);
                var toggle          = assert(0);
                var newsTable       = assert(document.querySelector('.news-feed'));
                var callbacks       = assert([]);
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            /*
             *  This goes through all of the four boxes, on the overview page, including
             *  the initially hidden one. It then iterate through all rows, in the boxes
             *  and picks the value column. If this value when cast to a float, and then
             *  to a string is zero, the display style of none is added to hide that row
             */
            if (settings.OverviewHideEmptyRows)
            {
                function $runHideEmptyRows ()
                {
                    boxes.forEach(function (box)
                    {
                        for (var rows = box.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
                        {
                            if (toFloat(rows[i].querySelectorAll('td')[1].innerText).toFixed(2) == '0.00')
                            {
                                rows[i].style.display = 'none';
                            }
                            else
                            {
                                rows[i].style.display = '';
                            }
                        }
                    });
                }
                
                callbacks.push($runHideEmptyRows); $runHideEmptyRows();
            }
            
            /*
             *  This will insert a third column to all tables where the percentage makes
             *  sense. This includes the balance box, and the investment summaries boxes
             *  It declares a local function, which can be used to insert the cell, with
             *  two floats, the current number and the total amount. This will calculate
             *  percentage automatically. This also handles switching the existing style
             */
            if (settings.OverviewShowPercentages)
            {
                function $insertPercentageCell (source, total)
                {
                    var percent = toFloat(source.innerText) / total * 100.00;
                    var node    = source.parentElement.querySelector('.percent')
                    
                    if (node == undefined)
                    {
                        node  = document.createElement('td');
                        node.classList.add('percent');
                        source.parentNode.insertBefore(node, source.nextSibling);
                    }
                    
                    if (Math.abs(percent) == Infinity)
                    {
                        node.innerText = 'n/a';
                    }
                    else
                    {
                        node.innerText = percent.toFixed(2) + '%';
                    }
                }
                
                function $runShowPercentages ()
                {
                    if (boxBalance.querySelector('.em span'))
                    {
                        boxBalance.querySelectorAll('tr').forEach(function (row)
                        {
                            $insertPercentageCell(row.querySelectorAll('td')[1], toFloat(boxBalance.querySelector('.em span').innerText));
                        });
                    }
                    
                    if (boxAmount .querySelector('.em span'))
                    {
                        boxAmount .querySelectorAll('tr').forEach(function (row)
                        {
                            $insertPercentageCell(row.querySelectorAll('td')[1], toFloat(boxAmount .querySelector('.em span').innerText));
                        });
                    }
                    
                    if (boxNumber .querySelector('.em span'))
                    {
                        boxNumber .querySelectorAll('tr').forEach(function (row)
                        {
                            $insertPercentageCell(row.querySelectorAll('td')[1], toFloat(boxNumber .querySelector('.em span').innerText));
                        });
                    }
                }
                
                callbacks.push($runShowPercentages); $runShowPercentages();
            }
            
            /*
             *  This is a purely cosmetic change, which doesn't do anything. It replaces
             *  the two raido button, for switching between displayed loans, to the type
             *  of button used in the other two columns. It just hides the original ones
             *  and then registers an event listener, on the new button, whitch switches
             *  between clicking on either of the radio buttons in a very cruede fashion
             */
            if (settings.OverviewShowButtonInstead)
            {
                document.querySelectorAll('.radios label')[0].style.display = 'none';
                document.querySelectorAll('.radios label')[1].style.display = 'none';
                
                var nodeOuter = document.createElement('div');
                    nodeOuter.classList.add('btn-container');
                    nodeOuter.classList.add('mod-pb');
                    
                var nodeInner = document.createElement('a');
                    nodeInner.classList.add('btn');
                    nodeInner.classList.add('btn-primary');
                    nodeInner.innerText = localization('Switch');
                    
                    nodeOuter.appendChild(nodeInner);
                    nodeInner.addEventListener('click', function ()
                    {
                        document.querySelector('.radios').querySelectorAll('label')[toggle == 1 ? (toggle = 0) : (toggle = 1)].click();
                    });
                    
                document.querySelector('.radios').appendChild(nodeOuter);
            }
            
            /*
             *  This will add an inline style, of color red to any number which is below
             *  zero. It does this by iterating all rows, in the returns box, and taking
             *  the second cell in each of them, which is the value that hold the number
             *  and then checks the value. Note that it only checks the box returns rows
             */
            if (settings.OverviewHighlightNegativeNumbers)
            {
                function $runHighlightNegativeNumbers ()
                {
                    boxReturns.querySelectorAll('tr').forEach(function (row)
                    {
                        if (toFloat(row.lastChild.innerText) < 0.00)
                        {
                            row.lastChild.style.color = 'red';
                        }
                        else
                        {
                            row.lastChild.style.color = '#555';
                        }
                    });
                }
                
                callbacks.push($runHighlightNegativeNumbers); $runHighlightNegativeNumbers();
            }
            
            /*
             *  This feature enables a memory cache, which remembers all of the articles
             *  that you read. When you visit a new article link, from the overview page
             *  it will be remembered, and the link will be greyed out after visiting it
             */
            if (settings.OverviewGrayOutVisitedNews)
            {
                chrome.storage.sync.get(
                {
                    '$newsArticles' : []
                },
                function (list)
                {
                    for (var rows = newsTable.querySelectorAll('.blog-post a'), i = 0; i < rows.length; i++)
                    {
                        let line = rows[i];
                        let href = line.getAttribute('href');
                        
                        if (list.$newsArticles.includes(href))
                        {
                            line.style.color = '#d1d1d1';
                        }
                        else
                        {
                            line.onclick = function ()
                            {
                                chrome.storage.sync.get(
                                {
                                    '$newsArticles' : []
                                },
                                function (list)
                                {
                                    list.$newsArticles.push(href);
                                    
                                    chrome.storage.sync.set(
                                    {
                                        ['$newsArticles'] : list.$newsArticles
                                    },
                                    function ()
                                    {
                                        line.style.color = '#d1d1d1';
                                    })
                                })
                            }
                        }
                    }
                })
            }
            
            /*
             *  Experimental
             */
            if (settings.OverviewBreakdownRewards)
            {
                function $insertReturnsRow (campaign, data, symbol, target, text)
                {
                    if (parseFloat(data.balances[iso_code(symbol)][target]) > 0.00)
                    {
                        var tr = document.createElement('tr');
                            tr.classList.add('campaign');
                            
                        var td = document.createElement('td');
                            td.innerText = text;
                            tr.appendChild(td);
                            
                        var td = document.createElement('td');
                            td.innerText = symbol + ' ' + parseFloat(data.balances[iso_code(symbol)][target]).toFixed(2);
                            tr.appendChild(td);
                            
                        insertElementBefore(tr, campaign);
                    }
                }
                
                function $runBreakdownRewards ()
                {
                    for (var ls = document.getElementsByClassName('campaign'), i = ls.length - 1; i >= 0; i--)
                    {
                        ls[i].remove();
                    }
                    
                    if (document.querySelector('.overview-box .header span') == null)
                    {
                        return;
                    }
                    
                    var data     = JSON.parse(document.querySelector('#withdraw').getAttribute('data-account'));
                    var symbol   = document.querySelector('.overview-box .header span').innerText.match(/\S+/)[0];
                    
                    if (iso_code(symbol) == null)
                    {
                        return;
                    }
                    
                    for (var row = null, ls = boxReturns.querySelectorAll('tr'), i = 0; i < ls.length; i++)
                    {
                        if (ls[i].innerText.includes(localization('$CampaignText')))
                        {
                            row = ls[i]; row.style.display = 'none'; break;
                        }
                    }
                    
                    $insertReturnsRow(row, data, symbol, 'totalReceivedReferAfriendBonus', 'Refer-a-friend bonus');
                    $insertReturnsRow(row, data, symbol, 'totalReceivedAffiliateBonus',    'Affiliate bonus'     );
                    $insertReturnsRow(row, data, symbol, 'totalReceivedCashbackBonus',     'Cashback bonus'      );
                    $insertReturnsRow(row, data, symbol, 'totalReceivedActivationBonus',   'Activation bonus'    );
                    $insertReturnsRow(row, data, symbol, 'totalReceivedWelcomeBonus',      'Welcome bonus'       );
                    $insertReturnsRow(row, data, symbol, 'totalReceivedBonus',             'Bonus'               );
                }
                
                callbacks.push($runBreakdownRewards);
                $runBreakdownRewards();
            }
            
            /*
             *  Whenever a change in the balance box occours, that means that a currency
             *  change was made, and as so, we should update all of the numbers from the
             *  page. This is sort of a semi-hotfix making different currencies possible
             */
            DomMonitorAggressive(boxBalance, function (mutations)
            {
                callbacks.forEach(function (callback)
                {
                    callback();
                });
            });
        }
        
        function localization (field)
        {
            var translations =
            {
                'Switch' :
                {
                    'en' : 'Switch Metric',
                    'de' : 'Veränderung',
                    'pl' : 'Zmiana',
                    'cs' : 'Přepnout částky/počty',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$CampaignText' :
                {
                    'en' : 'Campaign Rewards',
                    'de' : 'Mehr verdienen',
                    'pl' : 'Zarabiaj więcej',
                    'cs' : 'Odměny z kampaní',
                    'es' : 'Recompensas de la campaña',
                    'lv' : 'Akcijas balvas',
                    'ru' : 'Призы акции'
                }
            };
            
            return translations[field][document.location.pathname.substring(1, 3)];
        }
        
        runtime(settings);
    }
);
