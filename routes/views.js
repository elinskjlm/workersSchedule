const express =     require('express');
const catchAsync =  require('../utils/catchAsync')
const formsView =   require('../controllers/views/forms')
const schedsView =  require('../controllers/views/schedules')
const router =      express.Router();

router.get(['/forms/apply', '/forms/apply/:id'], catchAsync(formsView.renderWorkerForm));
// router.get('/forms/apply/:id',  catchAsync(formsView.renderWorkerForm));

router.get('/forms/control', catchAsync(formsView.renderFormsControl));

router.get('/schedules/control', catchAsync(schedsView.renderSchedsControl));

router.get('/schedules/read', catchAsync(schedsView.renderReadSched));

module.exports = router;