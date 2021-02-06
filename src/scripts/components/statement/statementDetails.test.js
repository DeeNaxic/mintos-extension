/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import {parseTransactionDetails} from "./statementDetails.js";
import test from 'ava';

function testParse (t, text, lang)
{
    const details = parseTransactionDetails(text, lang);
    t.is(!!details, true);
}


const messages = {
    // these were taken from mintos account history on 2020-04-21.
    // Could be outdated by the time you read it.
    
    // New special cases and languages welcome.
    
    cs :
    [
        'ID transakce: 1821066232 - Půjčka 11428407-01 - obdržený úrok',
        'ID transakce: 1820370424 - Půjčka 7315696-01 – sleva/přirážka na transakce na sekundárním trhu 1820370423.',
        'ID transakce: 1336583656 - Vklady',
    ],
    de :
    [
        'Transaktions-Nr.: 1794879634 - Darlehen Nr. 27955646-01 Hauptbetrag',
        'Transaktions-Nr.: 1336583656 - Eingehende Zahlungen vom Bankkonto',
        'Transaktions-Nr.: 1820370406 - Kredit 28084335-01 - Rabatt/Prämie für Zweitmarkt-Transaktion 1820370405',
    ],
    en :
    [
        'Transaction ID: 1821066232 - Loan 11428407-01 - interest received',
        'Transaction ID: 1820370424 - Loan 7315696-01 - discount/premium for secondary market transaction 1820370423.',
        'Transaction ID: 1336583656 - Deposits',
    ],
/*
    es :
    [
        'Identificación de la operación: 1794879634 - Préstamo 27955646-01 - principal recibido',
        'Identificación de la operación: 1820370406 - Préstamo 28084335-01 - descuento/prima por operación del mercado secundario 1820370405.',
        'Identificación de la operación: 1336583656 - Depósitos',
    ],
    lv :
    [
        'Transakcijas ID: 1794879634 - Pamatsumma Aizdevums 27955646-01',
        'Transakcijas ID: 1820370406 - Atlaide/Uzcenojums par otrreizējā tirgus darījuma transakciju ID 1820370405. Aizdevums ID: 28084335-01.',
        'Transakcijas ID: 1336583656 - Iemaksas no bankas konta',
    ],
    nl :
    [
        'Transactie ID: 1794879634 - Lening 27955646-01 - ontvangen hoofdsom',
        'Transactie ID: 1820370406 - Lening 28084335-01 - korting/premie voor transactie op de secundaire markt 1820370405.',
        'Transactie ID: 1336583656 - Deposito\'s',
    ],
*/
    pl :
    [
        'ID transakcji: 1794879634 - Pożyczka 27955646-01 – otrzymana należność główna',
        'ID transakcji: 1820370406 - Pożyczka 28084335-01 - zniżka/zysk w przypadku transakcji na rynku wtórnym 1820370405.',
        'ID transakcji: 1336583656 - Wpłaty',
    ],
/*
    ru :
    [
        'ID транзакции: 1794879634 - Основная сумма Займа 27955646-01',
        'ID транзакции: 1820370406 - Займ 28084335-01 - Скидка/Премия на операции на вторичном рынке 1820370405',
        'ID транзакции: 1336583656 - Входящие платежи с банковского счета',
    ],
*/
}

Object.entries(messages).forEach(([lang, msgs]) =>
{
    msgs.forEach(s => test('Parse details from "' + s + '"', testParse, s, lang));
});
