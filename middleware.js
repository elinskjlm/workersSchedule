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
    // console.log('🦖🦖🦖🦖🦖🦖🦖🦖', req.baseUrl)
    if (req.session.userId) {
        // console.log(req.session)
        console.log('👍👍👍👍👍')
        // res.locals.currentUser = 'herro 😑'
        next()
    } else {
        console.log('👎👎👎👎👎')
        if (req.baseUrl.startsWith('/api')) {
            return res.send({ success: false, reason: 'Not allowed or not logged in.' })
        } else {
            return res.redirect('/users/login')
        }
    }
}