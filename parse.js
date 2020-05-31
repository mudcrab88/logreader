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
for (const dir of items)
{
    if (dir>"2020-00-00"&&dir<"3000-00-00")
    {
        console.log("Обработка папки "+dir);
        dirFiles = fs.readdirSync(logDir+"\\"+dir);
        for (const dirFile of dirFiles)
        {
            let fileName = logDir+"\\"+dir+"\\"+dirFile;
            let file = fs.readFileSync( fileName, "utf8" );
            let doc = new DOMParser().parseFromString(file, "text/xml");
            let contract = new Purchase(db, doc, dirFile, dir, logDir);
            contract.insertRecord();
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