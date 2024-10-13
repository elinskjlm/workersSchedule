const User = require('../../../models/user');

module.exports.getAllUsers = async (req, res) => {
    const users = await User.find({}/*, { password: 0, __v: 0 }*/);
    res.send(users);
}

module.exports.createUser = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        const user = new User({
            name,
            username,
            role: role || 'inspector',
            created: new Date(),
            lastSeen: null,
            lastModified: null,
        });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err); // ???? TODO res.send(err) ?
            res.send({
                success: true,
                msgHeb: `המשתמש "${newUser.username}" נוצר עבור ${newUser.name}.`,
                data: req.user,
            });
        })
    } catch (e) {
        res.send({
            success: false,
            msgHeb: e.message, // TODO Hebrew!!
        });
    }
}

module.exports.readUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id, { password: 0 });
    res.send(user);
}

module.exports.updateUser = async (req, res) => {
    // TODO check if different rather than check for existance
    const { id } = req.params
    const { newName, oldPassword, newPassword, newRole } = req.body;
    const user = await User.findById(id)
    user.lastModified = new Date();
    const changes = [];
    if (newName) {
        user.name = newName;
        changes.push('שם');
    }
    if (newRole != user.role) {
        user.role = newRole;
        changes.push('תפקיד');
    }
    // newName ? user.name = newName : '';
    // newRole ? user.role = newRole : '';
    if (oldPassword && newPassword) {
        const passwordUpdated = await user.changePassword(oldPassword, newPassword);
        if (passwordUpdated) {
            changes.push('סיסמה')
        } else {
            return res.send({
                success: false,
                msgHeb: `סיסמה ישנה לא נכונה. השינויים לא נשמרו.`
            })
        }
    }
    user.save();
    return res.send({
        success: true,
        msgHeb: `השינויים נשמרו בהצלחה בשדות: ${changes.join(', ')}.`, //TODO
        changes,
    });
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    // const user = await User.findByIdAndDelete(id);
    const user = await User.findById(id);
    if (user.role === 'developer') {
        return res.send({
            success: false,
            msgHeb: `המשתמש "${user.username}" לא ניתן למחיקה מכאן.`, //TODO
            data: [user, req.user],
        });
    } else {
        await user.deleteOne()
        return res.send({
            success: true,
            msgHeb: `המשתמש "${user.username}" נמחק בהצלחה.`, //TODO
            data: [user, req.user],
        });
    }
}

module.exports.loginUser = (req, res) => {
    return res.send({
        success: true,
        msg: req.session,
        data: req.user,
    })
}

module.exports.logoutUser = (req, res) => {
    req.logOut(function (err) {
        if (err) return next(err); // TODO ???
    });
    return res.send({
        success: true,
        msg: req.session,
        data: req.user,
    })
}