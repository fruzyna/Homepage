status()
setInterval(status, 1000)

// produces status header with date and time
function status()
{
    // definitions of text values
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    // build time
	var d = new Date()
	var hr = d.getHours()
	var min = d.getMinutes()
	if(min < 10)
	{
		min = "0" + min
	}
	var sec = d.getSeconds()
	if(sec < 10)
	{
		sec = "0" + sec
	}
	var m = "am"
	if(hr > 12)
	{
		hr -= 12
		m = "pm"
    }
    
    // build date
	var mon = months[d.getMonth()]
	var day = days[d.getDay()]
	var date = d.getDate()
    var yr = 1900 + d.getYear()
    
	document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec + m
	document.getElementById("date").innerHTML = day + ", " + mon + " " + date + " " + yr
}

// find and read config file
function load()
{
    // determine config file from url
	urlParams = new URLSearchParams(window.location.search);
	if ((config = urlParams.get('config')) == null)
	{
		config = 'home'
    }
    
    // read config if it can be found
	if ((configTxt = fetchFile(config + '.conf')))
	{
        readConfig(configTxt.split('\n'))
        return true
    }
    return false
}

// retrieves a file from localStorage or server
function fetchFile(file)
{
    // check if its available locally
    if ((text = localStorage.getItem(file)) != null)
    {
        return text
    }

    // otherwise fetch from server
	var req = new XMLHttpRequest()
	req.open('GET', file, false)
	req.send()
	if (req.status == 200)
	{
		return req.responseText
    }
    
	return false
}

// read the links file to get categories and their links
function readConfig(lines)
{
    var currObj = -1
	catObjs = []
    
    // iterate through each line
	for(var i in lines)
	{
		line = lines[i].trim()
		if(line.length > 0)
		{
			if(!line.includes(','))
			{
                // if there is no comma, create a new category
                catObjs.push({name: line, children: []})
                ++currObj
			}
			else if (currObj >= 0)
			{
                // otherwise add a new link
				var parts = line.split(',')
				catObjs[currObj].children.push({name: parts[0], link: parts[1]})
			}
        }
	}
}

// write the current config to local storage
function writeConfig(file, catObjs)
{
    text = ""
    for (var i in catObjs)
    {
        cat = catObjs[i]
        text += cat.name + '\n'
        for (var j in cat.children)
        {
            child = cat.children[j]
            text += child.name + ',' + child.link + '\n'
        }
    }

    localStorage.setItem(file + '.conf', text)
    return text
}