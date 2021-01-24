/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export const translations = {
    'Age'             : 'Vysoký věk',
    'all-time'        : 'Kompletní historie',
    'Amount'          : 'Částka',
    'Country'         : 'Stát',
    'Days'            : 'dní',
    'DaysLate'        : 'dní v prodlení',
    'DaysToNext'      : 'Dní do další splátky',
    'LoanId'          : 'ID půjčky',
    'Name'            : 'Podíly investorů',
    'NextPayment'     : 'Další splátka',
    'Ontime'          : 'Včasných',
    'OntimePayments'  : 'Splátek včas',
    'Payments'        : 'Platby',
    'Percent'         : 'Procent',
    'Rating'          : 'Rating',
    'ReferenceId'     : 'ID zdrojové trans.',
    'SwitchMetric'    : 'Přepnout částky/počty',
    'TimeInGrace'     : 'Celkem dní v povoleném odkladu',
    'TransactionId'   : 'ID transakce',
    'TransactionType' : 'Typ platby',
    'Warning'         : 'Pozor',
    'Years'           : 'let',
    
    // patterns used to extract data from page
    
    '$Borrower'            : 'Dlužník',
    '$BorrowerPattern'     : /(?:žena|muž) (\d+)/i,
    '$Date'                : 'Date',
    '$Default'             : '?',
    '$Finished'            : 'Ukončené',
    '$FinishedPrematurely' : 'Předčasně ukončeno',
    '$Late'                : 'Late',
    '$NextPayment'         : 'Datum  další splátky',
    '$Occupation'          : 'Zaměstnání',
    '$Paid'                : 'Paid',
    '$PartiallyPaid'       : 'Částečně zaplaceno',
    '$PathOverview'        : 'prehled-uctu',
    '$PaymentDate'         : 'Datum platby',
    '$Scheduled'           : 'Naplánované',
    '$Term'                : 'Doba splácení',
    '$TransactionDetails'  : /[-–] (\D+)(?: (-?\d+).)?$/u,
};
