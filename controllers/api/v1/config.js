const config = require('../../../config/default');

module.exports.toggleLiveForm = (req, res) => {
    const state = (req.body.state === 'true' || req.body.state === true);
    config.formLive = state;
    res.send({ formIsLive: state })
}

module.exports.getLiveForm = (req, res) => {
    res.send(config.formLive)
}