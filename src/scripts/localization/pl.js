/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export const translations = {
    'Age'             : 'Wysoki wiek',
    'all-time'         : 'Od początku',
    'Amount'          : 'Ilość',
    'Country'         : 'Kraj',
    'Days'            : 'dni',
    'DaysLate'        : 'Spóźnione dni',
    'LoanId'          : 'Id. pożyczki',
    'Name'            : 'Imię',
    'NextPayment'     : 'Następna opłata',
    'Ontime'          : 'na czas',
    'OntimePayments'  : 'Opłata na czas',
    'Payments'        : 'Płatności',
    'Percent'         : 'Procent',
    'Rating'          : 'Ocena',
    'ReferenceId'     : 'ID ref. trans.',
    'TimeInGrace'     : 'Całkowity czas karencji',
    'TransactionId'   : 'Id. transakcji',
    'TransactionType' : 'Typ transakcji',
    'Warning'         : 'Uwaga',
    'Years'           : 'lat',
    
    // patterns used to extract data from page
    
    '$Borrower'            : 'Pożyczkobiorca',
    '$BorrowerPattern'     : /(?:mężczyzna|kobieta) (\d+)/i,
    '$Date'                : 'Data',
    '$Default'             : '?',
    '$Finished'            : 'Finished',
    '$FinishedPrematurely' : 'Status Zokończona przed czasem',
    '$Late'                : 'Late',
    '$Occupation'          : 'Zawód',
    '$Paid'                : 'Zapłacono',
    '$PartiallyPaid'       : 'Częściowo zapłacone',
    '$PaymentDate'         : 'Data płatności',
    '$Scheduled'           : 'Zaplanowano',
    '$TransactionDetails'  : /[-–] (\D+)(?: (-?\d+).)?$/u,
};
