const loginButton =     document.getElementById('btnLogin');
const usernameField =   document.getElementById('loginUsername');
const passwordField =   document.getElementById('loginPassword');
const accessButton =    document.getElementById('btnAccess');
const accessCode =      document.getElementById('accessCode');
// const toast =           document.getElementById('toast');
// const toastBody =       document.getElementById('toastBody');

loginButton.addEventListener('click', async () => {
    if (usernameField.value && passwordField.value) {
        const success = await attemptLogin(usernameField.value, passwordField.value)
        if (success) {
            redirect('/schedules/control');
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
        return false
    }
}

function redirect(dest) {
    window.location = dest;
}

accessButton.addEventListener('click', async () => {
    const code = accessCode.value;
    if (code) {
        const statusCode = await tryCode(code);
        if (statusCode === 404) {
            showToast('הגישה נדחתה', 'קוד גישה שגוי.');
        } else if (200 <= statusCode && statusCode < 300) {
            redirect('/forms/apply?code=' + code);
        } else {
            showToast('הפעולה נכשלה', 'הבדיקה החזירה קוד לא צפוי.');
        }
    } else {
        showToast('נדרש קוד', 'נא להזין קוד גישה.');
    }
})

async function tryCode(accessCode) {
    try {
        const res = await fetch('/forms/apply?code=' + accessCode);
        return +res.status;
    } catch (error) {
        return false
    }
}