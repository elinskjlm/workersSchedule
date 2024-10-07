const { scheduleSchema, formSchema, userSchema } = require('./schemas');
const ExpressError =    require('./utils/ExpressError');
const Code =            require('./models/code')

module.exports.validateSchedule = (req, res, next) => {
    const { error } = scheduleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        // throw new Error(msg, 400)
        return res.send({
            success: false,
            msg,
            msgHeb: `שגיאה: ${msg}`,
        });
    } else {
        next();
    }
}

module.exports.validateForm = (req, res, next) => {
    const { error } = formSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        // throw new Error(msg, 400)
        return res.send({
            success: false,
            msg,
            msgHeb: `שגיאה: ${msg}`,
        });
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
            msgHeb: `שגיאה: ${msg}`,
        });
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('👎👎👎👎👎') 
        if (req.baseUrl.startsWith('/api')) {
            return res.send({ success: false, reason: 'לא מורשה, או לא מחובר' })
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

module.exports.checkCode = async (req, res, next) => {
    const { code } = req.query;
    if (code) {
        // TODO should a middleware read directly from the DB? Or should it be in a controller or something?
        const result = await Code.findOne({ accessCode: code });
        if (result) return next();
    }
    next(new ExpressError('העמוד לא נמצא, או שהקוד לא נכון', 404));
}