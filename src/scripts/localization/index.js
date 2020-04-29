/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

// comment out incomplete translations

import {translations as cs} from '../localization/cs';
import {translations as de} from '../localization/de';
import {translations as en} from '../localization/en';
// import {translations as es} from '../localization/es';
// import {translations as lv} from '../localization/lv';
// import {translations as nl} from '../localization/nl';
import {translations as pl} from '../localization/pl';
// import {translations as ru} from '../localization/ru';

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

const userLang = document.location.pathname.substring(1, 3);

export function localization (field)
{
    return translations[userLang][field];
}
