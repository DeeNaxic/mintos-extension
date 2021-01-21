/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export const translations = {
    'Age'             : 'High age',
    'all-time'        : 'All Time',
    'Amount'          : 'Amount',
    'Country'         : 'Country',
    'Days'            : 'days',
    'DaysLate'        : 'days late',
    'LoanId'          : 'Loan ID',
    'Name'            : 'Name',
    'NextPayment'     : 'Next Payment',
    'Ontime'          : 'on-time',
    'OntimePayments'  : 'On-time Payments',
    'Payments'        : 'Payments',
    'Percent'         : 'Percent',
    'Rating'          : 'Rating',
    'ReferenceId'     : 'Reference ID',
    'SwitchMetric'    : 'Switch Metric',
    'TimeInGrace'     : 'Time in grace',
    'TransactionId'   : 'Transaction ID',
    'TransactionType' : 'Transaction Type',
    'Warning'         : 'Warning',
    'Years'           : 'years',
    
    // patterns used to extract data from page
    
    '$Borrower'            : 'Borrower',
    '$BorrowerPattern'     : /(?:female|male), (\d+) y/i,
    '$Date'                : 'Date',
    '$Default'             : 'Default',
    '$Finished'            : 'Finished',
    '$FinishedPrematurely' : 'Finished prematurely',
    '$Late'                : 'Late',
    '$Occupation'          : 'Occupation',
    '$Paid'                : 'Paid',
    '$PartiallyPaid'       : 'Partially paid',
    '$PathOverview'        : 'overview',
    '$PaymentDate'         : 'Payment Date',
    '$Scheduled'           : 'Scheduled',
    '$TransactionDetails'  : /[-–] (\D+)(?: (-?\d+).)?$/u,
};
