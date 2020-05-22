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
            let sqlInsert = "INSERT INTO directories(dirname) VALUES('"+items[i]+"')";
            db.run(sqlInsert, [], function(err) {
                console.log("Обработка папки "+items[i]);
                if (err) 
                {
                    return console.error("Не удалось вставить запись:"+err.message);
                }
                console.log("Directory "+items[i]+" inserted");
            });
            dirFiles = fs.readdirSync(logDir+"\\"+items[i]);
            for (let j=0; j<dirFiles.length; j++)
            {
                fs.readFileSync(logDir+"\\"+items[i]+"\\"+dirFiles[i], "utf8" );
                console.log(dirFiles[i]);
            }
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