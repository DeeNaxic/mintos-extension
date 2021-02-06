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
    if(!u('thead tr', nodes.statement).first()){
        return;
    }

    const statement = u(nodes.statement);
    if (!statement.hasClass('invext-statement'))
    {
        statement.addClass('invext-statement');
        renderHeader(nodes);
    }
    renderStatementRows(settings, model, nodes);
}


function renderHeader (nodes)
{
    const target = u('thead tr', nodes.statement);
    const children = target.children().nodes;
    const content = [
        ...children.slice(0, 2), html`
            <th>${localization('TransactionId')}</th>
            <th>${localization('LoanId')}</th>
            <th>${localization('TransactionType')}</th>
            <th>${localization('ReferenceId')}</th>`, ...children.slice(2)];
    render(content, target.first());
}

function renderStatementRows (settings, model, nodes)
{
    u('tbody tr', nodes.statement)
        .each((rowNode, index) => renderStatementRow(settings, model, model.entries[index], rowNode));
}

function renderStatementRow (settings, model, rowModel, target)
{
    const children = u(target).children().nodes;
    
    const loanLinkNode = u('td:nth-child(2) a', target).first();
    
    const content = [
        ...children.slice(0, 2), html`
            <td class="invext-stmt-tx-id">${rowModel.txId}</td>
            <td class="invext-stmt-loan-id">${loanLinkNode ? loanLinkNode.cloneNode(true) : ''}</td>
            <td class="invext-stmt-tx-type">${rowModel.txType}</td>
            <td class="invext-stmt-tx-ref">${rowModel.txRef}</td>`,
        ...children.slice(model.columns.hasBalance ? -2 : -1)];
    
    render(content, target);
}
