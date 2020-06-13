const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
let logDir = fs.readFileSync("settings.txt", "utf8" );
const Purchase = require('./purchase.js');
const dbFileName = 'data.db';

if (fs.existsSync(dbFileName)) 
{
    console.log('The path exists.');
}
else
{
   fs.open(dbFileName, 'w', (err) => {
        if(err) 
            throw err;
        console.log('File created');
    });
}
(async () => {
//подключение к БД
    const db = new sqlite3.Database('data.db', sqlite3.OPEN_READWRITE, (err) => {
            err ? console.error(err.message) : console.log('Connected to database.');
        });
    await new Promise((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, dir TEXT NOT NULL, rootpath TEXT NOT NULL, docnumber TEXT NOT NULL, rid TEXT NOT NULL, purchase_id TEXT NOT NULL, object TEXT, price REAL, customer_inn TEXT, customer_name TEXT, facial_acc INTEGER NOT NULL)',
        err => {
            if (err)
                reject(err);
            resolve();
        });
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
                await contract.insertRecord();
            }
        }
    }
//отключение от БД
    db.close((err) => {
        err ? console.error(err.message) : console.log('Database closed.');
    });
})();