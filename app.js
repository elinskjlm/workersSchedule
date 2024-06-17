const express =         require('express');
const path =            require('path');
const mongoose =        require('mongoose');
const Schedule =        require('./models/schedule');
// const methodOverride =  require('method-override');
const dbUrl =           'mongodb://localhost:27017/sidur';

const app = express();

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', () => console.log('DB connected 🔛'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('formWorker')
})

app.get('/formWorker', (req, res) => {
    res.render('formWorker', { weekNum: 23, year: 2025 });
})

app.get('/formToggle', (req, res) => {
    res.render('formToggle')
})

app.get('/allForms', (req, res) => {
    res.render('allForms')
})

app.get('/thankyou', (req, res) => {
    res.render('thankyou')
})

app.post('/thankyou', async (req, res) => {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    return res.json({ redirect: '/thankyou' });
})

app.listen(8080, () => {
    console.log('listeningggg');
})