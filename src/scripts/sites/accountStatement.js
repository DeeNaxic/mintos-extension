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
        '.mw-u-general-table']);
    
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

        function runtime (settings)
        {
            /*
             *  This replaces the default two digit representation with four digits. The
             *  problem with the default implementation is, that it might show a gain of
             *  '0.00' which can be confusing. Mintos solved this by including the value
             *  in the hover-text. This is also where the actual text value is gotten of
             */
            if (settings.AccountOverviewUseFourDecimals)
            {
                enhancers.push(() =>
                    dataSummary.querySelectorAll('.mod-pointer').forEach(function (row)
                    {
                        row.innerText           = row.getAttribute('data-tooltip').replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    }
                    ));
        
                dataTableRowEnhancers.push(
                    function (row)
                    {
                        var turnover            = row.querySelector('.turnover span');
                            turnover.innerText  = turnover .title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                        
                        // Remainder column is not present when searching by transaction type
                        var remainder           = row.querySelector('.remainder span');
                        if (remainder)
                            remainder.innerText = remainder.title.replace(/([^/.])\.(\d{4}).*/g, '$1.$2');
                    });
            }
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
        .map(node => node.innerText.indexOf(localization('$Balance')) > -1).includes(true);
    
    const turnoverColIdx = hasBalance ? 2 : 1
    const balanceColIdx = hasBalance ? 1 : undefined;
    
    function parseRow (rowNode)
    {
        const turnover = Number.parseFloat(u(`td:nth-last-child(${turnoverColIdx}) span.ttip span`, rowNode).text());
        const balance = hasBalance
            ? Number.parseFloat(u(`td:nth-last-child(${balanceColIdx}) span.ttip span`, rowNode).text())
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
    if (settings.AccountOverviewSplitDetailsTable)
    {
        renderStatementTable(settings, model, nodes);
    }
}
