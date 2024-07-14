const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const Form = require('./models/form');
const { validateSchema, validateForm } = require('./middleware');
const { dateToWeeknum } = require('./utils/weekDate')

const dbUrl = 'mongodb://localhost:27017/sidur';
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

/* ##################### / ######################### */


app.get('/', (req, res) => {
    res.redirect('/formWorker')
})

app.get('/formsControl', (req, res) => {
    // TODO access: organizer only
    res.render('formsControl');
})

app.get('/schedulesControl', (req, res) => {
    // TODO access: organizer only
    res.render('schedulesControl');
})

app.get('/formWorker', (req, res) => {
    // TODO access: users only?
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = dateToWeeknum(today);
    res.render('formWorker', { currentYear, currentWeek });
})

app.get('/formWorker/:id', async (req, res) => {
    // TODO access: users only?
    const id = req.params.id;
    const form = await Form.findById(id)
    if (form) {
        const currentYear = form.year;
        const currentWeek = form.weekNum - 1; // TODO
        res.render('formWorker', { currentYear, currentWeek });
    } else {
        return res.redirect('/formWorker')
    }
    // const today = new Date();
    // const currentYear = today.getFullYear();
    // const currentWeek = dateToWeeknum(today);
    // res.render('formWorker', { currentYear, currentWeek });
})

app.get('/readSchedule', async (req, res) => {
    // TODO access: organizer only
    const formId = req.query.formid || '';
    const scheduleId = req.query.scheduleid || '';
    if (formId && scheduleId) { // TODO think about it , DRY
        return res.render('readSchedule', { weekNum: '', year: '', scheduleId: '' })
    } else if (formId) {
        try { // TEMP TODO permanent
            const form = await Form.findById(formId);
            const { weekNum = '', year = '' } = form; // TODO pass also the names? ugh
            return res.render('readSchedule', { weekNum, year, scheduleId })

        } catch (error) {
            return res.json(error)
        }
    } else if (scheduleId) {
        try {
            const schedule = await Schedule.findById(scheduleId);
            const { weekNum = '', year = '' } = schedule;
            return res.render('readSchedule', { weekNum, year, scheduleId }) // TODO DRY
        } catch (error) {
            return res.json(error)
        }

    } else {
        return res.render('readSchedule', { weekNum: '', year: '', scheduleId: '' })
    }
})

// app.get('/readSchedule/:id', async (req, res) => {
//     // TODO access: organizer only
//     const id = req.params.id;
//     const form = await Form.findById(id);
//     console.log(form)
//     const { weekNum, year } = form;
//     res.render('readSchedule', { weekNum, year })
// })

app.get('/thankYou', (req, res) => {
    res.render('thankyou')
})

/* ################## /api/forms ##################### */

app.get('/api/forms', async (req, res) => {
    const params = {}
    // if (req.query.status === 'on') {
    //     params.isLive = true;
    // } else if (req.query.status === 'off') {
    //     params.isLive = false;
    // }
    switch (req.query.status) {
        case 'on': params.isLive = true; break;
        case 'off': params.isLive = false; break;
        default: break;
    }
    const allForms = await Form.find(params)
    res.json(allForms)
})

app.post('/api/forms', validateForm, async (req, res) => {
    // TODO access: organizer only
    const newForm = new Form(req.body);
    await newForm.save();
    res.json(newForm);
})

app.patch('/api/forms/:id', async (req, res) => {
    // // TODO access: organizer only // TODO DRY
    const { id } = req.params;
    if (['on', 'off'].includes(req.body.status)) {
        const isLive = req.body.status === 'on' ? true : false;
        const form = await Form.findByIdAndUpdate(id, { isLive }, { runValidators: true, new: true });
        return res.json(form)
    } else {
        return res.json({ error: 'only "on" or "off"' }) // TODO
    }
})

app.delete('/api/forms/:id', async (req, res) => {
    const { id } = req.params;
    const result = await Form.findByIdAndDelete(id)
    res.json(result)
})


/* ############### /api/schedules ################## */

app.get('/api/schedules/getNames', async (req, res) => {
    // TODO access: organizer only
    const year = req.query.year;
    const weekNum = req.query.weeknum;
    if (!year || !weekNum) return res.sendStatus(400) // bad request
    const availableNames = await Schedule.find({ weekNum, year }, { 'name': 1, '_id': 1 })
    res.json(availableNames)
})

app.get('/api/schedules/getWeeks', async (req, res) => {
    // TODO access: organizer only
    const year = req.query.year;
    if (!year) return res.sendStatus(400) // bad request
    let availableWeeks = await Schedule.find({ year }, { 'weekNum': 1, '_id': 0 })
    availableWeeks = availableWeeks.map(item => item.weekNum)
    availableWeeks = [...new Set(availableWeeks)].sort(function (a, b) { return a - b });
    res.json(availableWeeks)
})

app.get('/api/schedules/getYears', async (req, res) => {
    // TODO access: organizer only
    let availableYears = await Schedule.find({}, { 'year': 1, '_id': 0 })
    availableYears = availableYears.map(item => item.year)
    availableYears = [...new Set(availableYears)].sort(function (a, b) { return a - b });
    res.json(availableYears)
})

app.get('/api/schedules', async (req, res) => {
    // TODO access: organizer only
    const params = {}
    switch (req.query.onlyOpen) {
        case 'on': params.isOpen = true; break;
        case 'off': params.isOpen = false; break;
        default: break;
    }
    // switch (req.query.onlyPermanent) { /* For future use */
    //     case 'on':  params.isPermanent = true;  break;
    //     case 'off': params.isPermanent = false; break;
    //     default: break;
    // }
    if (req.query.weekNum != 'undefined' && req.query.year != 'undefined') {
        params.weekNum = req.query.weekNum;
        params.year = req.query.year;
    }
    const allSchedules = await Schedule.find(params);
    res.json(allSchedules)
})

app.post('/api/schedules', validateSchema, async (req, res) => {
    // TODO access: users only?
    // TODO add validation!!
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    return res.json({ redirect: '/thankyou' });
})

app.get('/api/schedules/:id', async (req, res) => {
    // TODO access: organizer only
    const { id } = req.params
    const result = await Schedule.findById(id)
    res.json(result)
})

app.patch('/api/schedules/:id', async (req, res) => {
    // TODO access: organizer only
    // TODO add validation!!
    const { id } = req.params;
    if (['on', 'off'].includes(req.body.open)) {
        const isOpen = req.body.open === 'on' ? true : false;
        const schedule = await Schedule.findByIdAndUpdate(id, { isOpen }, { runValidators: true, new: true });
        return res.json(schedule)
    } else {
        return res.json({ error: 'only "on" or "off"' }) // TODO
    }
})

app.delete('/api/schedules/:id', async (req, res) => {
    const { id } = req.params;
    const result = await Schedule.findByIdAndDelete(id)
    res.json(result)
})

/* ############### -------------- ################## */

app.listen(8080, () => {
    console.log('listeningggg');
})