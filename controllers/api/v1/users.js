const User =    require('../../../models/user');
const bcrypt =  require('bcryptjs');

module.exports.getAllUsers = async (req, res) => {
    const users = await User.find({}, { hashedPassword: 0, __v: 0 });
    res.send(users);
}

module.exports.createUser = async (req, res) => {
    // async function passwordHasher(pw) {
    //     const salt = await bcrypt.genSalt(12);
    //     const hashed = await bcrypt.hash(pw, salt) // TEMP can be just `.hash(pw, 12)`
    //     return hashed;
    // }
    const { name, username, password, roll } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userExists = (await User.find({ username })).length;
    if (userExists) {
        res.send({
            success: false,
            msgHeb: `שם המשתמש "${username}" כבר תפוס.`,
        }) // TODO correct
    } else {
        const newUser = new User({
            name,
            username,
            hashedPassword,
            roll: roll || 'inspector',
            created: new Date(),
            lastSeen: null,
            lastModified: null,
        })
        newUser.save();
        console.log(newUser);
        // TODO do not include hashedPassword in the returned object
        // res.send(newUser._id);
        res.send({
            success: true,
            msgHeb: `המשתמש "${newUser.username}" נוצר עבור ${newUser.name}.`,
        });
    }
}

module.exports.readUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id, { hashedPassword: 0 });
    res.send(user);
}

module.exports.updateUser = async (req, res) => {
    // TODO check if different rather than check for existance
    const { id } = req.params
    const { newName, oldPassword, newPassword, newRoll } = req.body;
    const user = await User.findById(id)
    user.lastModified = new Date();
    const changes = [];
    if (newName) {
        user.name = newName;
        changes.push('שם');
    }
    if (newRoll != user.roll) {
        user.roll = newRoll;
        changes.push('תפקיד');
    }
    // newName ? user.name = newName : '';
    // newRoll ? user.roll = newRoll : '';
    if (oldPassword && newPassword) {
        const hashedPasswordUser = user.hashedPassword;
        const allowed = await bcrypt.compare(oldPassword, hashedPasswordUser);
        if (allowed) {
            user.hashedPassword = await bcrypt.hash(newPassword, 12);
            changes.push('סיסמה')
        } else {
            console.log('nono')
            return res.send({
                success: false,
                msgHeb: `סיסמה ישנה לא נכונה. השינויים לא נשמרו.`
            })
        }
    }
    user.save();
    console.log(`OK ${changes}.`)
    return res.send({
        success: true,
        msgHeb: `השינויים נשמרו בהצלחה בשדות: ${changes.join(', ')}.`, //TODO
        changes,
    });
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    return res.send({
        success: true,
        msgHeb: `המשתמש "${user.username}" נמחק בהצלחה.`, //TODO
        data: user,
    });
}

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const hashedPw = user?.hashedPassword || '';
    const isCorrect = await bcrypt.compare(password, hashedPw);
    if (isCorrect) {
        req.session.userId = user._id;
        console.log(req.session)
        return res.send({
            success: true,
            msgHeb: `המשתמש "${user.username}" זוהה בהצלחה.`, //TODO
            data: {
                userId: user._id,
                name: user.name,
                username: user.username,
            },
        })
    } else {
        delete req.session.userId;
        console.log(req.session);
        return res.send({
            success: false,
            msgHeb: `פרטי משתמש לא נכונים.`, //TODO
            data: '',
        })
    }
}