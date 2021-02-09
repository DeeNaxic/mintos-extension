/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import u from 'umbrellajs';
import {
    html,
    render,
} from 'lit-html';
import {localization} from '../../common/localization';
import {insertAdjacentElements} from '../../common/util';

export function parseTransactionDetails (text, lang = null)
{
    const result = {};
    
    const txIdMatch = /^[^:]+: (-?\d+)/u.exec(text);
    result.txId = txIdMatch[1];
    
    const refIdMatch = localization('$TransactionDetails', lang).exec(text);
    result.txType = refIdMatch[1].trim();
    if (refIdMatch[2])
    {
        result.txRef = refIdMatch[2].trim();
    }
    
    return result;
}

export function renderStatementTable (settings, model, nodes)
{
    if (!u('thead tr', nodes.statement).first())
    {
        return;
    }
    
    const statement = u(nodes.statement);
    
    statement.addClass('invext-statement');
    
    if (settings.AccountOverviewSplitDetailsTable && !statement.hasClass('invext-statement-split'))
    {
        // this css-class hides the details column and fixes style of the new column headers
        statement.addClass('invext-statement-split');
        renderHeader(nodes.statement);
    }
    
    renderStatementRows(settings, model, nodes);
}

function renderTableCols (result, options = undefined)
{
    const renderTarget = u('<table><tr></tr></table>').find('tr');
    render(result, renderTarget.first());
    return renderTarget.children();
}

function renderHeader (target)
{
    const cols = renderTableCols(html`
        <th>${localization('TransactionId')}</th>
        <th>${localization('LoanId')}</th>
        <th>${localization('TransactionType')}</th>
        <th>${localization('ReferenceId')}</th>`);
    insertAdjacentElements(u('th:nth-child(2)', target).first(), 'afterend', cols);
}

function renderStatementRows (settings, model, nodes)
{
    u('tbody tr', nodes.statement)
        .each((rowNode, index) => renderStatementRow(settings, model, model.entries[index], rowNode));
}

function renderStatementRow (settings, model, rowModel, target)
{
    if (settings.AccountOverviewSplitDetailsTable)
    {
        if (!u('.invext-stmt-tx-id', target).first())
        {
            const cols = renderTableCols(html`
                <td class="invext-stmt-tx-id"></td>
                <td class="invext-stmt-loan-id"></td>
                <td class="invext-stmt-tx-type"></td>
                <td class="invext-stmt-tx-ref"></td>`);
            
            insertAdjacentElements(u('td:nth-child(2)', target).first(), 'afterend', cols);
        }
        
        u('.invext-stmt-tx-id', target).text(rowModel.txId);
        u('.invext-stmt-tx-type', target).text(rowModel.txType);
        u('.invext-stmt-tx-ref', target).text(rowModel.txRef);
        
        const uLoanId = u('.invext-stmt-loan-id', target);
        const loanLinkNode = u('td:nth-child(2) a', target).first();
        uLoanId.empty();
        if (loanLinkNode)
        {
            uLoanId.append(loanLinkNode.cloneNode(true));
        }
    }
    
    if (settings.AccountOverviewUseFourDecimals)
    {
        const turnoverIdx = model.columns.hasBalance ? 2 : 1;
        const node = u(`td:nth-last-child(${turnoverIdx}) > span > span:last-child`, target);
        node.text(rowModel.turnover.toFixed(4));
        
        // set data attribute to keep the value after the tooltip node is (re)moved after displaying it,
        // and we refresh the page model because the DOM is changed
        node.data('invext-value', rowModel.turnover);
        
        if (model.columns.hasBalance)
        {
            const node = u('td:last-child > span > span:last-child', target);
            node.data('invext-value', rowModel.balance);
            
            // can't just use (inner)text as it removes child elements
            render(html`${[u('span[title]', node.first()).first(), ' ', rowModel.balance.toFixed(4)]}`, node.first());
        }
    }
}
