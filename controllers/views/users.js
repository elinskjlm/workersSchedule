const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports.renderLogin = (req, res) => res.render('users/login')

module.exports.renderRegister = (req, res) => res.render('users/register')

module.exports.renderUsersControl = (req, res) => res.render('users/usersControl')

// module.exports.registerUser = async (req, res) => {
//     async function passwordHasher(pw) {
//         const salt = await bcrypt.genSalt(12);
//         const hashed = await bcrypt.hash(pw, salt) // TEMP can be just `.hash(pw, 12)`
//         return hashed;
//     }
//     const { name, username, password } = req.body;
//     const hashedPassword = await passwordHasher(password);
//     const userExists = (await User.find({ username })).length;
//     if (userExists) {
//         res.send(`A user with the username "${username}" is already exists.`)
//     } else {
//         const newUser = new User({
//             name,
//             username,
//             hashedPassword
//         })
//         newUser.save()
//         console.log(newUser)
//         res.send(newUser)
//     }
// }

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const hashedPw = user?.hashedPassword || '';
    const isCorrect = await bcrypt.compare(password, hashedPw);
    if (isCorrect) {
        req.session.userId = user._id;
        console.log(req.session)
        res.send(user)
    } else {
        delete req.session.userId;
        console.log(req.session);
        res.send('incorrect username / password (try admin 1234)')
    }
}