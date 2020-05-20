const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
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
fs.readdir( logDir , function(err, items) {
    for (let i=0; i<items.length; i++)
    {
        if (items[i]>"2020-00-00"&&items[i]<"3000-00-00")
        {
            let sql_insert = "INSERT INTO directories(dirname) VALUES('"+items[i]+"')";
            db.run(sql_insert, [], function(err) {
                console.log("Обработка папки "+items[i]);
                if (err) 
                {
                    return console.error("Не удалось вставить запись:"+err.message);
                }
                console.log("Directory "+items[i]+" inserted");
            });
        }
    }
});
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