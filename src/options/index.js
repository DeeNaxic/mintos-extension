/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

chrome.storage.sync.get(
{
    // overview.js
    'OverviewHideEmptyRows'             : true,
    'OverviewShowPercentages'           : true,
    'OverviewShowButtonInstead'         : true,
    'OverviewHighlightNegativeNumbers'  : true,
    'OverviewGrayOutVisitedNews'        : true,
    'OverviewBreakdownRewards'          : true,
    
    // investments.js
    'InvestmentsUseLoanTypeLinks'       : false,
    'InvestmentsShowCountryColumn'      : true,
    
    // investmentsCurrent.js
    'InvestmentsShowDaysToNextPayment'  : true,
    'InvestmentsHighlightLateLoans'     : true,
    'InvestmentsShowPremiumDiscount'    : true,
    
    // investmentsFinished.js
    'InvestmentsShowProfitColumn'       : true,
    'InvestmentsShowDurationColumn'     : true,
    
    // loan.js
    'LoanShowCountryRow'                : true,
    'LoanShowOntimePaymentPercent'      : true,
    'LoanShowTotalGraceTime'            : true,
    'LoanFormatInvestmentBreakdown'     : true,
    'LoanShowNextPaymentRow'            : true,
    'LoanShowAdditionalRatings'         : true,
    'LoanShowPaymentWarning'            : true,
    'LoanShowAgeWarning'                : true,
    'LoanShowJobWarning'                : true,
    
    // accountStatement.js
    'AccountOverviewUseFourDecimals'    : false,
    'AccountOverviewShowAllTimeButton'  : true,
    
    // autoInvest.js
    'AutoInvestHighlightUtilityUse'     : true,
    'AutoInvestShowUtilizationPercent'  : true
},
function (data)
{
    document.querySelector('.top img').src = 'img/' + document.querySelector('tr').id + '_0.png';
    document.querySelector('.bot img').src = 'img/' + document.querySelector('tr').id + '_1.png';
    
    /*
     *  This takes in all the values from the data object and then tries to find
     *  an ID with that name, which is the rows in the settings tables. On these
     *  it tries to find the input checkbox, and set the checked box value as so
     */
    for (let k in data)
    {
        document.querySelector('#' + k + ' input').checked = data[k];
    }
    
    /*
     *  This adds eventlisteners to all rows of the data table. It adds an event
     *  to the checkbox, so when changing the value, it instantly stored the new
     *  configuration to the chrome sync storage. It also adds a click behaviour
     *  to the 'example' link, so when clicking it it will switch the images out
     */
    for (let k in data)
    {
        document.querySelector('#' + k + ' input').addEventListener('change', function ()
        {
            chrome.storage.sync.set({ [k] : this.checked }, null);
        });
        
        document.querySelectorAll('#' + k + ' p').forEach(function (element)
        {
            element.addEventListener('click', function ()
            {
                document.querySelector('.top img').src = 'img/' + k + '_0.png';
                document.querySelector('.bot img').src = 'img/' + k + '_1.png';
            });
        });
    }
});
