/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import u from 'umbrellajs';

/**
 *  This feature adds a new css class to blog.
 *  After you visit an article link, it will be greyed out.
 */
export function grayOutVisitedNews (blog)
{
    u(blog).addClass('invext-blog');
}