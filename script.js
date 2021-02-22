var catObjs = []
var newsNames = []

// initialize page
loadLinks()
setInterval(resetThread, 250)
//setInterval(function() {makeFeeds(getRandom, newsNames[0], 'news1')}, 60000)
//setInterval(function() {makeFeeds(getRandom, newsNames[1], 'news2')}, 60000)
setInterval(loadLinks, 60000)

// populate categories and feeds
function loadLinks() {
	if (load()) {
		// populate
		makeCategories()
		console.log(catObjs)
		console.log(newsNames)
		makeFeeds(getLatest, newsNames[0], 'news1')
		makeFeeds(getLatest, newsNames[1], 'news2')
	}
	else {
		// give error on failure
		document.getElementById('links').innerHTML = 'INVALID CONFIG PROVIDED'
	}
	document.getElementById('edit').href = `/config.html?config=${config}`
	closeAll()
}

// make the categories on screen
function makeCategories() {
	newsNames = []
	let categories = ''
	let links = ''
	let allLinks = ''
	for (i in catObjs) {
		let cat = catObjs[i]
		if (cat.name.charAt(0) != '*') {
			categories += `<div class="button" onmouseover="getCategory('${cat.name}')">${cat.name}</div>`
			if (cat.name != 'All') {
				links += `<div id="${cat.name}-links" class='linkGroup'>`
				for (j in cat.children) {
					let child = cat.children[j]
					let link = `<a class="button" href="${child.link}">${child.name}</a>`
					links += link
					allLinks += link
				}
				links += '</div>'
			}
		}
		else {
			newsNames.push(cat.name)
		}
	}
	links += `<div id="All-links">${allLinks}</div>`
	document.getElementById('categories').innerHTML = categories
	document.getElementById('links').innerHTML = links
	return newsNames
}

// timer based system to determine if links should be removed
var resetTime = -1
function resetLinks() {
	if (resetTime < 0) {
		resetTime = (new Date().getTime()) + 500
	}
}

// set timer to paused value
function pauseTimer() {
	resetTime = -1
}

function closeAll() {
	for (var i in catObjs) {
		let cat = catObjs[i]
		if (cat.name.charAt(0) != '*') {
			document.getElementById(`${cat.name}-links`).style.display = 'none'
		}
	}
}

// restart the timer
function resetThread() {
	if (resetTime > 0 && (new Date().getTime()) > resetTime) {
		closeAll()
	}
}

// produces all links on screen for category
function getCategory(name) {
	closeAll()
	document.getElementById(`${name}-links`).style.display = 'block'
}

// finds a category object with the name of it
function getCategoryByName(name) {
	for (i in catObjs) {
		let cat = catObjs[i]
		if (cat.name == name) {
			return cat
		}
	}
}

// produces a set of the most recent news
function makeFeeds(sortFunction, catName, container) {
	if (typeof catName == 'undefined') {
		return
	}
	let charLimit = 70
	let urls = getCategoryByName(catName).children
	let results = 20
	if (urls.length < 3) {
		// deals with undefined result when there aren't enough results
		results = 14
	}

	let headlines = []
	let pubdates = []
	let doneCount = 0
	for (j in urls) {
		let url = urls[j].link
		feednami.load(url, function (result) {
			if (result.error) {
				console.log(result.error)
			}
			else {
				let entries = result.feed.entries
				let feed = result.feed.meta.title
				if (feed.includes('–')) {
					feed = feed.substr(0, feed.indexOf(' –'))
				}
				for (i = 0; i < entries.length && i < results; i++) {
					let entry = entries[i]
					let title = entry.title
					let short = title
					if (title.length > charLimit) {
						short = title.substr(0, charLimit) + '...'
					}
					headlines.push(`<tr><td style="display: table-cell"><a class="rsslink" title="${title}" href="${entry.link}">${short}</a></td><td>${feed}</td></tr>`)
					pubdates.push(entry.date_ms)
					//console.log(feed + " " + entry.date_ms)
				}
			}
			doneCount++

			let pubs = urls.length
			if (doneCount == pubs) {
				var table = '<table align="center">'
				for (var i = 0; i < results; i++) {
					let next = sortFunction(pubdates)
					table += headlines[next]
					pull(pubdates, next)
					pull(headlines, next)
				}
				table += '</table>'
				document.getElementById(container).innerHTML = `<h2>${removeAsterisk(catName)}</h2><hr>${table}`
			}
		})
	}
}

// removes asterisk from begining of string
function removeAsterisk(str) {
	if (str.charAt(0) == '*') {
		return str.substring(1)
	}
	return str
}

// gets a random article index from list of dates
function getRandom(pubdates) {
	return Math.floor((Math.random() * pubdates.length))
}

// gets the latest date in a list
function getLatest(pubdates) {
	let newest = 0
	for (i in pubdates) {
		if (pubdates[i] > pubdates[newest]) {
			newest = i
		}
	}
	return newest
}

// "pops" the first item from an array given an index
function pull(array, index) {
	let item = array[index]
	array.splice(index, 1)
	return item
}