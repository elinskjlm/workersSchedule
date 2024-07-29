const nameField =       document.getElementById('nav-username');
const btnModalLogin =   document.getElementById('btnModalLogin');
const navLogoutLink =   document.getElementById('nav-logout');
const navLoginLink =    document.getElementById('nav-login');
const navUserLink =     document.getElementById('nav-username');
const userSession = userSessionData || {};

btnModalLogin.addEventListener('click', async () => {
    const loginUsername = document.getElementById('loginUsername').value;
    const loginUserPassword = document.getElementById('loginUserPassword').value;
    if (loginUsername && loginUserPassword) {
        const answer = await attemptLogin(loginUsername, loginUserPassword)
        console.dir(answer)
        console.dir(answer.data.name)
        if (answer.success) {
            console.log('success')
            userSession.name = answer.data.name,
            updateName()
        } else {
            console.log('fail')
            console.log(answer.msgHeb)
        }
    }
})

async function attemptLogin(username, password) {
    const res = await fetch('/api/v1/users/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
    const answer = await res.json();
    return answer;
}

function updateName() {
    if (userSession) {
        nameField.innerHTML = userSession.name;
        navLogoutLink.classList.remove('hidden')
        navUserLink.classList.remove('hidden')
        navLoginLink.classList.add('hidden')
    } else {
        nameField.innerHTML = 'כניסה';
        navLogoutLink.classList.add('hidden')
        navUserLink.classList.add('hidden')
        navLoginLink.classList.remove('hidden')
    }
}