const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('formWorker')
})

app.get('/formWorker', (req, res) => {
    res.render('formWorker')
})

app.get('/formToggle', (req, res) => {
    res.render('formToggle')
})

app.get('/allForms', (req, res) => {
    res.render('allForms')
})


app.listen(8080, () => {
    console.log('listeningggg');
})