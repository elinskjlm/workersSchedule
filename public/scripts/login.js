const loginButton =     document.getElementById('btnLogin');
const usernameField =   document.getElementById('loginUsername');
const passwordField =   document.getElementById('loginPassword');
const toast =           document.getElementById('toast');
const toastBody =       document.getElementById('toastBody');

loginButton.addEventListener('click', async () => {
    if (usernameField.value && passwordField.value) {
        const answer = await attemptLogin(usernameField.value, passwordField.value)
        if (answer.success) {
            console.log('success')
            redirect();
        } else {
            showToast(answer.msgHeb)
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

function showToast(msg) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
    toastBody.innerHTML = msg;
    toastBootstrap.show()
}