/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import '../common/polyfills'
import {localization} from '../localization/';
import {debug} from "../common/util";

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
        moduleFuture = import('./loan');
    }
    else if (pathname.includes(localization('$PathOverview')))
    {
        moduleFuture = import('./overview');
    }
    
    
    if (moduleFuture !== undefined)
    {
        moduleFuture
            .then(module => module.handle())
            .catch(console.warn);
    }
})()
