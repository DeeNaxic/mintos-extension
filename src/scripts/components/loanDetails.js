/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import {localization} from "../localization";

export function renderExtraDetails (model, settings, node)
{
    const warnings = {};
    const details = {};
    
    /*
     *  This shows a percentage calculation, of how many payments, which were on
     *  time, and how many were delayed. It is shown as a percent out of hundred
     *  and it excludes scheduled payments which has not yet been made. If there
     *  is only scheduled payments the 'n/a' is shown instead of some percentage
     */
    if (settings.LoanShowOntimePaymentPercent)
        details.OntimePayments = !Number.isNaN(model.ontimePercent)
            ? model.ontimePercent.toFixed(0) + '%'
            : '-';
    
    /*
     *  Experimental
     */
    if (settings.LoanShowPaymentWarning && model.ontimePercent < 60.0)
        warnings.Payments = model.ontimePercent.toFixed(2) + '% ' + localization('Ontime');
    
    if (model.borrower.age && model.borrower.age > 55)
        warnings.Age = `${model.borrower.age} ${localization('Years')}`;
    
    if (model.borrower.unemplyed)
        warnings['$Occupation'] = 'Unemployed';
    
    if (settings.LoanShowTotalGraceTime)
        details.TimeInGrace = `${model.graceDays} ${localization('Days')}`;
    
    /*
     *  Show the number of days, to the next payment in the loan details windows
     *  If the loan status are finished or default then next payment will not be
     *  shown. If the loan are in grace period, and there are only one scheduled
     *  payment left, then the next payment will instead show as non-applicative
     */
    if (settings.LoanShowNextPaymentRow)
        details.NextPayment = Number.isNaN(model.nextPayment) ? 'N/A' :
            model.nextPayment >= 0
                ? `${model.nextPayment} ${localization('Days')}`
                : `${-model.nextPayment} ${localization('DaysLate')}`;
    
    function country ()
    {
        if (model.country)
            return createDetailsRow(localization('Country'), model.country)
    }
    
    render(html`
    ${Object.entries(warnings).map(([key, value]) => createDetailsRowWarning(localization(key), value))}
    ${country()}
    ${[...node.children]}
    ${Object.entries(details).map(([key, value]) => createDetailsRow(localization(key), value))}
    `, node);
    
}

/*
 *  This is an auxiliary function, which is used to create a new row of data
 *  in the details window. It handles everything from setting the attributes
 *  and adding the styles. The two parameters passed in here, is the headers
 *  text, which is the left column and the content which is the right column
 */
function createDetailsRow (header, content, extraClassName = null)
{
    const c = extraClassName ? extraClassName + ' ' : '';
    return html`
        <tr>
            <td class="${c}field-description">${header}</td>
            <td class="${c}value">${           content}</td>
        </tr>`;
}

/*
 *  This is similar to the createDetailsRow function. But it inserts things
 *  such as color, which makes it a warning entry and not just text
 */
function createDetailsRowWarning (header, content)
{
    return createDetailsRow(`${localization('Warning')}: ${header}`, content, 'invext-details-warning');
}
