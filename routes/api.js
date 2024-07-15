const express = require('express');
const { validateSchedule, validateForm } = require('../middleware');
const formsAPI = require('../controllers/api/v1/forms')
const schedsAPI = require('../controllers/api/v1/schedules')
const router = express.Router();

router.route('/forms/:id')
    .patch(formsAPI.toggleForm)
    .delete(formsAPI.deleteForm);

router.route('/forms')
    .get(formsAPI.getAllForms)
    .post(validateForm, formsAPI.createForm);


router.get('/schedules/getNames', schedsAPI.getNames)
// router.get('/schedules/getWeeks', schedsAPI.getWeeks)
// router.get('/schedules/getYears', schedsAPI.getYears)

router.route('/schedules/:id')
    .get(schedsAPI.getScheduleById)
    .patch(schedsAPI.toggleSchedule)
    .delete(schedsAPI.deleteSchedule);

router.route('/schedules')
    .get(schedsAPI.getAllScheds)
    .post(validateSchedule, schedsAPI.createSchdule);

module.exports = router;