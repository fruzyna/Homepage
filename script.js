var lines;

loadLinks();
status();
setInterval(status, 1000);
setInterval(resetThread, 250);
setInterval(resetThread, 250);
//setInterval(makeFeeds, 15000)
setInterval(makeFeedsSorted, 60000)

function loadLinks()
{
	var file = "links";

	var server = new XMLHttpRequest();
	server.open('GET', file);
	server.onreadystatechange = function()
	{
		getCategories(lines = server.responseText.split('\n'));
		//makeFeeds()
		makeFeedsSorted();
	}
	server.send();
}

function addLinks(category, name, address)
{
	var newLines = new Array(lines.length+1);
	var addedAt = lines.length;
	for(var i = 0; i < lines.length; i++)
	{
		newLines[i] = lines[i];
		if(lines[i] == category)
		{
			newLines[i+1] = name + "," + address;
			console.log("Adding at: " + (i+1));
			addedAt = i;
		}
	}
	for(var i = 1; i < lines.length; i++)
	{
		newLines[addedAt + 2 + i] = lines[addedAt + i];
	}
	printLines(newLines);
	lines = newLines;

}

function printLines(lines)
{
	for(var i = 0; i < lines.length; i++)
	{
		console.log(lines[i]);
	}
}

function getCategories(lines)
{
	var categories = "";
	for(var i = 0; i < lines.length; i++)
	{
		if(!lines[i].includes(',') && lines[i] != 'Feeds')
		{
			if(lines[i].length > 0)
			{
				//console.log("Found Category: " + lines[i]);
				categories += '<div class=\"button\" onmouseover=\"getCategory(\'' + lines[i] + '\')\">' + lines[i] + '</div>';
			}
		}
	}
	document.getElementById('categories').innerHTML = categories;
}

var resetTime = -1;
function resetLinks()
{
	if(resetTime < 0)
	{
		resetTime = (new Date().getTime()) + 500;
	}
}

function pauseTimer()
{
	resetTime = -1;
}

function resetThread()
{
	if(resetTime > 0 && (new Date().getTime()) > resetTime)
	{
		document.getElementById('links').innerHTML = '';
	}
}

function getCategory(category)
{
	var all = category == "All";
	var links = "";
	var inCategory = false;
	for(var i = 0; i < lines.length; i++)
	{
		if(!lines[i].includes(','))
		{
			if(lines[i] == category || all)
			{
				inCategory = true;
			}
			else
			{
				inCategory = false;
			}
		}
		else if(inCategory)
		{
			var parts = lines[i].split(",");
			links += "<a class=\"button\" href=\"" + parts[1] + "\">" + parts[0] + "</a>";
		}
	}
	document.getElementById('links').innerHTML = links;
}

function getCategoryItems(category)
{
	var all = category == "All";
	var links = [];
	var inCategory = false;
	for(var i = 0; i < lines.length; i++)
	{
		if(!lines[i].includes(','))
		{
			if(lines[i] == category || all)
			{
				inCategory = true;
			}
			else
			{
				inCategory = false;
			}
		}
		else if(inCategory)
		{
			links.push(lines[i])
		}
	}
	return links
}

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

function makeFeeds()
{
	var charLimit = 70
	var urls = getCategoryItems('Feeds')
	var results = 10
	var pubsMax = 5

	var headlines = []
	var doneCount = 0
	for(var j = 0; j < urls.length; j++)
	{
		var url = urls[j].split(',')[1]
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
					if(title.length > charLimit)
					{
						title = title.substr(0, charLimit) + '...'
					}
					headlines.push("<tr><td><a class=\"rsslink\" href=\"" + link + "\">" + title + "</a></td><td>" + feed + "</td></tr>");
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
function makeFeedsSorted()
{
	var charLimit = 70
	var urls = getCategoryItems('Feeds')
	var results = 10
	var pubsMax = 10

	var headlines = []
	var pubdates = []
	var doneCount = 0
	for(var j = 0; j < urls.length; j++)
	{
		var url = urls[j].split(',')[1]
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
					if(title.length > charLimit)
					{
						title = title.substr(0, charLimit) + '...'
					}
					headlines.push("<tr><td><a class=\"rsslink\" href=\"" + link + "\">" + title + "</a></td><td>" + feed + "</td></tr>");
					pubdates.push(entry.date_ms)
					console.log(feed + " " + entry.date_ms)
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

function pull(array, index)
{
	var item = array[index]
	array.splice(index, 1)
	return item
}