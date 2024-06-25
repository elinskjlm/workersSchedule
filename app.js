const express =         require('express');
const path =            require('path');
const mongoose =        require('mongoose');
const Schedule =        require('./models/schedule');
const schedule =        require('./models/schedule');
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
    res.redirect('/formWorker')
})

app.get('/formWorker', (req, res) => {
    // TODO access: users only?
    res.render('formWorker', { currentYear, currentWeek });
})

app.get('/formToggle', (req, res) => {
    // TODO access: organizer only
    res.render('formToggle')
})

app.get('/allForms', (req, res) => {
    // TODO access: organizer only
    const minYear = 2020;
    const durationYears = 20;
    const weeks = Array(53).fill().map((_, i) => i + 1);
    const years = Array(durationYears).fill().map((_, i) => i + minYear);

    res.render('allForms', { weeks, years, currentYear, currentWeek })
})

app.get('/thankyou', (req, res) => {
    res.render('thankyou')
})

app.get('/api/names', async (req, res) => {
    // TODO access: organizer only
    const year = req.query.year;
    const weekNum = req.query.weeknum;
    if (!year || !weekNum) return res.sendStatus(400) // bad request
    const availableNames = await Schedule.find({weekNum, year}, {'name': 1, '_id': 1})
    res.send(availableNames)
})

app.get('/api/schedules', async (req, res) => {
    // TODO access: organizer only
    const allSchedules = await Schedule.find({})
    res.send(allSchedules)
})

app.post('/api/schedules', async (req, res) => {
    // TODO access: users only?
    // TODO add validation!!
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    return res.json({ redirect: '/thankyou' });
})

app.get/*OLD*/('/api/schedules/byName', async (req, res) => {
    // TODO access: organizer only
    const { year, weekNum, name } = req.query
    const result = await Schedule.find({
        year,
        weekNum,
    })
    for (let schedule of result) { 
        console.log(schedule.name, name)
        if (schedule.name == name) {
            // return res.send(schedule)
        } else {
            // return res.send('I AM A BIG LOSER')
        }
    }
    return res.send('FUCK THIS RTL PROBLEMS !!')
})

app.get('/api/schedules/:id', async (req, res) => {
    // TODO access: organizer only
    const { id } = req.params
    const result = await Schedule.findById(id)
    res.send(result)
})

app.patch('/api/schedules/:id', async (req, res) => {
    // TODO access: organizer only
    // TODO add validation!!
    res.send('PATCH /api/schedules/:id'); // TODO
})

app.delete('/api/schedules/:id', async (req, res) => {
    // TODO access: admin only
    res.send('DELETE /api/schedules/:id'); // TODO
})

app.listen(8080, () => {
    console.log('listeningggg');
})