const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Article = require('./db').Article;
const read = require('node-readability');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/articles', (req, res, next) => {
    Article.all((err, articles) => { //Получает все статьи.
        if (err)
            return next(err); 
        res.send(articles);
    });
});

app.post('/articles', (req, res, next) => {
    const url = req.body.url; // Получает URL из тела POST.
    read(url, (err, result) => { //Использует режим удобочитаемости от выборки URL.
        if (err || !result)
        res.status(500).send('Error downloading article'); 
        Article.create({ title: result.title, content: result.content },(err, article) => {
            if (err) return next(err);
            res.send('OK'); // После сохранения статьи возвращает код 200.
        });
    });
});

app.get('/articles/:id', (req, res, next) => { 
    const id = req.params.id;
    Article.find(id, (err, article) => { //Находит конкретную статью.
        if (err) return next(err);
        res.send(article);
    });
});

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.delete(id, (err) => {//Удаляет статью.
        if (err) return next(err);
        res.send({ message: 'Deleted' });
    });
});

app.listen(app.get('port'), () => {
    console.log('App started on port', app.get('port'));
});

module.exports = app;