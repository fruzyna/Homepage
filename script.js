var lines;

loadLinks();
status();
setInterval(status, 1000);
setInterval(resetThread, 250);

function loadLinks()
{
	var file = "links";

	var server = new XMLHttpRequest();
	server.open('GET', file);
	server.onreadystatechange = function()
	{
		getCategories(lines = server.responseText.split('\n'));
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
		if(!lines[i].includes(','))
		{
			if(lines[i].length > 0)
			{
				console.log("Found Category: " + lines[i]);
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


//makeFeed('http://feeds.arstechnica.com/arstechnica/index', "left", 5);
//makeFeed('https://www.phoronix.com/rss.php', "middle", 5);
//makeFeed('http://www.androidpolice.com/feed/', "right", 5);

function makeFeed(url, elementName, results) {
	feednami.load(url,function(result){
        if(result.error) {
            console.log(result.error);
        } else {
			var entries = result.feed.entries;
			var output = "<h3>" + result.feed.meta.title + "</h3>";
            for(var i = 0; i < entries.length && i < results; i++){
				var entry = entries[i];
				output += "<a class=\"rsslink\" href=\"" + entry.link + "\">" + entry.title + "</a><br>";
			}
			document.getElementById(elementName).innerHTML = output;
        }
    });
}
