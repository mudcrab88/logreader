const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
let logDir = fs.readFileSync("settings.txt", "utf8" );
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
//выборка из таблицы с директориями
/*let sql_select = "SELECT id, dirname from directories";
db.all(sql_select, [], (err, rows) => {
    if (err)
    {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.id+" "+row.dirname);
    });
});*/
//чтение каталога и вставка недостающего в базу
//fs.readdir( logDir , function(err, items) {
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
            console.log(doc.getElementsByTagName("number")[0].childNodes[0].nodeValue);
            console.log(doc.getElementsByTagName("RID")[0].childNodes[0].nodeValue);
            let sqlInsert = "INSERT INTO files(name, dir, rootpath) VALUES('"+dirFiles[j]+"','"+items[i]+"','"+logDir+"')";
            db.run(sqlInsert, [], function(err) {
                if (err) 
                {
                    return console.error("Не удалось вставить запись:"+dirFiles[j]+" Ошибка:"+err.message);
                }
                console.log("File "+dirFiles[j]+" inserted");
            });
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