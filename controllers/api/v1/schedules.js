const Schedule = require('../../../models/schedule');
const config =   require('../../../config/default');

module.exports.getNames = async (req, res) => {
    const year =    req.query.year || '';
    const weekNum = req.query.weeknum || '';
    const params = (year && weekNum) ? { weekNum, year } : {};
    const availableNames = await Schedule.find(params, { 'name': 1, '_id': 1 })
    res.json(availableNames)
}

// module.exports.getWeeks = async (req, res) => {
//     const year = req.query.year;
//     if (!year) return res.sendStatus(400) // bad request
//     let availableWeeks = await Schedule.find({ year }, { 'weekNum': 1, '_id': 0 })
//     availableWeeks = availableWeeks.map(item => item.weekNum)
//     availableWeeks = [...new Set(availableWeeks)].sort(function (a, b) { return a - b });
//     res.json(availableWeeks)
// }

// module.exports.getYears = async (req, res) => {
//     let availableYears = await Schedule.find({}, { 'year': 1, '_id': 0 })
//     availableYears = availableYears.map(item => item.year)
//     availableYears = [...new Set(availableYears)].sort(function (a, b) { return a - b });
//     res.json(availableYears)
// }

module.exports.getAllScheds = async (req, res) => {
    const params = {}
    switch (req.query.onlyOpen) {
        case 'on': params.isOpen = true; break;
        case 'off': params.isOpen = false; break;
        default: break;
    }
    switch (req.query.onlyProper) {
        case 'on':  params.isProper = true;  break;
        case 'off': params.isProper = false; break;
        default: break;
    }
    switch (req.query.onlySeen) {
        case 'on':  params.isSeen = true;  break;
        case 'off': params.isSeen = false; break;
        default: break;
    }
    if (req.query.weekNum != 'undefined' && req.query.year != 'undefined') {
        params.weekNum = req.query.weekNum;
        params.year = req.query.year;
    }
    req.query.name ? params.name = req.query.name : '';
    const allSchedules = await Schedule.find(params);
    res.json(allSchedules)
}

module.exports.createSchdule = async (req, res) => {
    if (config.formLive) {
        const newSchedule = new Schedule(req.body);
        await newSchedule.save();
        return res.json({
            success: true,
            redirect: '/thankyou'
        });
    } else {
        return res.json({
            success: false,
            msgHeb: 'הטופס כבוי כרגע.'
        });
    }
}

module.exports.getScheduleById = async (req, res) => {
    const { id } = req.params
    const result = await Schedule.findById(id)
    res.json(result)
}

module.exports.toggleSchedule = async (req, res) => {
    const { id } = req.params;
    const params = {};
    ['on', 'off'].includes(req.body.open) ? params.isOpen = req.body.open === 'on' : '';
    ['on', 'off'].includes(req.body.seen) ? params.isSeen = req.body.seen === 'on' : '';
    ['on', 'off'].includes(req.body.proper) ? params.isProper = req.body.proper === 'on' : '';
    if (params) {
        const schedule = await Schedule.findByIdAndUpdate(id, params, { runValidators: true, new: true });
        return res.json(schedule)
    } else {
        return res.json({ error: 'only "on" or "off"' }) // TODO
    }
}

module.exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    const result = await Schedule.findByIdAndDelete(id)
    res.json(result)
}