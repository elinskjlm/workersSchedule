const { scheduleSchema, formSchema, userSchema } = require('./schemas')

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
    const { error } = formSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new Error(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        // throw new Error(msg, 400)
        return res.send({
            success: false,
            msg,
            // msgHeb: `שגיאה: ${msg}`,
            msgHeb: 'Note: ' +  msg,
        });
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('👎👎👎👎👎') 
        if (req.baseUrl.startsWith('/api')) {
            return res.send({ success: false, reason: 'Not allowed or not logged in.' })
        } else {
            return res.redirect('/users/login')
        }
    } else {
        console.log('👍👍👍👍👍')
        next();
    }
}

// middleware to be used if a logged-in user is trying and failing to log-in again
module.exports.logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) return next(err); // TODO ???
    });
    next();
}