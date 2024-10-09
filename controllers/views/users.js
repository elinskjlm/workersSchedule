module.exports.renderLogin = (req, res) => res.render('users/login')

module.exports.renderUsersControl = (req, res) => {
    const userSessionData = req.session || 'no session'
    res.render('users/usersControl', { userSessionData, pageTitle: 'ניהול משתמשים' })
}