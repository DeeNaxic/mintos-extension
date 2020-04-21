/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

// comment out incomplete translations

import {translations as cs} from '../localization/cs.js';
import {translations as de} from '../localization/de.js';
import {translations as en} from '../localization/en.js';
// import {translations as es} from '../localization/es.js';
// import {translations as lv} from '../localization/lv.js';
// import {translations as nl} from '../localization/nl.js';
import {translations as pl} from '../localization/pl.js';
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

const userLang = () => document.location.pathname.substring(1, 3);

export function localization (field, lang = null)
{
    return translations[lang || userLang()][field];
}
