/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import {localization} from "../localization";
import u from 'umbrellajs';

const ratingCodes = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'];

export function renderRatings (model, node)
{
    function mintosRating (ratingStr)
    {
        const num = ratingCodes.indexOf(ratingStr) + 1;
        return rating(num, ratingStr);
    }
    
    function exploreP2PRating (ratingNum)
    {
        const str = !Number.isNaN(ratingNum) ? `${ratingNum} / 100` : null;
        return rating(10 - Math.ceil(ratingNum / 10) + 1, str);
    }
    
    function rating (ratingNum, ratingStr)
    {
        if (Number.isNaN(ratingNum) || ratingNum === -1)
            return '-';
        else
            return html`<span class="lo-rating lo-rating-${ratingNum}">${ratingStr}</span>`;
    }
    
    u('span.lo-rating', node).remove();
    
    render(html`<div id="invext-lo-ratings" class=${node.classList}>
    ${[...node.children]}
    ${createOriginatorRow("Mintos' " + localization('Rating'), mintosRating(model.mintosRating))}
    ${createOriginatorRow(html`
ExploreP2P's <a href="https://explorep2p.com/mintos-lender-ratings/" target="_blank">
${localization('Rating')}
</a>`, exploreP2PRating(model.explorep2pRating))}
</div>                    
`, node);
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
