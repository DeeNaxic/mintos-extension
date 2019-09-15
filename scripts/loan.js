/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    
},
function (data)
{
    if (document.location.pathname.match(/^\/\w{2}\/[0-9]+-[0-9]+/g) === null)
    {
        return;
    }
    
    var $tables         = document.querySelectorAll('tbody');
    var $details        = $tables[0];
    var $borrower       = $tables[2];
    var $schedule       = $tables[3];
    
    console.log("running the loan page extensions.");
});
