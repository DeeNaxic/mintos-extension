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
    var $borrower       = $tables[1];
    var $schedule       = $tables[2];
    
    function createDetailsRow (header, content)
    {
        var nodeOuter = document.createElement('tr');
            
        var nodeInner = document.createElement('td');
            nodeInner.innerHTML = header;
            nodeInner.classList.add('field-description');
            nodeOuter.appendChild(nodeInner);
            
        var nodeInner = document.createElement('td');
            nodeInner.innerHTML = content;
            nodeInner.classList.add('value');
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  Experimental
     */
    if (true)
    {
        var tt = createDetailsRow('Country', document.querySelector('.m-h1 img').title);
        $details.insertBefore(tt, $details.firstChild);
    }
    
    /*
     *  Experimental
     */
    if (true)
    {
        if ($details.lastChild.lastChild.innerText != 'Current')
        {
            $details.lastChild.style.background = '#d4574e22';
        }
    }
    
    /*
     *  Experimental
     */
    if (true)
    {
        var paid = 0;
        var late = 0;
        
        $schedule.querySelectorAll('tr').forEach(function (e)
        {
            if (e.lastChild.innerText == 'Paid')
            {
                paid++;
            }
            else
            if (e.lastChild.innerText == 'Scheduled')
            {
                
            }
            else
            {
                late++;
            }
        });
        
        var percent = ((paid / (paid + late) * 100.00) || 100.00).toFixed(2) + '%';
        var node = createDetailsRow('Perfect Payments', percent);
        $details.appendChild(node);
        console.log("On time payments: " + paid + " out of " + (paid + late) + " payments.");
    }
});
