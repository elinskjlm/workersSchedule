const toast =           document.getElementById('toast');
const toastHeader =     document.getElementById('toastHeader');
const toastBody =       document.getElementById('toastBody');

function showToast(header, message) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
    toastHeader.innerHTML = header;
    toastBody.innerHTML = message;
    toastBootstrap.show()
}