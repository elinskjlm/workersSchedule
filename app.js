const express =     require('express');
const path =        require('path');
const mongoose =    require('mongoose');
const { validateSchedule, validateForm } = require('./middleware');
const formsView =   require('./controllers/views/forms')
const schedsView =  require('./controllers/views/schedules')
const othersView =  require('./controllers/views/others')
const formsAPI =    require('./controllers/api/v1/forms')
const schedsAPI =   require('./controllers/api/v1/schedules')

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

app.get('/',                    formsView.renderWorkerForm)
app.get('/formWorker',          formsView.renderWorkerForm)
app.get('/formWorker/:id',      formsView.renderWorkerForm)

app.get('/formsControl',        formsView.renderFormsControl)

app.get('/schedulesControl',    schedsView.renderSchedsControl)

app.get('/readSchedule',        schedsView.renderReadSched)

app.get('/thankYou',            othersView.renderThankyou)

/* ################## /api/v1/forms ##################### */

app.get('/api/v1/forms',        formsAPI.getAllForms)

app.post('/api/v1/forms', validateForm, formsAPI.createForm)

app.patch('/api/v1/forms/:id',  formsAPI.toggleForm)

app.delete('/api/v1/forms/:id', formsAPI.deleteForm)


/* ############### /api/v1/schedules ################## */

app.get('/api/v1/schedules/getNames',       schedsAPI.getNames)

// app.get('/api/v1/schedules/getWeeks',    schedsAPI.getWeeks)

// app.get('/api/v1/schedules/getYears',    schedsAPI.getYears)

app.get('/api/v1/schedules',                schedsAPI.getAllScheds)

app.post('/api/v1/schedules', validateSchedule, schedsAPI.createSchdule)

app.get('/api/v1/schedules/:id',            schedsAPI.getScheduleById)

app.patch('/api/v1/schedules/:id',          schedsAPI.toggleSchedule)

app.delete('/api/v1/schedules/:id',         schedsAPI.deleteSchedule)

/* ############### -------------- ################## */

app.listen(8080, () => {
    console.log('listeningggg');
})