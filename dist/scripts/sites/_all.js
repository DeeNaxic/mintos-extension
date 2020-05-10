/**
 * Chrome extensions get null value, while lit-html expects it to be either an object or undefined.
 * If you import anything that depends on the below line, you need to move it to a separate import, as imports are
 * executed before other code.
 */
delete window.customElements;

/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

function isLoanPage (pathname)
{
    return /^\/webapp\/\w{2}\/[0-9]+(?:-[0-9]+)?/.test(pathname);
}

// since we can't make a matcher for the loan page, we load it here dynamically
if (isLoanPage(document.location.pathname))
    import('../../loan-229471e8.js')
        .then(module => module.handle())
        .catch(console.warn);
