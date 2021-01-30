/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export const translations = {
    'Age'             : 'Hohes Alter',
    'all-time'        : 'Alle Zeiten',
    'Amount'          : 'Anzahl',
    'Country'         : 'Land',
    'Days'            : 'Tage',
    'DaysLate'        : 'Tage verspätet',
    'DaysToNext'      : 'Tage bis zur nächsten Zahlung',
    'LoanId'          : 'Darlehen-Nr.',
    'Name'            : 'Name',
    'NextPayment'     : 'Nächste Zahlung',
    'Ontime'          : 'pünktliche',
    'OntimePayments'  : 'Pünktliche Zahlungen',
    'Payments'        : 'Zahlungen',
    'Percent'         : 'Prozent',
    'Rating'          : 'Bewertung',
    'ReferenceId'     : 'Belegnr.',
    'SwitchMetric'    : 'Veränderung',
    'TimeInGrace'     : 'Zeit in Schonfrist',
    'TransactionId'   : 'Transaktions-Nr.',
    'TransactionType' : 'Geschäftsvorgang',
    'Warning'         : 'Warnung',
    'Years'           : 'Jahre',
    
    // patterns used to extract data from page
    
    '$Borrower'            : 'Kreditnehmer',
    '$BorrowerPattern'     : /(?:Weiblich|Männlich), (\d+)/i,
    '$Date'                : 'Datum',
    '$Default'             : '?',
    '$Finished'            : 'Zurückgezahlt',
    '$FinishedPrematurely' : 'Vorzeitig beendet',
    '$Late'                : 'In Verzug',
    '$NextPayment'         : 'Nächster  Zahlungstermin',
    '$Occupation'          : 'Occupation',
    '$Paid'                : 'Gezahlt',
    '$PartiallyPaid'       : 'Teilweise bezahlt',
    '$PathOverview'        : 'ubersicht',
    '$PaymentDate'         : 'Zahlungsdatum',
    '$Scheduled'           : 'Geplante',
    '$Term'                : 'Laufzeit',
    '$TransactionDetails'  : /[-–]? (?:- )?(\D+)(?: (-?\d+).)?$/u,
};
