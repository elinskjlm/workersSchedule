const { scheduleSchema, formSchema } = require('./schemas')

module.exports.validateSchedule = (req, res, next) => {
    const { error } = scheduleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new Error(msg, 400)
    } else {
        next();
    }
}

module.exports.validateForm = (req, res, next) => {
    console.log(req.body);
    const { error } = formSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new Error(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        console.log(req.session)
        console.log('👍🏻👍🏻👍🏻👍🏻')
        next()
    } else {
        console.log('👎🏻👎🏻👎🏻👎🏻👎🏻')
        next() // TEMP TODO TEMPPPPPPPPPPPPP
        // res.send('Uh-uh')
    }
}