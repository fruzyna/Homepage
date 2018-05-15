var catObjs = [];

loadLinks();
status();
setInterval(status, 1000);
setInterval(resetThread, 250);
setInterval(resetThread, 250);
//setInterval(makeFeedsRandom, 15000)
setInterval(makeFeedsSorted, 60000)

// request links file from server and respond
function loadLinks()
{
	var file = "links";

	var server = new XMLHttpRequest();
	server.open('GET', file);
	server.onreadystatechange = function()
	{
		readFile(server.responseText.split('\n'));
		makeCategories();
		//makeFeedsRandom();
		makeFeedsSorted();
	}
	server.send();
}

// read the links file to get categories and their links
function readFile(lines)
{
	catObjs = [];
	var name;
	var children = [];
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
					var newObj = {name: name, children: children};
					catObjs.push(newObj);
				}
				name = line;
				children = [];
			}
			else
			{
				var parts = line.split(',');
				var child = {name: parts[0], link: parts[1]};
				children.push(child);
			}
		}
	}
	if(children.length > 0)
	{
		var newObj = {name: name, children: children};
		catObjs.push(newObj);
	}
}

// make the categories on screen
function makeCategories()
{
	var categories = "";
	for(var i in catObjs)
	{
		var cat = catObjs[i];
		if(cat.name != 'Feeds')
		{
			categories += '<div class=\"button\" onmouseover=\"getCategory(\'' + cat.name + '\')\">' + cat.name + '</div>';
		}
	}
	document.getElementById('categories').innerHTML = categories;
}

// timer based system to determine if links should be removed
var resetTime = -1;
function resetLinks()
{
	if(resetTime < 0)
	{
		resetTime = (new Date().getTime()) + 500;
	}
}

// set timer to paused value
function pauseTimer()
{
	resetTime = -1;
}

// restart the timer
function resetThread()
{
	if(resetTime > 0 && (new Date().getTime()) > resetTime)
	{
		document.getElementById('links').innerHTML = '';
	}
}

// produces all links on screen for category
function getCategory(name)
{
	var links = "";
	if(name == "All")
	{
		for(var i in catObjs)
		{
			var cat = catObjs[i]
			for(var j in cat.children)
			{
				var child = cat.children[j]
				links += "<a class=\"button\" href=\"" + child.link + "\">" + child.name + "</a>";
			}
		}
	}
	else
	{
		var cat = getCategoryByName(name);
		for(var i in cat.children)
		{
			var child = cat.children[i]
			links += "<a class=\"button\" href=\"" + child.link + "\">" + child.name + "</a>";
		}
	}
	document.getElementById('links').innerHTML = links;
}

// produces status header with date and time
function status()
{
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var d = new Date();
	var hr = d.getHours();
	var min = d.getMinutes();
	if(min < 10)
	{
		min = "0" + min;
	}
	var sec = d.getSeconds();
	if(sec < 10)
	{
		sec = "0" + sec;
	}
	var m = "am";
	if(hr > 12)
	{
		hr -= 12;
		m = "pm";
	}
	var mon = months[d.getMonth()];
	var day = days[d.getDay()];
	var date = d.getDate();
	var yr = 1900 + d.getYear();
	document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec + m;
	document.getElementById("date").innerHTML = day + ", " + mon + " " + date + " " + yr;
}

// finds a category object with the name of it
function getCategoryByName(name)
{
	for(i in catObjs)
	{
		var cat = catObjs[i];
		if(cat.name == name)
		{
			return cat;
		}
	}
}

// produces a random set of links for news
function makeFeedsRandom()
{
	var charLimit = 70
	var urls = getCategoryByName('Feeds').children;
	var results = 10
	var pubsMax = 5

	var headlines = []
	var doneCount = 0
	for(var j = 0; j < urls.length; j++)
	{
		var url = urls[j].link
		feednami.load(url,function(result)
		{
			if(result.error)
			{
				console.log(result.error);
			}
			else
			{
				var entries = result.feed.entries;
				var feed = result.feed.meta.title
				if(feed.includes('–'))
				{getLate
					feed = feed.sgetLateubstr(0, feed.indexOf(' –'))
				}
				for(var i = 0; i < entries.length && i < pubsMax; i++)
				{
					var entry = entries[i];
					var title = entry.title
					var link = entry.link
					if(title.length > charLimit)
					{
						title = title.substr(0, charLimit) + '...'
					}
					headlines.push("<tr><td><a class=\"rsslink\" title=\"" + title + "\" href=\"" + link + "\">" + title + "</a></td><td>" + feed + "</td></tr>");
				}
			}
			doneCount++

			var pubs = urls.length
			if(doneCount == pubs)
			{
				var choosen = []
				var table = ""
				table += '<table align="center">'
				for(var i = 0; i < results; i++)
				{
					var rand = Math.floor((Math.random() * headlines.length))
					while(choosen.indexOf(rand) != -1)
					{
						rand = Math.floor((Math.random() * headlines.length))
					}
					choosen.push(rand)
					table += headlines[rand]	
				}
				table += '</table>'
				document.getElementById('feed').innerHTML = "<h2>News</h2><hr>" + table;
			}
		});
	}
}

// produces a set of the most recent news
function makeFeedsSorted()
{
	var charLimit = 70
	var urls = getCategoryByName('Feeds').children;
	var results = 10
	var pubsMax = 10

	var headlines = []
	var pubdates = []
	var doneCount = 0
	for(var j = 0; j < urls.length; j++)
	{
		var url = urls[j].link
		feednami.load(url,function(result)
		{
			if(result.error)
			{
				console.log(result.error);
			}
			else
			{
				var entries = result.feed.entries;
				var feed = result.feed.meta.title
				if(feed.includes('–'))
				{
					feed = feed.substr(0, feed.indexOf(' –'))
				}
				for(var i = 0; i < entries.length && i < pubsMax; i++)
				{
					var entry = entries[i];
					var title = entry.title
					var link = entry.link
					var short = title;
					if(title.length > charLimit)
					{
						short = title.substr(0, charLimit) + '...'
					}
					headlines.push("<tr><td><a class=\"rsslink\" title=\"" + title + "\" href=\"" + link + "\">" + short + "</a></td><td>" + feed + "</td></tr>");
					pubdates.push(entry.date_ms)
					//console.log(feed + " " + entry.date_ms)
				}
			}
			doneCount++

			var pubs = urls.length
			if(doneCount == pubs)
			{
				var table = ""
				table += '<table align="center">'
				for(var i = 0; i < results; i++)
				{
					var next = getLatest(pubdates)
					pull(pubdates, next)
					table += pull(headlines, next)	
				}
				table += '</table>'
				document.getElementById('feed').innerHTML = "<h2>News</h2><hr>" + table;
			}
		});
	}
}

// gets the latest date in a list
function getLatest(pubdates)
{
	var newest = 0
	for(var i = 1; i < pubdates.length; i++)
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