if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express =         require('express');
const path =            require('path');
const mongoose =        require('mongoose');
const MongoStore =      require('connect-mongo');
const session =         require('express-session');
const ejsMate =         require('ejs-mate');
const passport =        require('passport');
const LocalStrategy =   require('passport-local');
const mongoSanitize =   require('express-mongo-sanitize');
const helmet =          require('helmet');
const apiRoutes =       require('./routes/api');
const viewsRoutes =     require('./routes/views');
const User =            require('./models/user');
const ExpressError =    require('./utils/ExpressError');
const port =            process.env.PORT;
const dbUrl =           process.env.DB_URL || 'mongodb://localhost:27017/sidur';
const secret =          process.env.SECRET || 'nvtmvRIMVm1';

const app = express();

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', () => console.log('DB connected 🔛'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // seconds
})

store.on('error', function(e) {
  console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    name: 'session',
    secret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // miliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7 // miliseconds
    }
}
app.use(session(sessionConfig))

app.use(mongoSanitize());
// app.use(mongoSanitize({
//     replaceWith: '_',
// }));

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://code.jquery.com/",
];

const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
];

const connectSrcUrls = [];

const fontSrcUrls = [];

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:   [],
          connectSrc:   ["'self'", ...connectSrcUrls],
          fontSrc:      ["'self'", ...fontSrcUrls],
          scriptSrc:    ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
          styleSrc:     ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc:    ["'self'", "blob:"],
          objectSrc:    [],
          imgSrc:       [
            "'self'",
            "blob:",
            "data:",
          ]
        },
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session()); // Must be after `app.use(session(sessionConfig))`
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // TEMP
    console.log('┌───────────────────────────');
    console.log('│', req.user?.username);
    console.log('│', req.method, req.originalUrl);
    console.log('└───────────────────────────');
    next();
})

app.use('/', viewsRoutes)

app.get('/', (req, res) => res.redirect('/users/login'))
app.get('/thankYou', (req, res) => res.render('thankyou'))

app.use('/api/v1', apiRoutes)

app.all('*' , (req, res, next) => {
  next(new ExpressError(`Page not found: ${req.url}`, 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Unkown Error';
  console.log(`⚠️ ${err}`);
  res.status(statusCode).render(`error`, { err });
})

app.listen(port, () => {
    console.log('listening on', port);
})
