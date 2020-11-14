var catObjs = []

loadLinks()

/** TODO
 *  Clense inputs
 *  Reorder categories/links
 */

// populate config table
function loadLinks()
{
    load()
    makeCategories()
    document.getElementById('view').href = `/index.html?config=${config}`
}

// make the categories on screen
function makeCategories()
{
    // create table header
    let table = '<tr><td><b>Categories</b></td><td><b>Link Names</b></td><td><b>Links</b></td></tr>'
	for (i in catObjs)
	{
		let cat = catObjs[i]
        table += `<tr>
                  <td><input type="text" id="${cat.name}" value="${cat.name}" size="15"></td>
                  <td><form action="#" onsubmit="return updateCategory('${cat.name}')"><input type="submit" value="Update"></form></td>
                  </tr>`

        for (j in cat.children)
        {
            let link = cat.children[j]

            // add link to row
            table += `<tr><td></td>
                      <td><input type="text" id="${cat.name}-${j}-name" value="${link.name}" size="15"></td>
                      <td><input type="text" id="${cat.name}-${j}-link" value="${link.link}" size="45"></td>
                      <td><form action="#" onsubmit="return updateLink('${cat.name}', '${j}')"><input type="submit" value="Update"></form></td>
                      </tr>`
        }

        // row to add a new link
        table += `<tr><td></td>
                  <td><input type="text" id="${cat.name}--name" value="New Link" size="15"></td>
                  <td><input type="text" id="${cat.name}--link" value="https://" size="45"></td>
                  <td><form action="#" onsubmit="return updateLink('${cat.name}', '')"><input type="submit" value="Add"></form></td>
                  </tr>`
	}

    // row to add a new category
    table += `<tr>
              <td><input type="text" id="newcat" value="New Category" size="15"></td>
              <td><form action="#" onsubmit="return updateCategory('newcat')"><input type="submit" value="Create"></form></td>
              </tr>`

	document.getElementById('config-table').innerHTML = table
}

// edit a link at a given index in a category
function updateLink(category, idx)
{
    // get the new link name
    let newName = document.getElementById(`${category}-${idx}-${name}`).value
    let newLink = document.getElementById(`${category}-${idx}-${link}`).value

    // find the category
    for (i in catObjs)
    {
        let cat = catObjs[i]
        if (cat.name == category)
        {
            if (idx == '' && newName && newLink)
            {
                // if no name, create a new link
                let child = {name: newName, link: newLink}
                cat.children.push(child)
            }
            else
            {
                let j = parseInt(idx)
                if (newName && newLink)
                {
                    // edit the link
                    catObjs[i].children[j].name = newName
                    catObjs[i].children[j].link = newLink
                }
                else
                {
                    // remove it if no name or link
                    catObjs[i].children.splice(j, 1)
                }
            }
            break
        }
    }

    // save and update screen
    writeConfig(config, catObjs)
    loadLinks()
    return true
}

// update a given category
function updateCategory(category)
{
    let name = document.getElementById(category).value

    if (category != 'newcat')
    {
        // find the category
        for (i in catObjs)
        {
            let cat = catObjs[i]
            if (cat.name == category)
            {
                if (name)
                {
                    // rename it
                    cat.name = name
                }
                else
                {
                    // remove it if no name
                    catObjs.splice(i, 1)
                }
            }
        }
    }
    else
    {
        // add the new category
        catObjs.push({name: name, children: []})
    }

    // save and update screen
    writeConfig(config, catObjs)
    loadLinks()
    return true
}

// download current config to file
function backup()
{
    let content = writeConfig(config, catObjs);
    let dl = document.createElement('a');
    dl.href = `data:text/plain,${encodeURIComponent(content)}`;
    dl.click();
}