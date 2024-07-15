const express =     require('express');
const path =        require('path');
const mongoose =    require('mongoose');
// const { validateSchedule, validateForm } = require('./middleware');
// const formsView =   require('./controllers/views/forms')
// const schedsView =  require('./controllers/views/schedules')
// const formsAPI =    require('./controllers/api/v1/forms')
// const schedsAPI =   require('./controllers/api/v1/schedules')
const apiRoutes =   require('./routes/api')
const viewsRoutes = require('./routes/views')

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

app.use('/', viewsRoutes)

app.get('/thankYou', (req, res) => res.render('thankyou'))

app.use('/api/v1', apiRoutes)

app.all('*', (req, res) => res.redirect('/forms/apply'))

app.listen(8080, () => {
    console.log('listeningggg');
})