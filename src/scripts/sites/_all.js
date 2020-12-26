/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import '../common/polyfills'
import {localization} from '../localization/';

const pathname = document.location.pathname;

if (process.env.NODE_ENV !== 'production')
{
    console.info(`this page: ${pathname}`);
}

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
    
    moduleFuture
        .then(module => module.handle())
        .catch(console.warn);
})()
