/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {rating} from '../common/data'
import {chrome, getCurrencyPrefix, onNodesAvailable, toDate, today, toDays, toFloat,} from '../common/util';
import {loanInvBreakdownLegend} from "../components/loanInvBreakdownLegend";
import {renderRatings} from "../components/loanLoRatings";
import {renderExtraDetails} from "../components/loanDetails";
import {latePaymentHistogramChart} from "../components/paymentDelayHisto";
import {localization} from "../localization";

export async function handle(){
    const model = {
        details   : {
            borrower : {},
        },
        histogram : [],
        legend    : [],
    };
    
    const settings = await chrome.storage.sync.get
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
            'LoanShowLatePaymentHistogram'      : true,
        }
    );
        /*
         * The architect of this code (i.e. whoever changes it) needs to decide on how to group selectors in
         * onNodesAvailable.
         * 
         * The easiest way is to put all selectors in one onNodesAvailable and render changes from there.
         * The problem with this approach, however, is that some selectors, like the investment breakdown,
         * will take a good couple of seconds to resolve, making the user to wait that long for any changes.
         * 
         * Another easy approach would be one selector -> one rendering target, like in case of originator ratings,
         * but that's not always possible.
         */
        
        onNodesAvailable({
            details  : '#info-wrapper tbody',
            borrower : '#card-tabs-content li:first-child tbody',
            schedule : '#card-tabs-content li:nth-child(2) tbody',
        }).then(({
                     details,
                     borrower,
                     schedule,
                 }) =>
        {
            
            /*
             *  Show a row at the beginning of the detail window, with the country of
             *  the loan, written out as text. There is no flag in this value field. The
             *  reason for this, is that the flag is already shown at the top. But maybe
             *  we should remove it from there, and then add it to the left of the names
             */
            if (settings.LoanShowCountryRow)
                model.details.country = document.querySelector('.m-h1 img').title;
            
            if ([
                settings.LoanShowOntimePaymentPercent,
                settings.LoanShowPaymentWarning,
                settings.LoanShowLatePaymentHistogram,
                settings.LoanShowTotalGraceTime,
            ].includes(true))
                parseSchedule(schedule, details, model);
            
            /*
             *  Experimental
             */
            if (settings.LoanShowAgeWarning)
                parseAge(borrower, model);
            
            /*
             *  Experimental
             */
            if (settings.LoanShowJobWarning)
                parseUnemployed(borrower, model);
        
            renderExtraDetails(model.details, settings, details);
            
            if (settings.LoanShowLatePaymentHistogram)
                document.querySelector('div.chart-data')
                    .insertAdjacentElement("afterend",
                    latePaymentHistogramChart('payment-histogram', model.histogram));
        
        }).catch(console.warn);
    
        onNodesAvailable({
            originator : '#chart-wrapper > div.m-u-padding-top-5.m-u-fs-6',
        }).then(({
                     originator,
                 }) =>
        {
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
                const cell = originator
                    .querySelector('#chart-wrapper div.m-o-grid:first-of-type div.m-o-grid__item:nth-of-type(2)');
                
                parseRatings(cell, model);
                renderRatings(model.details, originator);
                cell.querySelector('span').classList.add('invext-hidden');
            }
        }).catch(console.warn);
    
        /*
         *  Replace the investment breakdown unordered list, with a table. The table
         *  shows the same informations, and the same colours but formated with rows
         *  and cells nicely aligned. It also adds decimals to the value calculation
         */
        if (settings.LoanFormatInvestmentBreakdown)
            onNodesAvailable({
                chart : '.chart-data',
                list  : '.chart-data #legend',
            }).then(({chart, list}) =>
            {
                parseLegendModel(list, model);
                chart.insertBefore(loanInvBreakdownLegend(model.legend, document.createElement('div')), list);
                list.style.display = 'none';
            }).catch(console.warn);
        
        console.info(model);
    }

function parseLegendModel (listElem, model)
{
    model.legend = [...listElem.children]
        .map(element =>
        {
            const groups = element.innerText.match(/^(.*?)[-<] (\d+%).*?\/ (.*)/);
            return {
                className : element.getAttribute('class'),
                name      : groups[1],
                percent   : groups[2],
                amount    : toFloat(groups[3]).toFixed(2),
                currency  : getCurrencyPrefix(groups[3]),
            };
        });
}

/*
 * Parse schedule to model, and check each setting at the render stage
 */
function parseSchedule (schedule, details, model)
// TODO support late - paid full & partial
{
    function inc (list, index)
    {
        list[index] = (list[index] || 0) + 1;
    }
    
    model.details.graceDays = 0;
    
    let $ontime = 0, $others = 0, nextPaymentDate = null;
    
    for (const row of schedule.childNodes)
    {
        if (row.children.length === 1 || row.children[1].innerText.trim() === '')
            // Don't count payments made before listing time (those without any details) as on-time.
            // Skip schedule extension rows
            continue;
    
        const paymentStatus = row.lastChild.innerText;
    
        if (nextPaymentDate === null
            && [
                localization('$Scheduled'),
                localization('$Late'),
            ].includes(paymentStatus))
            nextPaymentDate = toDate(row.children[0].innerText);
        
        if (paymentStatus === localization('$Scheduled'))
            // Quit parsing on first scheduled payment
            break;

        if (paymentStatus === localization('$Paid'))
        {
            $ontime++;
            inc(model.histogram, 0);
            
            const date = row.querySelector(`td[data-m-label="${localization('$Date')}"]`);
            const date_paid = row.querySelector(`td[data-m-label="${localization('$PaymentDate')}"]`);
            
            if (date_paid.innerText.trim().length > 0)
                model.details.graceDays += toDays(toDate(date_paid.innerText.trim()) - toDate(date.innerText.trim()));
        }
        else if (paymentStatus === localization('$Late'))
            // TODO add Late - partial
        {
            ++$others;
            const days = toDays(today() - toDate(row.children[0].innerText));
            inc(model.histogram, days);
        }
        else
        {
            $others++;
            const days = toDays(toDate(row.children[5].innerText) - toDate(row.children[0].innerText));
            inc(model.histogram, days);
        }
    }
    
    const totalPayments = $others + $ontime;
    model.details.ontimePercent = totalPayments > 0 ? ($ontime / totalPayments * 100.00) : NaN;
    
    const loanStatus = details.lastElementChild.lastElementChild.innerText.trim();
    if (nextPaymentDate && ![
        localization('$Finished'),
        localization('$FinishedPrematurely'),
        localization('$Default')
    ].includes(loanStatus))
        model.details.nextPayment = toDays(nextPaymentDate - today());
    else
        model.details.nextPayment = NaN;
}

function parseRatings (cell, model)
{
    model.details.mintosRating = cell.querySelector('span').innerText;
    model.details.explorep2pRating = rating(cell.querySelector('a').innerText);
}

function parseAge (borrower, model)
{
    for (const row of borrower.childNodes)
    {
        let match;
        if (row.firstChild.innerText === localization('$Borrower') && (match = row.lastChild.innerText.match(localization('$BorrowerPattern'))))
        {
            model.details.borrower.age = match[1];
            return;
        }
    }
}

function parseUnemployed (borrower, model)
{
    for (const row of borrower.querySelectorAll('tr'))
    {
        const key = row.firstChild.innerText;
        const value = row.lastChild.innerText.toLowerCase();
        if (key === localization('$Occupation') && value === 'unemployed')
        {
            model.details.borrower.unemplyed = true;
            return;
        }
    }
    model.details.borrower.unemplyed = false;
}
