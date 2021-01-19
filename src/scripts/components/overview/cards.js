/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import u from 'umbrellajs';
import {toFloat} from "../../common/util";

const percentClass = 'invext-percent';
const entryClass = 'invext-entry';

/**
 * make sure the cards' rows are turned to CSS grids and there is a percentage column
 */
export function enhanceCardsDom (settings, root)
{
    root.insertAdjacentElement('afterbegin', createStyleElem(settings));
    u('.mw-overview-card__aggregate', root).each(entry => enhanceEntryDom(entry));
}

function createStyleElem (settings)
{
    let gridColumns = '3fr auto';
    if (settings.OverviewShowPercentages)
    {
        gridColumns += ' 5em'
    }
    
    const percentDisplay = settings.OverviewShowPercentages ? 'inherit' : 'none';
    
    const styleElem = u('<style id="invext-overview-style">');
    styleElem.first().type = 'text/css';
    styleElem.html(`
        .${entryClass} {
            grid-template-columns: ${gridColumns};
        }
        
        .${percentClass} {
            text-align: right;
            display: ${percentDisplay};
        }
        `)
    return styleElem.first();
}

function enhanceEntryDom (entryElem)
{
    // use the inline style to override specific selector in mintos css
    entryElem.style.display = 'grid';
    entryElem.classList.add(entryClass);
    
    entryElem.insertAdjacentHTML("beforeend", `<span class="${percentClass}">0%</span>`);
}

export function updateCardsModel (root, model)
{
    model.length = 0;
    forEachOverviewBlock(root, card => model.push(createCardModel(card)));
}

function createCardModel (card)
{
    const total = toFloat(u('.mw-overview-card__aggregate--total span:nth-of-type(2)', card).text());
    const entries = u('.mw-overview-card__aggregate', card).nodes.map(item =>
    {
        return {value : toFloat(u(item).children('span:nth-child(2), a:first-of-type').text())}
    });
    
    return {
        total,
        entries,
    }
}

/**
 * Calculate fraction (percent) values
 */
export function enhanceCardsModel (model)
{
    model.cards.forEach(card => card.entries.forEach(entry =>
    {
        entry.fraction = Number.isNaN(card.total) || card.total === 0.0 ? NaN : (entry.value / card.total);
    }));
}

export function renderCardsModel (settings, model, grid)
{
    forEachOverviewBlock(grid, (card, index) =>
    {
        const cardModel = model[index];
        u('.mw-overview-card__aggregate', card)
            .each((entry, eindex) => updateEntryDom(settings, cardModel.entries[eindex], entry))
    });
}

function updateEntryDom (settings, model, entry)
{
    renderPercentValue(model, entry);
    
    if (settings.OverviewHideEmptyRows)
    {
        hideEntry(model, entry);
    }
}

function renderPercentValue (model, entry)
{
    const display = Number.isNaN(model.fraction) ? '-' : ((model.fraction * 100.0).toFixed(2) + '%');
    u(`.${percentClass}`, entry).text(display);
}

function hideEntry (model, entry)
{
    if (model.value === .0)
    {
        entry.addClass('invext-hidden');
    }
    else
    {
        entry.removeClass('invext-hidden');
    }
}

/**
 * call callback for each of four blocks of overview data (Balance, NAR, portfolio values, portfolio numbers)
 */
function forEachOverviewBlock (root, callback)
{
    const cards = u('.mw-overview-card', root);
    callback(cards.nodes[0], 0);
    callback(cards.nodes[1], 1);
    u('.m-u-d-block', cards.nodes[2]).each((node, index) => callback(node, index + 2));
}
