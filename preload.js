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
    let purchaseId = document.getElementById("purchase_id");
    let rid = document.getElementById("rid");
    let resultMessage = document.getElementById("resultMessage");
    let date = document.getElementById("date");

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
    let sql_select = "SELECT * FROM files ORDER BY name DESC LIMIT 100";
    db.all(sql_select, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }
        else
        {
            createTable(rows);
        }
    });
    searchButton.onclick = function() {
        let begin = "SELECT * FROM files ";
        let where = "";
        let and = "";
        let order = " ORDER BY name";
        if (customerAccCode.value != "")
        {
            where = "WHERE facial_acc="+customerAccCode.value;
        }
        else
        {
            where = "WHERE (1=1)";
        }
        if (purchaseId.value != "")
        {
            and = " AND purchase_id LIKE '%"+purchaseId.value+"%' ";
        }
        if (rid.value != "")
        {
            and = " AND rid LIKE '%"+rid.value+"%' ";
        }
        if (date.value != "")
        {
            and = " AND name LIKE '"+date.value+"%' ";
        }
        let select_query = begin + where + and + order;
        filesTable.innerHTML = "";
        db.all(select_query, [], (err, rows) => {
            if (err)
            {
                console.error(err.message);
                resultMessage.innerHTML = "ОШИБКА: "+ err.message;
            }
            else
            {
                createTable(rows);
                resultMessage.innerHTML = "Количество найденных записей: " + rows.length;
            }
        });
    }

    function createTable(rows)
    {
        rows.forEach((row) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            let a = document.createElement('a');
            a.href= row.rootpath +"\\"+row.dir+"\\"+row.name;
            a.innerText = row.name;
            a.target="_blank";
            td.append(a);
            tr.append(td);
            td = document.createElement('td');
            td.innerText = "№: " + row.docnumber + "\nЦена: " + row.price.toFixed(2)+ "\nОбъект:" + row.object;
            tr.append(td);
            td = document.createElement('td');
            td.innerText = "Л/с: "+row.facial_acc + "\nЗаказчик: " + row.customer_name;
            tr.append(td);
            td = document.createElement('td');
            td.innerText = "ИКЗ: " + row.purchase_id + "\nRID:" + row.rid;
            tr.append(td);
            filesTable.append(tr);
        });
    }
})
