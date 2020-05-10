/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import '../common/polyfills'

function isLoanPage (pathname)
{
    return /^\/webapp\/\w{2}\/[0-9]+(?:-[0-9]+)?/.test(pathname);
}

// since we can't make a matcher for the loan page, we load it here dynamically
if (isLoanPage(document.location.pathname))
    import('./loan')
        .then(module => module.handle())
        .catch(console.warn);
