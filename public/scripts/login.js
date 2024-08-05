const loginButton = document.getElementById('btnLogin');
const usernameField = document.getElementById('loginUsername');
const passwordField = document.getElementById('loginPassword');

loginButton.addEventListener('click', async () => {
    if (usernameField.value && passwordField.value) {
        const answer = await attemptLogin(usernameField.value, passwordField.value)
        if (answer.success) {
            console.log('success')
            redirect();
        } else {
            console.log('fail')
            console.log(answer.msgHeb)
            // TODO
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

function redirect(dest='') {
    dest ||= '/schedules/control';
    window.location = dest;
}