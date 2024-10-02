const loginButton =     document.getElementById('btnLogin');
const usernameField =   document.getElementById('loginUsername');
const passwordField =   document.getElementById('loginPassword');
// const toast =           document.getElementById('toast');
// const toastBody =       document.getElementById('toastBody');

loginButton.addEventListener('click', async () => {
    if (usernameField.value && passwordField.value) {
        const success = await attemptLogin(usernameField.value, passwordField.value)
        if (success) {
            console.log('success')
            redirect();
        } else {
            showToast('הפעולה נכשלה', 'שם משתמש או סיסמה לא נכונים.')
        }
    } else {
        showToast('הפעולה נכשלה', 'שם משתמש או סיסמה חסרים.')
    }
})

async function attemptLogin(username, password) {
    try {
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
        if (!res.ok) {
            return false
        } else {
            const answer = await res.json();
            if (answer.success) {
                return true; 
            } else {
                return false
            }
        }
    } catch (error) {
        // console.log(error)
        return false
    }
}

function redirect(dest='') {
    dest ||= '/schedules/control';
    window.location = dest;
}

// function showToast(msg) {
//     const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
//     toastBody.innerHTML = msg;
//     toastBootstrap.show()
// }