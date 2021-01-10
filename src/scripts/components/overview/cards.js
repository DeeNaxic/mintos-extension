import u from 'umbrellajs';
import {toFloat} from "../../common/util";

const percentClass = 'invext-percent';
const entryClass = 'invext-entry';

// two groups of functions here:
// enhance* - change the dom structure, add style, classes etc. This is done once per page load
// update* - update data. Once per contents change, like changing the currency

/// make sure the cards' rows are turned to CSS grids and there is a percentage column
export const enhanceOverviewCards = (root, settings) =>
{
    // We'll add 'invext-entry' and 'invext-percent' class to elements.
    // At this point just check if one of them exists in the page, and if so, skip the enhancement step.
    
    if (u(`.${entryClass}`, root).length === 0)
    {
        doEnhanceOverviewCards(root, settings)
    }
    
    updateCards(root);
}

function doEnhanceOverviewCards (root, settings)
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
    root.insertAdjacentElement('afterbegin', styleElem.first());
    
    u('.mw-overview-card__aggregate', root).each(entry => enhanceEntry(entry));
}

function enhanceEntry (entryElem)
{
    // use the inline style to override specific selector in mintos css
    entryElem.style.display = 'grid';
    entryElem.classList.add(entryClass);
    
    entryElem.insertAdjacentHTML("beforeend", `<span class="${percentClass}">0%</span>`);
}

function updateCards (root)
{
    forEachOverviewBlock(root, card => updateCard(card));
}

function updateCard (card)
{
    const totalValue = toFloat(u('.mw-overview-card__aggregate--total span:nth-of-type(2)', card).text());
    u('.mw-overview-card__aggregate', card).each(entry => updateEntry(entry, totalValue));
}

function updateEntry (entry, total)
{
    const valueCell = u(entry).children('span:nth-child(2), a:first-of-type');
    const value = toFloat(valueCell.text());
    const percent = Number.isNaN(total) || total === 0.0 ? '-' : (value / total * 100.0).toFixed(2);
    u(`.${percentClass}`, entry).text(percent + '%');
}

/// call callback for each of four blocks of overview data (Balance, NAR, portfolio values, portfolio numbers)
function forEachOverviewBlock (root, callback)
{
    const cards = u('.mw-overview-card', root);
    callback(cards.nodes[0]);
    callback(cards.nodes[1]);
    u('.m-u-d-block', cards.nodes[2]).each(callback);
}
