import {localization} from "../../common/localization";
import u from 'umbrellajs';
import {html, render} from "lit-html";

export function enhanceTableDom (settings, root)
{
    const thead = u('thead', root);
    
    if(settings.InvestmentsShowDaysToNextPayment){
        changeNextPaymentHeader(thead.first());
    }
}

function changeNextPaymentHeader (thead)
{
    const th = u('th:nth-of-type(5)', thead).first();
    u('a span', th).text(localization('DaysToNext'));
}

export function renderModelLoans (settings, model, table)
{
    u('tr:not(.total-row,.tooltip-row)', table)
        .each((row, idx) => renderLoanModel(settings, model.loans[idx], row));
}

function renderLoanModel (settings, model, row)
{
    renderModelPaymentDays(model, row);
    renderModelLate(model, row);
}

/*
 *  This will replace the 'next payment date' columns, so instead of showing
 *  the date of the next payment, it shows the number of days. Those
 *  loans which are late, doesn't change. Any loan date today, is shown
 *  as 0 days. It hides the original field, rather than replacing the values
 */
function renderModelPaymentDays (model, row)
{
    const cellNode = u(`td div[data-m-label="${localization('$NextPayment')}"]`,row);
    const nextPaymentDays = model.nextPaymentDays
        ? `${model.nextPaymentDays} ${localization('Days')}`
        : '';
    const oldDaysNode = cellNode.children('span:first-of-type');
    
    let renderTarget = u('span.invext-target', cellNode.first()).first();
    if (!renderTarget)
    {
        renderTarget = u('<span class="invext-target"/>').first();
        oldDaysNode.first().parentNode.appendChild(renderTarget);
    }
    
    render(html`<span title="${model.nextPaymentDate}"
                      class="invext-value">${nextPaymentDays}</span>`, renderTarget);
    
    oldDaysNode.addClass('invext-hidden');
}

/*
 *  This will mark any row where the 'Term' column is 'Late' with
 *  slight red background color, to highlight late loans.
 */
function renderModelLate (model, row)
{
    if (model.late)
    {
        u(row).addClass('invext-highlight-late');
    }
}

function columnHeader (title, tooltipText)
{
    const tooltip = !tooltipText ? ''
        : html`<br data-v-f9d344dc="">
            <span data-v-f9d344dc="" class="mw-u-popover mw-u-popover-dark--container mw-u-popover-visible">
        <span style="display: none;">
            <span class="popper ttip bottom mw-u-popover-dark" style="position: absolute;">
                <span>${tooltipText}</span>
            </span>
        </span>
        <i class="fas fa-info-circle tooltip-color-gray"></i>
    </span>`;
    
    return html`
        <th class="m-u-ta-center" data-v-f9d344dc="">
            <span data-v-f9d344dc="">${title}</span>
            ${tooltip}
        </th>`
}
