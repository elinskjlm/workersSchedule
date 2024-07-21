const express =     require('express');
const { validateSchedule, validateForm } = require('../middleware');
const catchAsync =  require('../utils/catchAsync')
const formsAPI =    require('../controllers/api/v1/forms')
const schedsAPI =   require('../controllers/api/v1/schedules')
const router =      express.Router();

router.route('/forms/:id')
    .patch(catchAsync(formsAPI.toggleForm))
    .delete(catchAsync(formsAPI.deleteForm));

router.route('/forms')
    .get(catchAsync(formsAPI.getAllForms))
    .post(validateForm, formsAPI.createForm);


router.get('/schedules/getNames', catchAsync(schedsAPI.getNames));
// router.get('/schedules/getWeeks', catchAsync(schedsAPI.getWeeks));
// router.get('/schedules/getYears', catchAsync(schedsAPI.getYears));

router.route('/schedules/:id')
    .get(catchAsync(schedsAPI.getScheduleById))
    .patch(catchAsync(schedsAPI.toggleSchedule))
    .delete(catchAsync(schedsAPI.deleteSchedule));

router.route('/schedules')
    .get(/*catchAsync(*/schedsAPI.getAllScheds/*)*/)
    .post(/*catchAsync(*/validateSchedule, schedsAPI.createSchdule/*)*/);

module.exports = router;