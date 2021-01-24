/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

// comment out incomplete translations

import {translations as cs} from './/cs.js';
import {translations as de} from './/de.js';
import {translations as en} from './/en.js';
// import {translations as es} from '../localization/es.js';
// import {translations as lv} from '../localization/lv.js';
// import {translations as nl} from '../localization/nl.js';
import {translations as pl} from './/pl.js';
// import {translations as ru} from '../localization/ru.js';

const translations = {
    cs,
    de,
    en,
    // es,
    // lv,
    // nl
    pl,
    // ru,
};

export const userLang = (pathname) => /(?:\/webapp)?\/(\w{2})\//.exec(pathname)[1];

export function localization (field, lang = null)
{
    return translations[lang || userLang(document.location.pathname)][field];
}
