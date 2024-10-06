const navLogoutLink =   document.getElementById('nav-logout');
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const bulb = document.getElementById('status-bulb');

navLogoutLink.addEventListener('click', async () => {
    const res = await fetch('/api/v1/users/logout');
    const answer = await res.json();
    window.location.replace(answer.redirect || '/users/login');
})

async function getState() {
    const response = await fetch('/api/v1/config/liveForm')
    const state = await response.json()
    return state
}

getState().then(state => {
    if (state) {
        bulb.classList.add('green-light')
        bulb.classList.remove('red-light')
    } else {
        bulb.classList.add('red-light')
        bulb.classList.remove('green-light')
    }
})