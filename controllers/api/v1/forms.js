const Form = require('../../../models/form');

module.exports.getAllForms = async (req, res) => {
    const params = {}
    // if (req.query.status === 'on') {
    //     params.isLive = true;
    // } else if (req.query.status === 'off') {
    //     params.isLive = false;
    // }
    switch (req.query.status) {
        case 'on': params.isLive = true; break;
        case 'off': params.isLive = false; break;
        default: break;
    }
    const allForms = await Form.find(params)
    res.json(allForms)
}

module.exports.createForm = async (req, res) => {
    // TODO access: organizer only
    const newForm = new Form(req.body);
    await newForm.save();
    res.json(newForm);
}

module.exports.toggleForm = async (req, res) => {
    // // TODO access: organizer only // TODO DRY
    const { id } = req.params;
    if (['on', 'off'].includes(req.body.status)) {
        const isLive = req.body.status === 'on' ? true : false;
        const form = await Form.findByIdAndUpdate(id, { isLive }, { runValidators: true, new: true });
        return res.json(form)
    } else {
        return res.json({ error: 'only "on" or "off"' }) // TODO
    }
}

module.exports.deleteForm = async (req, res) => {
    const { id } = req.params;
    const result = await Form.findByIdAndDelete(id)
    res.json(result)
}