const express =     require('express');
// const catchAsync =  require('../utils/catchAsync');
const formsView =   require('../controllers/views/forms');
const schedsView =  require('../controllers/views/schedules');
const usersView =   require('../controllers/views/users');
const { isLoggedIn, checkCode } = require('../middleware');
const router = express.Router();

router.get(['/forms/apply', '/forms/apply/:id'], checkCode, formsView.renderWorkerForm);
router.get('/forms/control',     isLoggedIn, formsView.renderFormsControl);

router.get('/schedules/control', isLoggedIn, schedsView.renderSchedsControl);
router.get('/schedules/read',    isLoggedIn, schedsView.renderReadSched);

router.get('/users/login',      usersView.renderLogin);
router.get('/users/control',    isLoggedIn, usersView.renderUsersControl);

module.exports = router;