const navLogoutLink =   document.getElementById('nav-logout');

navLogoutLink.addEventListener('click', async () => {
    const res = await fetch('/api/v1/users/logout');
    const answer = await res.json();
    window.location.replace(answer.redirect || '/users/login');
})