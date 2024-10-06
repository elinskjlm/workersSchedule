const generator =   require('generate-password');
const config =      require('../../../config/default');
const Code =        require('../../../models/code');

module.exports.toggleLiveForm = (req, res) => {
    const state = (req.body.state === 'true' || req.body.state === true);
    config.formLive = state;
    res.send({ formIsLive: state });
}

module.exports.getLiveForm = (req, res) => {
    res.send(config.formLive);
}

module.exports.getCodes = async (req, res) => {
    const allCodes = await Code.find({}, { '_id': false, '__v': false });
    const asArray = allCodes.map(item => item.accessCode)
    const asObj = { codes: asArray }
    res.json(asObj);
}

module.exports.deleteCode = async (req, res) => {
    const { code } = req.params;
    const result = await Code.findOneAndDelete({ accessCode: code });
    res.json(Boolean(result.accessCode));
}

// module.exports.deleteAllCodes = async (req, res) => {
//     const result = await Code.deleteMany();
//     res.json(result);
// }

module.exports.createCode = async (req, res) => {
    const newCode = generator.generate({
        length: 6,
        numbers: true,
    })
    const result = await new Code({ accessCode: newCode });
    await result.save();
    res.json(result.accessCode);
}