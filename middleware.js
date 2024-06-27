const { scheduleSchema } = require('./schemas')

module.exports.validateSchema = (req, res, next) => {
    console.log(req.body);
    const { error } = scheduleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new Error(msg, 400)
    } else {
        next();
    }
}