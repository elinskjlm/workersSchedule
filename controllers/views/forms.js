const Form =   require('../../models/form');
const config = require('../../config/default');
const { nextWeeknum, nextWeekYear } = require('../../utils/weekDate');

module.exports.renderWorkerForm = async (req, res) => {
    const isLive =  config.formLive;
    const id =      req.params.id;
    const form =    await Form.findById(id)
    let formYear, formWeek;
    if (id && form) {
        formYear = form.year;
        formWeek = form.weekNum;
    } else {
        formYear = nextWeekYear;
        formWeek = nextWeeknum;
    }
    res.render('forms/formWorker', { isLive, formYear, formWeek })
}

module.exports.renderFormsControl = (req, res) => {
    const isLive = config.formLive;
    res.render('forms/formsControl', { isLive, pageTitle: 'ניהול טפסים' })
}
