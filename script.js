var lines = ["News",
"Phoronix,http://phoronix.com",
"Android Police,http://androidpolice.com",
"Ars Technica,http://arstechnica.com",
"Forums",
"LinusTechTips,http://linustechtips.com",
"LevelOneTechs,http://forum.level1techs.com",
"Media",
"YouTube,http://youtube.com/feed/subscriptions",
"GP Music,http://music.google.com",
"Utils",
"Lister,http://lister.mail929.com/webapp",
"School",
"Wiley,http://wileyplus.com",
"PLangs,http://www.mscs.mu.edu/~mikes/cosc3410/",
"Databases,http://www.mscs.mu.edu/~praveen/Teaching/Fa17/Db/Db-Fa17.html",
"D2L,http://d2l.mu.edu",
"CheckMarq,http://checkmarq.mu.edu",
"Office 365,http://office.mu.edu",
"Work",
"Clock,http://empcenter.mu.edu/workforce/Desktop.do",
"Spiceworks,http://coe-helpdesk.marqnet.mu.edu/"];

getCategories();

function getCategories()
{
	var categories = "";
	for(var i = 0; i < lines.length; i++)
	{
		if(!lines[i].includes(','))
		{
			console.log("Found Category: " + lines[i]);
			categories += '<div class=\"button\" onmouseover=\"getCategory(\'' + lines[i] + '\')\">' + lines[i] + '</div>';
		}
	}
	document.getElementById('categories').innerHTML = categories;
}

function getCategory(category)
{
	var links = "";
	var inCategory = false;
	for(var i = 0; i < lines.length; i++)
	{
		if(!lines[i].includes(','))
		{
			if(lines[i] == category)
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