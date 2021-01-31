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
        .each((row, idx) => renderLoanModel(settings, model, model.loans[idx], row));
}

function renderLoanModel (settings, model, rowModel, row)
{
    if (settings.InvestmentsShowDaysToNextPayment)
    {
        renderModelPaymentDays(rowModel, row);
    }
    if (settings.InvestmentsHighlightLateLoans)
    {
        renderModelLate(rowModel, row);
    }
    if (settings.InvestmentsShowPremiumDiscount)
    {
        renderSellPremium(rowModel, row);
    }
    if (settings.InvestmentsUseLoanTypeLinks
        || settings.InvestmentsLoanTypeIcon
        || settings.InvestmentsCountryCode
    )
    {
        renderIdColumn(settings, model, rowModel, row);
    }
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
    const nextPaymentDays = Number.isInteger(model.nextPaymentDays)
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
 *  This adds a percentage counter after each note, that is for sale showing
 *  the added premium as a + number or discount as some negative number. The
 *  original number is still shown, but it becomes easier to see which notes
 *  have been set on sale with a premium / discount, no change is also shown
 */
function renderSellPremium (model, row)
{
    const v = model.sellPremiumPct;
    if (v === undefined)
    {
        return;
    }
    let target = u('span.invext-sell-premium', row);
    if (target.length === 0)
    {
        const sibling = u('span.purchase-preview', row).first();
        target = u('<span class="invext-sell-premium"/>').first();
        sibling.insertAdjacentElement('beforeend', target);
    }
    
    const className = v < 0 ? 'invext-warn-negative' : (v > 0 ? 'invext-value-positive' : '');
    const sign = v >= 0 ? '+' : '-';
    render(html`<span class="${className}">${sign} ${v}%</span>`, target);
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

/*
 *  This makes the loan type a link that enables filtering loans by loan type.
 *  Clicking it shows only loans that are the same type as the one that was clicked.
 */
function renderIdColumn (settings, model, loanModel, rowNode)
{
    function loanTypeIcon ()
    {
        const id = model.pledges[loanModel.loanType].id;
        return html`<img src="https://www.mintos.com/webapp/assets/images/icons/loan_types/loan_type_${id}.svg"
                         .alt=${loanModel.loanType}/>`;
    }
    
    const targetCell = u('.loan-id-col', rowNode).first();
    const target = u('.m-loan-type', targetCell);
    
    const oldLoanTypeNode = target.children('span');
    if (!oldLoanTypeNode.hasClass('invext-hidden'))
    {
        oldLoanTypeNode.addClass('invext-hidden');
    }
    
    const contents = [oldLoanTypeNode.first()];
    
    if (settings.InvestmentsLoanTypeIcon)
    {
        // we made room with replacing loan type with icon, so move the flag too.
        contents.push(u('.id-wrapper img', targetCell).first());
    }
    
    if (settings.InvestmentsCountryCode)
    {
        contents.push(html`
            <div class="invext-country-code" title="${loanModel.country.name}">${loanModel.country.code}</div>`);
    }
    
    const loanTypeContent = settings.InvestmentsLoanTypeIcon ? loanTypeIcon() : loanModel.loanType;
    
    if (settings.InvestmentsUseLoanTypeLinks)
    {
        contents.push(html`<a class="invext-loan-type"
                              href="${model.pledges[loanModel.loanType].href}">${loanTypeContent}</a>`);
    }
    else
    {
        contents.push(html`<div class="invext-loan-type">${loanTypeContent}</div>`);
    }
    
    contents.push(u('.contract-wrapper', rowNode).first())
    
    render(html`${contents}`, target.first());
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
