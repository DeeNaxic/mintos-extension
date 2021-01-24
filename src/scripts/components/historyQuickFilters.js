import u from 'umbrellajs'
import {localization} from "../localization";
import {html, render} from "lit-html";
import moment from "moment";
import {mintosDateFormat} from "../common/util";

const KEY_ALL_TIME = 'all-time';

/*
 *  This adds an 'All time' button to the account overview, which sets the time
 *  period, to show all your investments on Mintos. This is helpful when you
 *  want the total progression over time without setting selecting the dates
 */
export function extendQuickFilters (root)
{
    const filtersInputModel = {
        labels : parseFilterLabels(root),
    };
    const renderModel = toRenderModel(filtersInputModel);
    renderHistoryQuickFilters(renderModel, root);
    installOnClickHandler();
}

const template = (items, onClick) =>
    items.map(item => itemTemplate(item, onClick))
;

const className = key => key === 'today' ? 'active' : '';

const itemTemplate = (item, onClick) => html`<li class="m-quickfilter-item">
    <a href="javascript:;" @click=${onClick} data-value="${item.key}" class=${className(item.key)}>${item.label}</a>
</li>
`;

const filterDates = {
    'today'                   : [
        moment(),
        moment()
    ],
    'yesterday'               : [
        moment().subtract(1, 'day'),
        moment().subtract(1, 'day')
    ],
    'this-week'               : [
        moment().startOf('week'),
        moment()
    ],
    'this-month'              : [
        moment().startOf('month'),
        moment()
    ],
    'last-week'               : [
        moment().startOf('week').subtract(1, 'week'),
        moment().startOf('week').subtract(1, 'day')
    ],
    'last-month'              : [
        moment().startOf('month').subtract(1, 'month'),
        moment().startOf('month').subtract(1, 'day')
    ],
    'beginning-of-last-month' : [
        moment().startOf('month').subtract(1, 'month'),
        moment()
    ],
    [KEY_ALL_TIME]            : [
        moment('1950-01-01'),
        moment()
    ],
}

/*
 * Looks like content script can't access nodes' data attributes...
 * As a workaround, keep names of the filters in order, and hope it doesn't change on the page.
 * Alternatively, we could keep all the labels in all supported languages in the code,
 * but that seems to much hassle.
 */
const defaultFilters = [
    'today',
    'yesterday',
    'this-week',
    'this-month',
    'last-week',
    'last-month',
    'beginning-of-last-month',
];

const allFilters = [...defaultFilters, KEY_ALL_TIME];

function renderHistoryQuickFilters (model, target)
{
    render(template(model.filters, onClick), target);
}

function parseFilterLabels (node)
{
    return u('li', node)
        .array((li, index) => ({[defaultFilters[index]] : li.textContent.trim()}))
        .reduce((result, elem) => ({...result, ...elem}), {});
}

class QuickFilterElement
{
    constructor (key, label)
    {
        this.key = key;
        this.label = label;
    }
}

function toRenderModel (model)
{
    const labels = {
        ...model.labels,
        [KEY_ALL_TIME] : localization(KEY_ALL_TIME),
    }
    
    return {
        filters : allFilters.map(key => new QuickFilterElement(key, labels[key])),
    };
}

function clearActive ()
{
    u('li.m-quickfilter-item > a[class ~= "active"]').removeClass('active')
}

function onClick (event)
{
    const elem = u(event.target);
    if (!elem.hasClass('active'))
    {
        clearActive();
        elem.addClass('active');
    }
    
    const dates = filterDates[elem.data('value')];
    u('#period-from').first().value = dates[0].format(mintosDateFormat);
    u('#period-to').first().value = dates[1].format(mintosDateFormat);
    u('#filter-button').trigger('click');
}

function installOnClickHandler ()
{
    u('#period-from,#period-to').on('click', clearActive);
}
