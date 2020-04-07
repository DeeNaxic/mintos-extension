/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {html, render} from "lit-html";
import {localization} from "../localization";

export function renderRatings (model, node)
{
    render(html`
        <div id="invext-lo-ratings" class=${node.classList}>
            ${[...node.children]}
            ${createOriginatorRow('Mintos\'s ' + localization('Rating'), model.mintosRating)}
            ${createOriginatorRow(html`
ExploreP2P's <a href="https://explorep2p.com/mintos-lender-ratings/" target="_blank">
${localization('Rating')}
</a>`, model.explorep2pRating)}
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
    return html`
        <div class="m-o-grid">
            <div class="m-o-grid__item m-o-grid__item--xs-5">${header}</div>
            <div class="m-o-grid__item m-o-grid__item--xs-7">${content}</div>
        </div>
    `;
}
