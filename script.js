var catObjs = []

// initialize page
loadLinks()
status()
setInterval(status, 1000)
setInterval(resetThread, 250)
setInterval(resetThread, 250)
setInterval(function() {makeFeeds(getRandom, '*News', 'news')}, 60000)
setInterval(function() {makeFeeds(getRandom, '*Podcasts', 'podcasts')}, 60000)

// request links file from server and respond
function loadLinks()
{
	var file = "links"

	var server = new XMLHttpRequest()
	server.open('GET', file)
	server.onreadystatechange = function()
	{
		readFile(server.responseText.split('\n'))
		makeCategories()
		makeFeeds(getLatest, '*News', 'news')
		makeFeeds(getLatest, '*Podcasts', 'podcasts')
	}
	server.send()
}

// read the links file to get categories and their links
function readFile(lines)
{
	catObjs = []
	var name
	var children = []
	for(var i in lines)
	{
		line = lines[i].split('#')[0]

		if(line.length > 0)
		{
			if(!line.includes(','))
			{
				if(name != null)
				{
					//console.log("Making category: " + name + " with " + children.length + " children")
					var newObj = {name: name, children: children}
					catObjs.push(newObj)
				}
				name = line
				children = []
			}
			else
			{
				var parts = line.split(',')
				var child = {name: parts[0], link: parts[1]}
				children.push(child)
			}
		}
	}
	if(children.length > 0)
	{
		var newObj = {name: name, children: children}
		catObjs.push(newObj)
	}
}

// make the categories on screen
function makeCategories()
{
	var categories = ""
	for(var i in catObjs)
	{
		var cat = catObjs[i]
		if(cat.name.charAt(0) != '*')
		{
			categories += '<div class=\"button\" onmouseover=\"getCategory(\'' + cat.name + '\')\">' + cat.name + '</div>'
		}
	}
	document.getElementById('categories').innerHTML = categories
}

// timer based system to determine if links should be removed
var resetTime = -1
function resetLinks()
{
	if(resetTime < 0)
	{
		resetTime = (new Date().getTime()) + 500
	}
}

// set timer to paused value
function pauseTimer()
{
	resetTime = -1
}

// restart the timer
function resetThread()
{
	if(resetTime > 0 && (new Date().getTime()) > resetTime)
	{
		document.getElementById('links').innerHTML = ''
	}
}

// produces all links on screen for category
function getCategory(name)
{
	var links = ""
	if(name == "All")
	{
		for(var i in catObjs)
		{
			var cat = catObjs[i]
			for(var j in cat.children)
			{
				var child = cat.children[j]
				links += "<a class=\"button\" href=\"" + child.link + "\">" + child.name + "</a>"
			}
		}
	}
	else
	{
		var cat = getCategoryByName(name)
		for(var i in cat.children)
		{
			var child = cat.children[i]
			links += "<a class=\"button\" href=\"" + child.link + "\">" + child.name + "</a>"
		}
	}
	document.getElementById('links').innerHTML = links
}

// produces status header with date and time
function status()
{
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
	var mon = months[d.getMonth()]
	var day = days[d.getDay()]
	var date = d.getDate()
	var yr = 1900 + d.getYear()
	document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec + m
	document.getElementById("date").innerHTML = day + ", " + mon + " " + date + " " + yr
}

// finds a category object with the name of it
function getCategoryByName(name)
{
	for(i in catObjs)
	{
		var cat = catObjs[i]
		if(cat.name == name)
		{
			return cat
		}
	}
}

// produces a set of the most recent news
function makeFeeds(sortFunction, catName, container)
{
	var charLimit = 70
	var urls = getCategoryByName(catName).children
	var results = 15
	var pubsMax = 15

	var headlines = []
	var pubdates = []
	var doneCount = 0
	for(var j in urls)
	{
		var url = urls[j].link
		feednami.load(url,function(result)
		{
			if(result.error)
			{
				console.log(result.error)
			}
			else
			{
				var entries = result.feed.entries
				var feed = result.feed.meta.title
				if(feed.includes('–'))
				{
					feed = feed.substr(0, feed.indexOf(' –'))
				}
				for(var i = 0; i < entries.length && i < pubsMax; i++)
				{
					var entry = entries[i]
					var title = entry.title
					var link = entry.link
					var short = title
					if(title.length > charLimit)
					{
						short = title.substr(0, charLimit) + '...'
					}
					headlines.push('<tr><td style="display: table-cell;"><a class="rsslink" title="' + title + '" href="' + link + '">' + short + '</a></td><td>' + feed + '</td></tr>')
					pubdates.push(entry.date_ms)
					//console.log(feed + " " + entry.date_ms)
				}
			}
			doneCount++

			var pubs = urls.length
			if(doneCount == pubs)
			{
				var table = '<table align="center">'
				for(var i = 0; i < results; i++)
				{
					var next = sortFunction(pubdates)
					table += headlines[next]
					pull(pubdates, next)
					pull(headlines, next)
				}
				table += '</table>'
				document.getElementById(container).innerHTML = "<h2>" + removeAsterisk(catName) + "</h2><hr>" + table
			}
		})
	}
}

// removes asterisk from begining of string
function removeAsterisk(str)
{
	if(str.charAt(0) == '*')
	{
		return str.substring(1)
	}
	return str
}

//gets a random article index from list of dates
function getRandom(pubdates)
{
	return Math.floor((Math.random() * pubdates.length))
}

// gets the latest date in a list
function getLatest(pubdates)
{
	var newest = 0
	for(var i in pubdates)
	{
		if(pubdates[i] > pubdates[newest])
		{
			newest = i
		}
	}
	return newest
}

// "pops" the first item from an array given an index
function pull(array, index)
{
	var item = array[index]
	array.splice(index, 1)
	return item
}