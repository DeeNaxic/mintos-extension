/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import {localization} from "../../common/localization";
import u from 'umbrellajs';

export function renderRatings (model, node)
{
    // We'll find this node a new parent
    const mintosRating = u('.score-wrapper', node).first();
    
    function exploreP2PRating (ratingNum)
    {
        if (ratingNum)
        {
            return rating(Math.ceil(ratingNum / 10), ratingNum);
        }
        else
        {
            return rating(1, '-');
        }
    }
    
    function rating (ratingNum, ratingStr)
    {
        return html`
<div class="score-wrapper m-u-d-flex m-u-w-fc mw-u-height-24 mw-u-o-hidden mw-u-br-4">
    <div
        id="invext-explorep2p-rating"
        class="score-value m-u-w-full m-u-fs-6 m-u-jc-center mw-u-va-center m-u-padding-x-3 mw-u-width-40 mintos-score-color-${ratingNum}"
        >
        ${ratingStr}
    </div>
</div>`
    }
    
    render(html`<div id="invext-lo-ratings" class=${node.classList}>
    ${[...node.children]}
    ${createOriginatorRow("Mintos " + localization('Rating'), mintosRating)}
    ${createOriginatorRow(html`
        <a href="https://explorep2p.com/mintos-lender-ratings/"
            target="_blank">ExploreP2P</a>'s ${localization('Rating')}`,
        exploreP2PRating(model.explorep2pRating || 0))}
</div>
`, node);
    
    // need data attribute for CSS to apply to our elements
    Object.assign(u('#invext-explorep2p-rating').first().dataset, mintosRating.dataset)
    
    return node;
}

/*
 *  This is an auxiliary function, which is used to create a new row of data
 *  in the originator box. It handles everything from setting the attributes
 *  and adding the styles. The two parameters passed in here, is the headers
 *  text, which is the left column and the content which is the right column
 */
function createOriginatorRow (header, content)
{
    return html`<div class="m-o-grid">
    <div class="m-o-grid__item m-o-grid__item--xs-4">
        <div class="field-description">
            ${header}
        </div>
    </div>
    <div class="m-o-grid__item m-o-grid__item--xs-5">
        <div class="value">
            ${content}
        </div>
    </div>
</div>
    `;
}
