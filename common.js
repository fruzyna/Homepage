// definitions of text values
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

var timeFormat = '24'

// register service workers
if ('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('pwa.js')
}

status()
setInterval(status, 1000)

// produces status header with date and time
function status()
{
    // build time
	let d = new Date()
	let hr = d.getHours()
	let min = d.getMinutes()
	if(min < 10)
	{
		min = `0${min}`
	}
	let sec = d.getSeconds()
	if(sec < 10)
	{
		sec = `0${sec}`
	}
	let m = ''
	if (timeFormat == '12')
	{
		if(hr > 12)
		{
			hr -= 12
			m = 'pm'
		}
		else
		{
			m = 'am'
		}
	}
    
    // build date
	let mon = months[d.getMonth()]
	let day = days[d.getDay()]
	let date = d.getDate()
    let yr = 1900 + d.getYear()
    
	document.getElementById('time').innerHTML = `${hr}:${min}:${sec}${m}`
	document.getElementById('date').innerHTML = `${day}, ${mon} ${date} ${yr}`
}

// find and read config file
function load()
{
    // determine config file from url
	let urlParams = new URLSearchParams(window.location.search)
	if ((config = urlParams.get('config')) == null)
	{
		config = 'home'
    }
	if ((timeFormat = urlParams.get('timeFormat')) == null)
	{
		timeFormat = '24'
    }
    
	// read config if it can be found
	let configTxt = fetchFile(`${config}.conf`)
	if (configTxt)
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
	let text = localStorage.getItem(file)
    if (text != null)
    {
        return text
    }

    // otherwise fetch from server
	let req = new XMLHttpRequest()
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
    let currObj = -1
	catObjs = []
    
    // iterate through each line
	for(i in lines)
	{
		let line = lines[i].trim()
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
				let parts = line.split(',')
				catObjs[currObj].children.push({name: parts[0], link: parts[1]})
			}
        }
	}
}

// write the current config to local storage
function writeConfig(file, catObjs)
{
    let text = ''
    for (let i in catObjs)
    {
        let cat = catObjs[i]
        text += `${cat.name}\n`
        for (j in cat.children)
        {
            let child = cat.children[j]
            text += `${child.name},${child.link}\n`
        }
    }

    localStorage.setItem(`${file}.conf`, text)
    return text
}