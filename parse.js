const sqlite3 = require('sqlite3').verbose();

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
let sql = 'SELECT id, dirname from directories';
db.all(sql, [], (err, rows) => {
    if (err)
    {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.id+" "+row.dirname);
    });
});
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