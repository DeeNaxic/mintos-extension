/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import u from 'umbrellajs';
import {localization} from "../../localization";
import {toFloat} from "../../common/util";

const classPercent = 'invext-percent';
const classEntry = 'invext-entry';
const classNegative = 'invext-warning-negative';
const classHidden = 'invext-hidden';

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
        .${classEntry} {
            grid-template-columns: ${gridColumns};
        }
        
        .${classPercent} {
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
    entryElem.classList.add(classEntry);
    
    entryElem.insertAdjacentHTML("beforeend", `<span class="${classPercent}">0%</span>`);
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
        return {value : toFloat(getEntryValueElem(item).text())}
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
            .each((entry, eindex) => updateEntryDom(settings, cardModel.entries[eindex], u(entry), index))
    });
}

function updateEntryDom (settings, model, entry, cardIdx)
{
    renderPercentValue(model, entry);
    
    if (settings.OverviewHideEmptyRows)
    {
        hideEntry(model, entry);
    }
    
    if (cardIdx === 1 && settings.OverviewHighlightNegativeNumbers)
    {
        highlightNegative(model, entry);
    }
}

function renderPercentValue (model, entry)
{
    const display = Number.isNaN(model.fraction) ? '-' : ((model.fraction * 100.0).toFixed(2) + '%');
    u(`.${classPercent}`, entry.first()).text(display);
}

function hideEntry (model, entry)
{
    if (model.value === .0)
    {
        entry.addClass(classHidden);
    }
    else
    {
        entry.removeClass(classHidden);
    }
}

/**
 * This will apply color red to any number which is below zero.
 * Note that it only checks the box returns rows
 */
function highlightNegative (model, entry)
{
    const elem = getEntryValueElem(entry);
    if (model.value < .0)
    {
        elem.addClass(classNegative);
    }
    else
    {
        elem.removeClass(classNegative);
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

function getEntryValueElem (item)
{
    return u(item).children('span:nth-child(2), a:first-of-type');
}

/*
 *  This is a purely cosmetic change, which doesn't do anything. It replaces
 *  the two radio button, for switching between displayed loans, to the type
 *  of button used in the other two columns. It just hides the original ones
 *  and then registers an event listener, on the new button, witch switches
 *  between clicking on either of the radio buttons.
 */
export function showSwitchMetricButton (root)
{
    const parent = u('.investment-card__radios', root);
    parent.removeClass('m-u-margin-bottom--lg-4','m-u-margin-top-none');
    
    const radios = u('.investment-card__radios .m-form-radio', root);
    radios.addClass(classHidden);
    
    
    let toggle = 0;
    
    function switchMetric ()
    {
        u('input', parent.first()).nodes[toggle = (toggle + 1) % 2].click();
    }
    
    const target = u('<div/>').first();
    render(html`<a class="m-btn m-btn--block m-btn--no-min-width" @click=${switchMetric}>
        <span class="m-btn__text m-u-fs-5 m-u-ta-center m-u-color-2--text" data-v-33540b76="">
            ${localization('SwitchMetric')}
        </span>
    </a>`, target);
    
    parent.first().insertAdjacentElement('beforeend', target.children[0]);
}
