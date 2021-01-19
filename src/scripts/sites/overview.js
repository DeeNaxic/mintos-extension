/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {iso_code} from '../common/data'
import {
    assert,
    chrome,
    DomMonitorAggressive,
    insertElementBefore,
    onNodesAvailable,
    reportNodesAvailable,
    toFloat
} from '../common/util';
import {
    enhanceCardsDom,
    enhanceCardsModel,
    grayOutVisitedNews,
    renderCardsModel,
    updateCardsModel
} from "../components/overview";

const model = {
    cards : [],
}

export async function handle ()
{
    reportNodesAvailable([
        '.m-o-grid',
        'div.mw-overview-card',
        '.mw-overview-card span:nth-child(2)',
        '.mw-overview-card__aggregate--total span:nth-child(2)',
        '.blog a',
    ]);
    
    const settings = await chrome.storage.sync.get({
        'OverviewHideEmptyRows'            : true,
        'OverviewShowPercentages'          : true,
        'OverviewShowButtonInstead'        : true,
        'OverviewHighlightNegativeNumbers' : true,
        'OverviewGrayOutVisitedNews'       : true,
        'OverviewBreakdownRewards'         : true
    });
    
    try
    {
        const {
                  blog,
                  grid
              } = await onNodesAvailable({
            blog : 'div.blog',
            grid : '.m-o-grid',
            _values : 'div.mw-overview-card span:nth-child(2)',
            _totals : '.mw-overview-card__aggregate--total span:nth-child(2)',
        })
    
        enhanceDom(settings, {blog, grid});
    
        updatePage(settings, grid);
    
        DomMonitorAggressive(grid, () => updatePage(settings, grid))
    } catch (x)
    {
        console.error(x);
    }
}

/**
 * Apply initial changes to DOM, without monitoring for live page updates
 */
function enhanceDom (settings, nodes)
{
    if (settings.OverviewGrayOutVisitedNews)
    {
        grayOutVisitedNews(nodes.blog);
    }
    
    enhanceCardsDom(settings, nodes.grid);
}

function updatePage (settings, grid)
{
    updateCardsModel(grid, model.cards);
    enhanceCardsModel(model);
    // console.debug(model);
    renderCardsModel(settings, model.cards, grid);
}

// all code below is deprecated, doesn't work and is kept for reference only
chrome.storage.sync.get
(
    {
        'OverviewHideEmptyRows'            : true,
        'OverviewShowButtonInstead'        : true,
        'OverviewHighlightNegativeNumbers' : true,
        'OverviewGrayOutVisitedNews'       : true,
        'OverviewBreakdownRewards'         : true
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
