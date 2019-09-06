
/*
 *  Auxiliary methods:
 */
function toFloat (source)
{
    return parseFloat(source.replace(/[€\s]/g, ''));
}



/*
 *  Global references:
 */
var $boxes      = document.querySelectorAll('table');
var $boxAmount  = $boxes[2];
var $boxNumber  = $boxes[3];
var $amount     = $boxAmount.querySelector('.em span').innerText;
var $number     = $boxNumber.querySelector('.em span').innerText;
var $toggle     = 0;



/*
 *  Runtime:
 */
chrome.storage.sync.get(
{
    'setting_ow_HideZeros'          : true,
    'setting_ow_ShowPercentages'    : true,
    'setting_ow_ShowButtonInstead'  : true
},
function (data)
{
    if (data.setting_ow_HideZeros)
    {
        
    }
    
    if (data.setting_ow_ShowPercentages)
    {
        
    }
    
    if (data.setting_ow_ShowButtonInstead)
    {
        
    }
});
