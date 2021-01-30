/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export const translations = {
    'Age'             : 'Wysoki wiek',
    'all-time'        : 'Od początku',
    'Amount'          : 'Ilość',
    'Country'         : 'Kraj',
    'Days'            : 'dni',
    'DaysLate'        : 'Spóźnione dni',
    'DaysToNext'      : 'Dni do następnej płatności',
    'LoanId'          : 'Id. pożyczki',
    'Name'            : 'Imię',
    'NextPayment'     : 'Następna opłata',
    'Ontime'          : 'na czas',
    'OntimePayments'  : 'Opłata na czas',
    'Payments'        : 'Płatności',
    'Percent'         : 'Procent',
    'Rating'          : 'Ocena',
    'ReferenceId'     : 'ID ref. trans.',
    'SwitchMetric'    : 'Przełącz Widok',
    'TimeInGrace'     : 'Całkowity czas karencji',
    'TransactionId'   : 'Id. transakcji',
    'TransactionType' : 'Typ transakcji',
    'Warning'         : 'Uwaga',
    'Years'           : 'lat',
    
    // patterns used to extract data from page
    
    '$Borrower'            : 'Pożyczkobiorca',
    '$BorrowerPattern'     : /(?:mężczyzna|kobieta) (\d+)/i,
    '$Date'                : 'Data',
    '$Default'             : 'Opóźnienie',
    '$Finished'            : 'Zakończony',
    '$FinishedPrematurely' : 'Status Zokończona przed czasem',
    '$Late'                : 'Opóźnienie',
    '$NextPayment'         : 'Data  następnej  płatności',
    '$Occupation'          : 'Zawód',
    '$Paid'                : 'Zapłacono',
    '$PartiallyPaid'       : 'Częściowo zapłacone',
    '$PathOverview'        : 'przeglad',
    '$PaymentDate'         : 'Data płatności',
    '$Scheduled'           : 'Zaplanowano',
    '$Term'                : 'Okres',
    '$TransactionDetails'  : /[-–] (\D+)(?: (-?\d+).)?$/u,
};
