/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {
    chrome,
    DomMonitorAggressive,
    onNodesAvailable,
    reportNodesAvailable,
} from '../common/util';
import u from 'umbrellajs';
import {localization} from "../common/localization";
import {
    parseTransactionDetails,
    renderStatementTable,
} from "../components/statement";

const model = {
    entries : [],
    columns : {
        hasBalance : false,
    },
};

export async function handle ()
{
    reportNodesAvailable([
        '.mw-u-general-table',
    ]);
    
    const settings = await chrome.storage.sync.get({
        'AccountOverviewUseFourDecimals'   : false,
        'AccountOverviewShowAllTimeButton' : true,
        'AccountOverviewSplitDetailsTable' : true,
    });
    
    if (!Object.values(settings).includes(true))
    {
        return;
    }
    
    const nodes = await onNodesAvailable({statement : '.mw-u-general-table'});

    updatePage(settings, model, nodes);
    DomMonitorAggressive(nodes.statement, () => updatePage(settings, model, nodes));
}

function updatePage (settings, model, nodes)
{
    updateModel(nodes, model);
    console.debug(model);
    render(settings, model, nodes);
}

function updateModel (nodes, model)
{
    const hasBalance = model.columns.hasBalance = u('thead tr', nodes.statement)
        .nodes
        .map(node => node.innerText.includes(localization('$Balance')))
        .includes(true);
    
    const turnoverColIdx = hasBalance ? 2 : 1
    
    function readValue (node)
    {
        const tooltip = u('span.ttip span', node);
        if (tooltip.first())
        {
            return Number.parseFloat(tooltip.text());
        }
        else
        {
            return Number.parseFloat(u('span > span', node).data('invext-value'));
        }
    }
    
    function parseRow (rowNode)
    {
        const turnover = readValue(u(`td:nth-last-child(${turnoverColIdx})`, rowNode).first());
        const balance = hasBalance
            ? readValue(u(`td:last-child`, rowNode).first())
            : undefined;
        return {
            turnover,
            balance,
            ...parseTransactionDetails(u('td:nth-child(2)', rowNode).text()),
        };
    }
    
    model.entries.length = 0;
    u('tbody tr', nodes.statement).each(rowNode => model.entries.push(parseRow(rowNode)));
}

function render(settings, model, nodes){
    if (settings.AccountOverviewSplitDetailsTable || settings.AccountOverviewUseFourDecimals)
    {
        renderStatementTable(settings, model, nodes);
    }
}
