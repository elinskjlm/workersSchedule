const express =     require('express');
// const catchAsync =  require('../utils/catchAsync');
const formsView =   require('../controllers/views/forms');
const schedsView =  require('../controllers/views/schedules');
const usersView =   require('../controllers/views/users');
const { isLoggedIn } = require('../middleware');
const router = express.Router();

router.get(['/forms/apply', '/forms/apply/:id'], formsView.renderWorkerForm);
// router.get('/forms/apply/:id',  formsView.renderWorkerForm);

router.get('/forms/control',     isLoggedIn, formsView.renderFormsControl);

router.get('/schedules/control', isLoggedIn, schedsView.renderSchedsControl);

router.get('/schedules/read',    isLoggedIn, schedsView.renderReadSched);

router.get('/users/login',                   usersView.renderLogin);
router.get('/users/register',    isLoggedIn, usersView.renderRegister);
router.get('/users/control',     isLoggedIn, usersView.renderUsersControl);

// router.post('/users/login', catchAsync(usersView.loginUser));
// router.post('/users/register', catchAsync(usersView.registerUser));


module.exports = router;