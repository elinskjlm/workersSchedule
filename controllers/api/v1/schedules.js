const Schedule = require('../../../models/schedule');

module.exports.getNames = async (req, res) => {
    const year = req.query.year;
    const weekNum = req.query.weeknum;
    if (!year || !weekNum) return res.sendStatus(400) // bad request
    const availableNames = await Schedule.find({ weekNum, year }, { 'name': 1, '_id': 1 })
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
    // switch (req.query.onlyPermanent) { /* For future use */
    //     case 'on':  params.isPermanent = true;  break;
    //     case 'off': params.isPermanent = false; break;
    //     default: break;
    // }
    if (req.query.weekNum != 'undefined' && req.query.year != 'undefined') {
        params.weekNum = req.query.weekNum;
        params.year = req.query.year;
    }
    const allSchedules = await Schedule.find(params);
    res.json(allSchedules)
}

module.exports.createSchdule = async (req, res) => {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    return res.json({ redirect: '/thankyou' });
}

module.exports.getScheduleById = async (req, res) => {
    const { id } = req.params
    const result = await Schedule.findById(id)
    res.json(result)
}

module.exports.toggleSchedule = async (req, res) => {
    // TODO access: organizer only
    // TODO add validation!!
    const { id } = req.params;
    if (['on', 'off'].includes(req.body.open)) {
        const isOpen = req.body.open === 'on' ? true : false;
        const schedule = await Schedule.findByIdAndUpdate(id, { isOpen }, { runValidators: true, new: true });
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