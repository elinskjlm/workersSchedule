const Form = require('../../models/form');
const { dateToWeeknum } = require('../../utils/weekDate')

module.exports.renderWorkerForm = async (req, res) => {
    const id = req.params.id;
    const form = await Form.findById(id)
    let currentYear, currentWeek;
    if (id && form) {
        currentYear = form.year;
        currentWeek = form.weekNum - 1; // TODO
    } else {
        const today = new Date();
        currentYear = today.getFullYear();
        currentWeek = dateToWeeknum(today);
    }
    res.render('formWorker', { currentYear, currentWeek })
}

module.exports.renderFormsControl = (req, res) => {
    res.render('formsControl')
}

module.exports.renderSchedsControl = (req, res) => {
    res.render('schedulesControl')
}
