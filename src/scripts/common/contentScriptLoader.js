/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import './polyfills'
import {localization} from './localization';
import {debug} from "./util";

const pathname = document.location.pathname;

debug('this page:', pathname);

function isLoanPage (pathname)
{
    return /^\/webapp\/\w{2}\/[0-9]+(?:-[0-9]+)?/.test(pathname);
}

(function handle ()
{
    if (!pathname.startsWith('/webapp/'))
    {
        return;
    }

    let moduleFuture;
    if (isLoanPage(pathname))
    {
        moduleFuture = import('../sites/loan');
    }
    else if (/^\/webapp\/..\/[\w\-]+\/current-investments/.test(pathname))
    {
        moduleFuture = import('../sites/investmentsCurrent');
    }
    else if (pathname.includes(localization('$PathOverview')))
    {
        moduleFuture = import('../sites/overview');
    }
    
    
    if (moduleFuture !== undefined)
    {
        moduleFuture
            .then(module => module.handle())
            .catch(console.warn);
    }
})()
