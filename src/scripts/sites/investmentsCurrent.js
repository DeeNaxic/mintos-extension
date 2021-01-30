/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import './investments';

import moment from "moment";
import u from 'umbrellajs';
import {
    chrome,
    debug,
    DomMonitorAggressive,
    mintosDateFormat,
    onNodesAvailable,
    reportNodesAvailable,
} from '../common/util';
import {
    enhanceTableDom,
    renderModelLoans,
} from "../components/investments";
import {localization} from "../common/localization";

const model = {
    loans   : [],
    pledges : {},
};

export async function handle ()
{
    reportNodesAvailable([
        '.table-wrapper .loan-table',
        '.table-wrapper .loan-table thead',
        '.table-wrapper .loan-table tbody',
        '#sel-pledge',
    ]);
    
    const settings = await chrome.storage.sync.get(
        {
            InvestmentsShowDaysToNextPayment : true,
            InvestmentsHighlightLateLoans    : true,
            InvestmentsShowPremiumDiscount   : true,
            InvestmentsUseLoanTypeLinks      : false
        }
    )
    
    try
    {
        const {
                  pledges,
                  loans,
              } = await onNodesAvailable({
            pledges : '#sel-pledge',
            loans   : '.table-wrapper .loan-table',
        })
    
        createStaticModel({pledges}, model);
        enhanceDom(settings, {loans});
        updatePage(settings, {loans});
        DomMonitorAggressive(loans, () => updatePage(settings, {loans}));
    } catch (x)
    {
        console.error(x);
    }
}

function enhanceDom (settings, nodes)
{
    enhanceTableDom(settings, nodes.loans);
}

function updatePage (settings, nodes)
{
    updateLoansModel(nodes.loans, model);
    enhanceModel(model);
    debug(model);
    renderModelLoans(settings, model, nodes.loans);
}

/**
 * Update the part of the model that doesn't change over page updates
 * @param nodes a map of root nodes to read model from
 * @param model the page model
 */
function createStaticModel (nodes, model)
{
    u('.choice-item', nodes.pledges)
        .each(inputNode =>
            model.pledges[u('label span', inputNode).text()]
                = createLink(window.location.href, 'pledge_groups[]', u('input', inputNode).attr('value')));
}

function updateLoansModel (table, model)
{
    model.loans.length = 0;
    u('tr:not(.total-row,.tooltip-row)', table).each(row => model.loans.push(createLoanModel(row)));
}

function createLoanModel (row)
{
    function getPercentage (input)
    {
        return input ? parseFloat(/(-?\d+\.\d+)%/g.exec(input)[0]) : undefined;
    }
    
    return {
        late            : u(`div[data-m-label="${localization('$Term')}"] > span > span:first-child`, row)
            .text()
            .trim()
            .indexOf(localization('$Late')) > -1,
        loanType        : u('td.loan-id-col div.m-loan-type > span', row).text(),
        nextPaymentDate : u(`td div[data-m-label="${localization('$NextPayment')}"] > span:first-of-type`, row)
            .text()
            .trim(),
        sellPremiumPct  : getPercentage(u('td.actions span.mw-u-popover:first-child span.ttip span', row).text()),
    };
}

function enhanceModel (model)
{
    const today = moment().startOf('day');
    const enhanceLoanModel = (loan) =>
    {
        const date = moment(loan.nextPaymentDate, mintosDateFormat);
        if (date.isValid())
        {
            loan.nextPaymentDays = date.diff(today, 'days')
        }
    }
    model.loans.forEach(enhanceLoanModel);
}

/*
 *  This takes the current window location, all query string parameters that
 *  match the given key, and appends the key with the value argument. This
 *  means that any existing query parameters are kept intact, such that, the
 *  final path returned, always have the same path with the new key appended
 */
function createLink (href, key, value)
{
    const url = new URL(href);
    url.searchParams.delete(key);
    url.searchParams.append(key, value);
    return url;
}

