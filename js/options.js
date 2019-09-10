chrome.storage.sync.get(
[
    'InvestmentsShowDaysToNext',
    'InvestmentsHighlightLate'
],
function (data)
{
    if(data.InvestmentsShowDaysToNext === undefined)
    {
        chrome.storage.sync.set(
        {
            'InvestmentsShowDaysToNext' : true,
            'InvestmentsHighlightLate'  : true,
            'OverviewHideZeroes'        : true,
            'OverviewShowPercentages'   : true,
            'OverviewShowButtonInstead' : true,
            'OverviewNegativeNumbers'   : true,
            'InvestmentsUseTableLinks'  : true
        }, 
        function(){});
    }
});

chrome.storage.sync.get(
    [
        'InvestmentsShowDaysToNext',
        'InvestmentsHighlightLate'
    ],
    function (data)
    {
        console.log(data.InvestmentsShowDaysToNext);
    });