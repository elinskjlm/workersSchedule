const express =     require('express');
const { validateSchedule, validateForm, isLoggedIn } = require('../middleware');
const catchAsync =  require('../utils/catchAsync')
const formsAPI =    require('../controllers/api/v1/forms')
const schedsAPI =   require('../controllers/api/v1/schedules')
const usersAPI =    require('../controllers/api/v1/users')
const router =      express.Router();

router.route('/forms/:id')
    .patch(isLoggedIn,  catchAsync(formsAPI.toggleForm))
    .delete(isLoggedIn, catchAsync(formsAPI.deleteForm));

router.route('/forms')
    .get(isLoggedIn, catchAsync(formsAPI.getAllForms))
    .post(isLoggedIn, validateForm, formsAPI.createForm); // How come no catchAsync TODO check

router.route('/schedules')
    .get(isLoggedIn, /*catchAsync(*/schedsAPI.getAllScheds/*)*/)
    .post(isLoggedIn, /*catchAsync(*/validateSchedule, schedsAPI.createSchdule/*)*/);

router.get('/schedules/getNames', isLoggedIn, catchAsync(schedsAPI.getNames));
// router.get('/schedules/getWeeks', catchAsync(schedsAPI.getWeeks));
// router.get('/schedules/getYears', catchAsync(schedsAPI.getYears));

router.route('/schedules/:id')
    .get(isLoggedIn,    catchAsync(schedsAPI.getScheduleById))
    .patch(isLoggedIn,  catchAsync(schedsAPI.toggleSchedule))
    .delete(isLoggedIn, catchAsync(schedsAPI.deleteSchedule));

router.route('/users')
    .get(isLoggedIn,    catchAsync(usersAPI.getAllUsers))
    .post(isLoggedIn,   catchAsync(usersAPI.createUser));

router.post('/users/login',     catchAsync(usersAPI.loginUser));
router.get('/users/logout',     catchAsync(usersAPI.logoutUser));
router.post('/users/register', isLoggedIn,  catchAsync(usersAPI.createUser));

router.route('/users/:id')
    .get(isLoggedIn,    catchAsync(usersAPI.readUser))
    .patch(isLoggedIn,  catchAsync(usersAPI.updateUser))
    .delete(isLoggedIn, catchAsync(usersAPI.deleteUser))

module.exports = router;