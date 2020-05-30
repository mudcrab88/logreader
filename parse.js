const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
let logDir = fs.readFileSync("settings.txt", "utf8" );
const Purchase = require('./purchase.js');
//подключение к БД
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
//обработка файлов
let items = fs.readdirSync( logDir );
for (let i=0; i<items.length; i++)
{
    if (items[i]>"2020-00-00"&&items[i]<"3000-00-00")
    {
        console.log("Обработка папки "+items[i]);
        dirFiles = fs.readdirSync(logDir+"\\"+items[i]);
        for (let j=0; j<dirFiles.length; j++)
        {
            let fileName = logDir+"\\"+items[i]+"\\"+dirFiles[j];
            let file = fs.readFileSync( fileName, "utf8" );
            let doc = new DOMParser().parseFromString(file, "text/xml");
            let contract = new Purchase(db, doc, dirFiles[j], items[i], logDir);
            contract.insertRecord();
            /*let docNumber = getValueByTagName(doc, "number");
            let rid = doc.getElementsByTagName("RID")[0].childNodes[0].nodeValue;
            let object = doc.getElementsByTagName("object")[0].childNodes[0].nodeValue;
            let purchaseID = doc.getElementsByTagName("purchaseID")[0].childNodes[0].nodeValue;
            let price = doc.getElementsByTagName("price")[0].childNodes[0].nodeValue;
            let customerINN = doc.getElementsByTagName("ns2:inn")[0].childNodes[0].nodeValue;
            let customerName = doc.getElementsByTagName("ns2:fullName")[0].childNodes[0].nodeValue;
            let customerAccCode = doc.getElementsByTagName("ns2:code")[0].childNodes[0].nodeValue;
            let sqlInsert = "INSERT INTO files(name, dir, rootpath, docnumber, rid, purchase_id, object, price, customer_inn, customer_name, facial_acc)"
            +"VALUES('"+dirFiles[j]+"','"+items[i]+"','"+logDir+"','"+docNumber+"','"+rid+"','"+purchaseID+"','"+object+"',"+price
            +",'"+customerINN+"','"+customerName+"',"+customerAccCode+")";
            db.run(sqlInsert, [], function(err) {
                if (err) 
                {
                    return console.error("Не удалось вставить запись:"+dirFiles[j]+" Ошибка:"+err.message);
                }
                console.log("File "+dirFiles[j]+" inserted");
            });*/
        }
    }
}
//});
//отключение от БД
db.close((err) => {
    if (err) 
    {
        console.error(err.message);
    }
    else
    {
        console.log('Close the database connection.');
    }
});