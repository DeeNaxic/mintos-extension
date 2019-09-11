
/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    'OverviewHideZeroes'        : true,
    'OverviewShowPercentages'   : true,
    'OverviewShowButtonInstead' : true,
    'OverviewNegativeNumbers'   : true,
    'InvestmentsUseTableLinks'  : true,
    'InvestmentsShowDaysToNext' : true,
    'InvestmentsHighlightLate'  : true,
    'InvestmentsShowProfit'     : true,
    'InvestmentsShowDuration'   : true
},
function (data)
{
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
        
        document.querySelector('#' + k + ' a').addEventListener('click', function ()
        {
            document.querySelector('.top img').src = 'img/' + k + '_0.png';
            document.querySelector('.bot img').src = 'img/' + k + '_1.png';
        });
    }
});
