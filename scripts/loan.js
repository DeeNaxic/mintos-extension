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
    
    var tables          = document.querySelectorAll('tbody');
    var details         = tables[0];
    var borrower        = tables[1];
    var schedule        = tables[2];
    
    function createDetailsRow (header, content)
    {
        var nodeOuter = document.createElement('tr');
            
        var nodeInner           = document.createElement('td');
            nodeInner.innerText = header;
            nodeInner.classList.add('field-description');
            nodeOuter.appendChild(nodeInner);
            
        var nodeInner           = document.createElement('td');
            nodeInner.innerText = content;
            nodeInner.classList.add('value');
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  Show a column at the beginning of the detail window, with the country of
     *  the note, written out as text. There is no flag in this value field. The
     *  reason for this, is that the flag is already shown at the top. But maybe
     *  we should remove it from there, and then add it to the left of the names
     */
    if (true)
    {
        details.insertBefore(createDetailsRow('Country', document.querySelector('.m-h1 img').title), details.firstChild);
    }
    
    /*
     *
     *  Experimental: Highlight dangerous information.
     *
     */
    if (true)
    {
        if (details.lastChild.lastChild.innerText != 'Current')
        {
            details.lastChild.style.background = '#d4574e22';
        }
    }
    
    /*
     *  This shows a percentage calculation, of how many payments, which were on
     *  time, and how many were delayed. It is shown as a percent out of hundred
     *  and it excludes scheduled payments which has not yet been made. If there
     *  is only scheduled payments the 'n/a' is shown instead of some percentage
     */
    if (true)
    {
        var $ontime  = 0;
        var $others  = 0;
        
        schedule.querySelectorAll('tr').forEach(function (element)
        {
            if (element.lastChild.innerText == 'Paid')
            {
                $ontime++;
            }
            else
            if (element.lastChild.innerText == 'Scheduled')
            {
                
            }
            else
            {
                $others++;
            }
        });
        
        var percent  = $others + $ontime > 0 ? ($ontime / ($others + $ontime) * 100.00).toFixed(0) + '%' : 'n/a';
        var node     = createDetailsRow('Perfect Payments', percent);
        
        details.appendChild(node);
    }
    
    /*
     *
     *  Experimental: Make investment breakdown a table.
     *
     */
    if (true)
    {
        function $createRow ()
        {
            var nodeOuter           = document.createElement('tr');
            var nodeInner           = document.createElement('td');
                nodeInner.innerText = 'a'
                nodeOuter.appendChild(nodeInner);
                
            var nodeInner           = document.createElement('td');
                nodeInner.innerText = 'b';
                nodeOuter.appendChild(nodeInner);
                
            return nodeOuter
        }
        
        var $wrapper = document.querySelector('.chart-data');
        var $table   = document.createElement('table');
        
        console.log("is it loaded yet?");
        $wrapper.querySelectorAll('ul li').forEach(function (element)
        {
            console.log(element);
        });
        console.log("no?");
    }
});
