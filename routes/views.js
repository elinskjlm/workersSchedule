const express =     require('express');
const formsView =   require('../controllers/views/forms')
const schedsView =  require('../controllers/views/schedules')
const router =      express.Router();

router.get(['/forms/apply', '/forms/apply/:id'], formsView.renderWorkerForm)
// router.get('/forms/apply/:id',  formsView.renderWorkerForm)

router.get('/forms/control', formsView.renderFormsControl)

router.get('/schedules/control', schedsView.renderSchedsControl)

router.get('/schedules/read', schedsView.renderReadSched)

module.exports = router;