// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  const fs = require('fs');
  fs.readdir("./data", function(err, items) {
    const dirs = document.getElementById("directories");
    let ul = document.createElement('ul');
    for (let i=0; i<items.length; i++) {
        let li = document.createElement('li');
        li.innerText = items[i];
        ul.append(li);
    }
    dirs.append(ul);
  });
})
