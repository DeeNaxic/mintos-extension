/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get
(
    {
        'LoanShowCountryRow'                : true,
        'LoanShowNextPaymentRow'            : true,
        'LoanShowOntimePaymentPercent'      : true,
        'LoanShowTotalGraceTime'            : true,
        'LoanFormatInvestmentBreakdown'     : true,
        'LoanShowAdditionalRatings'         : true,
        'LoanShowPaymentWarning'            : true,
        'LoanShowAgeWarning'                : true,
        'LoanShowJobWarning'                : true,
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
                if (document.location.pathname.match(/^\/\w{2}\/[0-9]+(?:-[0-9]+)?/g) === null)
                {
                    return;
                }
                
                var tables          = assert(document.querySelectorAll('tbody'));
                var details         = assert(tables[0]);
                var borrower        = assert(tables[1]);
                var schedule        = assert(tables[2]);
                var originator      = assert(document.querySelector('.m-group-info'));
            }
            catch
            {
                return setTimeout(runtime, 100, settings);
            }
            
            /*
             *  This is an auxiliary function, which is used to create a new row of data
             *  in the details window. It handles everything from setting the attributes
             *  and adding the styles. The two parameters passed in here, is the headers
             *  text, which is the left column and the content which is the right column
             */
            function createDetailsRow (header, content)
            {
                var nodeOuter = document.createElement('tr');
                    
                var nodeInner           = document.createElement('td');
                    nodeInner.innerText = header;
                    nodeInner.classList.add('field-description');
                    nodeOuter.appendChild(nodeInner);
                    
                var nodeInner           = document.createElement('td');
                    nodeInner.innerText = content;
                    nodeInner.classList.add('value');
                    nodeOuter.appendChild(nodeInner);
                    
                return nodeOuter;
            }
            
            /*
             *  This is similiar to the createDetailsRow function. But it inserts things
             *  such as color and icon, which makes it a warning entry and not just text
             */
            function createDetailsRowWarning (header, content)
            {
                var nodeOuter = document.createElement('tr');
                    
                var nodeInner             = document.createElement('td');
                    nodeInner.innerText   = localization('Warning') + ': ' + header
                    nodeInner.style.color = 'red';
                    nodeInner.classList.add('field-description');
                    nodeOuter.appendChild(nodeInner);
                    
                var nodeInner             = document.createElement('td');
                    nodeInner.innerText   = content;
                    nodeInner.style.color = 'red';
                    nodeInner.classList.add('value');
                    nodeOuter.appendChild(nodeInner);
                    
                return nodeOuter;
            }
            
            /*
             *  This is an auxiliary function, which is used to create a new row of data
             *  in the originator box. It handles everything from setting the attributes
             *  and adding the styles. The two parameters passed in here, is the headers
             *  text, which is the left column and the content which is the right column
             */
            function createOriginatorRow (header, content)
            {
                var nodeOuter = document.createElement('div');
                    nodeOuter.classList.add('row');
                    
                var nodeInner           = document.createElement('div');
                    nodeInner.innerHTML = header;
                    nodeInner.classList.add('field-description');
                    nodeInner.classList.add('col-xs-7');
                    nodeOuter.appendChild(nodeInner);
                    
                var nodeInner           = document.createElement('td');
                    nodeInner.innerText = content;
                    nodeInner.classList.add('value');
                    nodeInner.classList.add('col-xs-5');
                    nodeOuter.appendChild(nodeInner);
                    
                return nodeOuter;
            }
            
            /*
             *  Show a column at the beginning of the detail window, with the country of
             *  the loan, written out as text. There is no flag in this value field. The
             *  reason for this, is that the flag is already shown at the top. But maybe
             *  we should remove it from there, and then add it to the left of the names
             */
            if (settings.LoanShowCountryRow)
            {
                details.insertBefore(createDetailsRow(localization('Country'), document.querySelector('.m-h1 img').title), details.firstChild);
            }
            
            /*
             *  Show the number of days, to the next payment in the loan details windows
             *  If the loan status are finished or default then next payment will not be
             *  shown. If the loan are in grace period, and there are only one scheduled
             *  payment left, then the next payment will instead show as non-applicative
             */
            if (settings.LoanShowNextPaymentRow)
            {
                var days  = null;
                var today = new Date().setHours(0, 0, 0, 0);
                
                if ([localization('$Finished'), localization('$FinishedPrematurely'), localization('$Default')].includes(details.lastChild.lastChild.innerText.trim()) == false)
                {
                    for (var rows = schedule.querySelectorAll('tr'), i = 0; i < rows.length; i++)
                    {
                        var columns = rows[i].querySelectorAll('td');
                        var status  = columns[6].innerText;
                        
                        if ([localization('$Scheduled'), localization('$Late')].includes(status))
                        {
                            days = Math.floor((toDate(columns[0].innerText) - today) / 86400000); break;
                        }
                    }
                }
                
                if (days == null)
                {
                    details.appendChild(createDetailsRow(localization('NextPayment'), 'n/a'));
                }
                else
                {
                    details.appendChild(createDetailsRow(localization('NextPayment'), days > -1 ? days + ' ' + localization('Days') : Math.abs(days) + ' ' + localization('DaysLate')));
                }
            }
            
            /*
             *  This shows a percentage calculation, of how many payments, which were on
             *  time, and how many were delayed. It is shown as a percent out of hundred
             *  and it excludes scheduled payments which has not yet been made. If there
             *  is only scheduled payments the 'n/a' is shown instead of some percentage
             */
            if (settings.LoanShowOntimePaymentPercent)
            {
                var $ontime  = 0;
                var $others  = 0;
                
                schedule.querySelectorAll('tr').forEach(function (element)
                {
                    if (element.lastChild.innerText == localization('$Paid'))
                    {
                        $ontime++;
                    }
                    else
                    if (element.lastChild.innerText == localization('$Scheduled'))
                    {
                        
                    }
                    else
                    {
                        $others++;
                    }
                });
                
                var percent  = $others + $ontime > 0 ? ($ontime / ($others + $ontime) * 100.00).toFixed(0) + '%' : 'n/a';
                var node     = createDetailsRow(localization('OntimePayments'), percent);
                
                details.appendChild(node);
            }
            
            if (settings.LoanShowTotalGraceTime)
            {
                var $days = 0;
                
                schedule.querySelectorAll('tr').forEach(function (element)
                {
                    if (element.lastChild.innerText == localization('$Paid'))
                    {
                        var cells     = element.querySelectorAll('td');
                        var date      = getElementByAttribute(cells, 'data-m-label', localization('$Date'));
                        var date_paid = getElementByAttribute(cells, 'data-m-label', localization('$PaymentDate'));
                        
                        if (date_paid.innerText.trim().length > 0)
                        {
                            $days = $days + Math.floor((toDate(date_paid.innerText.trim()) - toDate(date.innerText.trim())) / 86400000);
                        }
                    }
                });
                
                details.appendChild(createDetailsRow(localization('TimeInGrace'), $days + ' ' + localization('Days')));
            }
            
            /*
             *  Replace the investment breakdown unordered list, with a table. The table
             *  shows the same informations, and the same colours but formated with rows
             *  and cells nicely aligned. It also adds decimals to the value calculation
             */
            if (settings.LoanFormatInvestmentBreakdown)
            {
                function $createHeader ()
                {
                    var nodeOuter                   = document.createElement('tr');
                        
                    var nodeInner                   = document.createElement('th');
                        nodeInner.innerText         = '';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('th');
                        nodeInner.innerText         = localization('Name');
                        nodeInner.style.textAlign   = 'left';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('th');
                        nodeInner.innerText         = localization('Percent');
                        nodeInner.style.textAlign   = 'right';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('th');
                        nodeInner.innerText         = localization('Amount');
                        nodeInner.style.textAlign   = 'right';
                        nodeOuter.appendChild(nodeInner);
                        
                    return nodeOuter;
                }
                
                function $createRow (id, groups)
                {
                    var nodeOuter                   = document.createElement('tr');
                        
                    var nodeInner                   = document.createElement('td');
                        nodeInner.innerHTML         = '<ul id="legend"><li class="' + id + '" style="padding:0px 0px 0px 12px">&nbsp;</li></ul>';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('td');
                        nodeInner.innerText         = groups[1];
                        nodeInner.style.whiteSpace  = 'nowrap';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('td');
                        nodeInner.innerText         = groups[2];
                        nodeInner.style.textAlign   = 'right';
                        nodeInner.style.whiteSpace  = 'nowrap';
                        nodeOuter.appendChild(nodeInner);
                        
                    var nodeInner                   = document.createElement('td');
                        nodeInner.innerText         = toNumber(toFloat(groups[3]).toFixed(2)) + ' ' + getCurrencyPrefix(groups[3]);
                        nodeInner.style.textAlign   = 'right';
                        nodeInner.style.whiteSpace  = 'nowrap';
                        nodeOuter.appendChild(nodeInner);
                        
                    return nodeOuter
                }
                
                var observer = new MutationObserver(function (mutations)
                {
                    var chart                       = document.querySelector('.chart-data');
                    var list                        = chart.querySelector('#legend');
                    var nodeTable                   = document.createElement('table');
                        nodeTable.style.width       = '100%';
                        nodeTable.style.fontSize    = '0.85em';
                        nodeTable.appendChild($createHeader());
                        
                    list.querySelectorAll('li').forEach(function (element)
                    {
                        nodeTable.appendChild($createRow(element.getAttribute('class'), element.innerText.match(/^(.*?)[-<] (\d+%).*?\/ (.*)/)));
                    });
                    
                    list.style.display  = 'none';
                    chart.insertBefore(nodeTable, list);
                    observer.disconnect();
                });
                
                observer.observe(document.querySelector('.chart-data'),
                {
                    childList       : true,
                    subtree         : true,
                    attributes      : false,
                    characterData   : false
                });
            }
            
            /*
             *  This does two things. First it splits the line from Mintos, with ratings
             *  and loan originator name, into two lines. Such that the rating is put on
             *  its own line. It then tries to load up a ranking, from the data document
             *  and creates a new line with the ExploreP2P's assessement of that company
             *  along with a link to their site. The link can is to get an understanding
             *  of how the ratings were calculated. We have gotten permission to use the
             *  ratings, under the agreement that we link to the site they were taken of
             */
            if (settings.LoanShowAdditionalRatings)
            {
                var rows = originator.querySelectorAll('.row');
                var name = rows[0].querySelector('.value a').innerText;
                var rank = rows[0].querySelector('.value span');
                var link = ' (<a href="https://explorep2p.com/mintos-lender-ratings/" target="_blank">reference</a>)';
                
                rank.style.display = 'none';
                
                originator.append(createOriginatorRow('Mintos\'s '     + localization('Rating'),        rank.innerText));
                originator.append(createOriginatorRow('ExploreP2P\'s ' + localization('Rating') + link, rating(name)  ));
            }
            
            /*
             *  Experimental
             */
            if (settings.LoanShowPaymentWarning)
            {
                var $ontime  = 0;
                var $others  = 0;
                
                schedule.querySelectorAll('tr').forEach(function (element)
                {
                    if (element.lastChild.innerText == localization('$Paid'))
                    {
                        $ontime++;
                    }
                    else
                    if (element.lastChild.innerText == localization('$Scheduled'))
                    {
                        
                    }
                    else
                    {
                        $others++;
                    }
                });
                
                if ($ontime / ($others + $ontime) * 100.00 < 60.0)
                {
                    insertElementBefore(createDetailsRowWarning(localization('Payments'), ($ontime / ($others + $ontime) * 100.00).toFixed(2) + '% ' + localization('Ontime')), details.firstChild);
                }
            }
            
            /*
             *  Experimental
             */
            if (settings.LoanShowAgeWarning)
            {
                for (var match = null, rows = borrower.querySelectorAll('tr'), i = 0; i < rows.length; i++)
                {
                    if (rows[i].firstChild.innerText == localization('$Borrower') && (match = rows[i].lastChild.innerText.match(localization('$BorrowerPattern'))))
                    {
                        if (parseInt(match[1]) > 55)
                        {
                            insertElementBefore(createDetailsRowWarning(localization('Age'), match[1] + ' ' + localization('Years')), details.firstChild); break;
                        }
                    }
                }
            }
            
            /*
             *  Experimental
             */
            if (settings.LoanShowJobWarning)
            {
                for (var rows = borrower.querySelectorAll('tr'), i = 0; i < rows.length; i++)
                {
                    if (rows[i].firstChild.innerText == localization('$Occupation'))
                    {
                        if (rows[i].lastChild.innerText.toLowerCase() == 'unemployed')
                        {
                            insertElementBefore(createDetailsRowWarning(localization('$Occupation'), rows[i].lastChild.innerText), details.firstChild); break;
                        }
                    }
                }
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
                'Payments' :
                {
                    'en' : 'Payments',
                    'de' : 'Zahlungen',
                    'pl' : 'Płatności',
                    'cs' : 'Platby',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'TimeInGrace' :
                {
                    'en' : 'Time in grace',
                    'de' : 'Zeit in Schonfrist',
                    'pl' : 'Całkowity czas karencji',
                    'cs' : 'Celkem dní v povoleném odkladu',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Ontime' :
                {
                    'en' : 'on-time',
                    'de' : 'pünktliche',
                    'pl' : 'na czas',
                    'cs' : 'Včasných',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'OntimePayments' :
                {
                    'en' : 'On-time Payments',
                    'de' : 'Pünktliche Zahlungen',
                    'pl' : 'Opłata na czas',
                    'cs' : 'Splátek včas',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Name' :
                {
                    'en' : 'Name',
                    'de' : 'Name',
                    'pl' : 'Imię',
                    'cs' : 'Podíly investorů',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Percent' :
                {
                    'en' : 'Percent',
                    'de' : 'Prozent',
                    'pl' : 'Procent',
                    'cs' : 'Procent',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Amount' :
                {
                    'en' : 'Amount',
                    'de' : 'Anzahl',
                    'pl' : 'Ilość',
                    'cs' : 'Částka',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Rating' :
                {
                    'en' : 'Rating',
                    'de' : 'Bewertung',
                    'pl' : 'Ocena',
                    'cs' : 'Rating',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'NextPayment' :
                {
                    'en' : 'Next Payment',
                    'de' : 'Nächste Zahlung',
                    'pl' : 'Następna opłata',
                    'cs' : 'Další splátka',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Days' :
                {
                    'en' : 'days',
                    'de' : 'Tage',
                    'pl' : 'dni',
                    'cs' : 'dní',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'DaysLate' :
                {
                    'en' : 'days late',
                    'de' : 'Tage zu spät',
                    'pl' : 'Spóźnione dni',
                    'cs' : 'dní v prodlení',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Years' :
                {
                    'en' : 'years',
                    'de' : 'jahre',
                    'pl' : 'lat',
                    'cs' : 'let',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Warning' :
                {
                    'en' : 'Warning',
                    'de' : 'Warnung',
                    'pl' : 'Uwaga',
                    'cs' : 'Pozor',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                'Age' :
                {
                    'en' : 'High age',
                    'de' : 'Hohes Alter',
                    'pl' : 'Wysoki wiek',
                    'cs' : 'Vysoký věk',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$Late' :
                {
                    'en' : 'Late',
                    'de' : 'In Verzug',
                    'pl' : 'Late',
                    'cs' : 'Late',
                    'es' : 'Late',
                    'lv' : 'Kavējas',
                    'ru' : 'Задерживается'
                },
                '$Finished' :
                {
                    'en' : 'Finished',
                    'de' : 'Zurückgezahlt',
                    'pl' : 'Finished',
                    'cs' : 'Ukončené',
                    'es' : 'Amortizado',
                    'lv' : 'Atmaksāts',
                    'ru' : 'Погашен'
                },
                '$FinishedPrematurely' :
                {
                    'en' : 'Finished prematurely',
                    'de' : 'Vorzeitig beendet',
                    'pl' : 'Status Zokończona przed czasem',
                    'cs' : 'Předčasně ukončeno',
                    'es' : 'Amortización anticipada',
                    'lv' : 'Pabeigts priekšlaicīgi',
                    'ru' : 'Преждевременно закончено'
                },
                '$Default' :
                {
                    'en' : 'Default',
                    'de' : '?',
                    'pl' : '?',
                    'cs' : '?',
                    'es' : '?',
                    'lv' : '?',
                    'ru' : '?'
                },
                '$Date' :
                {
                    'en' : 'Date',
                    'de' : 'Datum',
                    'pl' : 'Data',
                    'cs' : 'Date',
                    'es' : 'Fecha',
                    'lv' : 'Datums',
                    'ru' : 'Дата'
                },
                '$Paid' :
                {
                    'en' : 'Paid',
                    'de' : 'Gezahlt',
                    'pl' : 'Zapłacono',
                    'cs' : 'Paid',
                    'es' : 'Pagado',
                    'lv' : 'Samaksāts',
                    'ru' : 'Выплачено'
                },
                '$PaymentDate' :
                {
                    'en' : 'Payment Date',
                    'de' : 'Zahlungsdatum',
                    'pl' : 'Data płatności',
                    'cs' : 'Datum platby',
                    'es' : 'Fecha del pago',
                    'lv' : 'Maksājuma datums',
                    'ru' : 'Число'
                },
                '$Scheduled' :
                {
                    'en' : 'Scheduled',
                    'de' : 'Geplante',
                    'pl' : 'Zaplanowano',
                    'cs' : 'Naplánované',
                    'es' : 'Scheduled',
                    'lv' : 'Plānots',
                    'ru' : 'Запланировано'
                },
                '$Occupation' :
                {
                    'en' : 'Occupation',
                    'de' : 'Occupation',
                    'pl' : 'Zawód',
                    'cs' : 'Zaměstnání',
                    'es' : 'Occupation',
                    'lv' : 'Nodarbošanās',
                    'ru' : 'Occupation'
                },
                '$Borrower' :
                {
                    'en' : 'Borrower',
                    'de' : 'Kreditnehmer',
                    'pl' : 'Pożyczkobiorca',
                    'cs' : 'Dlužník',
                    'es' : 'Prestatario',
                    'lv' : 'Aizņēmējs',
                    'ru' : 'Заемщик'
                },
                '$BorrowerPattern' :
                {
                    'en' : /(?:female|male), (\d+) y/i,
                    'de' : /(?:Weiblich|Männlich), (\d+)/i,
                    'pl' : /(?:mężczyzna|kobieta) (\d+)/i,
                    'cs' : /(?:žena|muž) (\d+)/i,
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
