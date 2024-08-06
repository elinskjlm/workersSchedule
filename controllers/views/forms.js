const Form =                require('../../models/form');
const { dateToWeeknum } =   require('../../utils/weekDate');
const config =              require('../../config/default');

module.exports.renderWorkerForm = async (req, res) => {
    const isLive =  config.formLive;
    const id =      req.params.id;
    const form =    await Form.findById(id)
    let currentYear, currentWeek;
    if (id && form) {
        currentYear = form.year;
        currentWeek = form.weekNum - 1; // TODO
    } else {
        const today = new Date();
        currentYear = today.getFullYear();
        currentWeek = dateToWeeknum(today);
    }
    res.render('forms/formWorker', { isLive, currentYear, currentWeek })
}

module.exports.renderFormsControl = (req, res) => {
    const isLive = config.formLive;
    res.render('forms/formsControl', { isLive, pageTitle: 'ניהול טפסים' })
}
