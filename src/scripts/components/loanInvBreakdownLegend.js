/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import {localization} from "../localization";

export function loanInvBreakdownLegend (model, node)
{
    render(html`
         <table style="width:100%; font-size: 0.85em">
            ${$createHeader()}
            ${model.map(row => $createRow(row))}
        </table>
    `, node);
    
    return node;
}

function $createHeader ()
{
    return html`
        <tr>
            <th></th>
            <th style="text-align: left" >${localization('Name')}   </th>
            <th style="text-align: right">${localization('Percent')}</th>
            <th style="text-align: right">${localization('Amount')} </th>
        </tr>
    `;
}

function $createRow ({className, name, percent, amount, currency})
{
    return html`
        <tr>
            <td><ul id="legend"><li class="${className}" style="padding:0 0 0 12px">&nbsp;</li></ul></td>
            <td style="white-space: nowrap">${name}</td>
            <td style="white-space: nowrap; text-align: right">${percent}</td>
            <td style="white-space: nowrap; text-align: right">${amount} ${currency}</td>
        </tr>
    `;
}
