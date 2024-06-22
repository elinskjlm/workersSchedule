const express =         require('express');
const path =            require('path');
const mongoose =        require('mongoose');
const Schedule =        require('./models/schedule');
// const methodOverride =  require('method-override');
const dbUrl =           'mongodb://localhost:27017/sidur';

const app = express();

const currentYear = 2024 // TODO dynamic
const currentWeek = 35 // TODO dynamic

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
    res.render('formWorker', { currentYear, currentWeek });
})

app.get('/formToggle', (req, res) => {
    res.render('formToggle')
})

app.get('/allForms', (req, res) => {
    const minYear = 2020;
    const durationYears = 20;
    const weeks = Array(53).fill().map((_, i) => i + 1);
    const years = Array(durationYears).fill().map((_, i) => i + minYear);
    const names = [
        "יעקב כהן",
        "יוסף לוי",
        "דניאל ישראלי",
        "אברהם מזרחי",
        "דוד פרידמן",
        "שמואל ברקוביץ",
        "משה זלצמן",
        "יצחק גרשון",
        "אלי בן-דוד",
        "רוני חיים",
        "עמוס בוזגלו",
        "יואב חזן",
        "איתן רפאלי",
        "אריאל עמר",
        "יואל בלום",
        "עידו שרון",
        "רועי זמיר",
        "ליאור קפלן",
        "נמרוד נחום",
        "אלון יעקובי",
        "נועם גרוסמן",
        "גיא פישר",
        "עמרי שטרן",
        "אורן גרינברג",
        "שחר רוזנבלום",
        "ניצן כהנא",
        "אורי לזר",
        "טל אמיר",
        "יאיר ברוך",
        "ברק יגאל",
        "ישי פלדמן",
        "שמעון דיין",
        "אדם לביא",
        "ליעד שביט",
        "אלירן סולומון",
        "בן מנשה",
        "מתן ברזילי",
        "תומר פוגל",
        "אסף עוזר",
        "עידו וייס",
        "נדב רבין",
        "אלמוג אליהו",
        "דור רון",
        "עופר אלון",
        "עדן ברק",
        "ישי בראל",
        "עידן גולן",
        "רז שפירא",
        "דניאל מור",
        "עמרי דוידי"
      ];
      
    res.render('allForms', { weeks, years ,names, currentYear, currentWeek })
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