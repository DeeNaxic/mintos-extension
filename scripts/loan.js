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
    if (document.location.pathname.match(/^\/\w{2}\/\d+-\d+/g) === null)
    {
        return;
    }
    
    console.log("running the loan page extensions.");
});
