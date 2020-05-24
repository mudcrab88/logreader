// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    }
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
    const fs = require('fs');
    const sqlite3 = require('sqlite3').verbose();

    let filesTable = document.getElementById("files");
    let customerAccCode = document.getElementById("facial_acc");
    let searchButton = document.getElementById("search");

    let db = new sqlite3.Database('data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) 
        {
            console.error(err.message);
        }
        else
        {
            console.log('Connected to database.');
        }
    });
    let sql_select = "SELECT * FROM files ORDER BY name";
    db.all(sql_select, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }
        rows.forEach((row) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerText = row.name;
            tr.append(td);
            td = document.createElement('td');
            td.innerText = row.docnumber;
            tr.append(td);
            td = document.createElement('td');
            td.innerText = row.facial_acc;
            tr.append(td);
            td = document.createElement('td');
            td.innerText = row.purchase_id;
            tr.append(td);
            filesTable.append(tr);
        });
    });
    searchButton.onclick = function() {
        let begin = "SELECT * FROM files ";
        let where = "";
        let order = " ORDER BY name";
        if (customerAccCode.value != "")
        {
            where = "WHERE facial_acc="+customerAccCode.value;
        }
        let select_query = begin + where + order;
        console.log(select_query);
        filesTable.innerHTML = "";
        db.all(select_query, [], (err, rows) => {
            if (err)
            {
                console.error(err.message);
            }
            rows.forEach((row) => {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerText = row.name;
                tr.append(td);
                td = document.createElement('td');
                td.innerText = row.docnumber;
                tr.append(td);
                td = document.createElement('td');
                td.innerText = row.facial_acc;
                tr.append(td);
                td = document.createElement('td');
                td.innerText = row.purchase_id;
                tr.append(td);
                filesTable.append(tr);
            });
        });
    }
})
