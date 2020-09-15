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

// since we can't make a matcher for the loan page, we load it here dynamically
    if (isLoanPage(pathname))
    {
    import('./loan')
        .then(module => module.handle())
        .catch(console.warn);
    }
    else if (pathname.includes(localization('$PathOverview')))
    {
        import('./overview')
            .then(module => module.handle())
            .catch(console.warn);
    }
})()

