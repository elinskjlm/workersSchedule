const Form = require('../../models/form');

module.exports.renderSchedsControl = (req, res) => {
    res.render('schedulesControl')
}

module.exports.renderReadSched = async (req, res) => {
    // TODO access: organizer only
    const formId = req.query.formid || '';
    const scheduleId = req.query.scheduleid || '';
    if (formId && scheduleId) { // TODO think about it , DRY
        return res.render('readSchedule', { weekNum: '', year: '', scheduleId: '' })
    } else if (formId) {
        try { // TEMP TODO permanent
            const form = await Form.findById(formId);
            const { weekNum = '', year = '' } = form; // TODO pass also the names? ugh
            return res.render('readSchedule', { weekNum, year, scheduleId })

        } catch (error) {
            return res.json(error)
        }
    } else if (scheduleId) {
        try {
            const schedule = await Schedule.findById(scheduleId);
            const { weekNum = '', year = '' } = schedule;
            return res.render('readSchedule', { weekNum, year, scheduleId }) // TODO DRY
        } catch (error) {
            return res.json(error)
        }

    } else {
        return res.render('readSchedule', { weekNum: '', year: '', scheduleId: '' })
    }
}