
const tbody = document.getElementById('tbody');
const navUser = document.getElementById('nav-user');
navUser.classList.add('active');
const btnModalCreate = document.getElementById('btnModalCreate');
const newUserModal = document.getElementById('newUserModal')
const editUserModal = document.getElementById('editUserModal')
const temporarValuesNewUser = {
    tempName: '',
    tempUsername: '',
    tempUserRole: '',
}


btnModalCreate.addEventListener('click', async (e) => {
    const newName =         document.getElementById('newName');
    const newUsername =     document.getElementById('newUsername');
    const newUserRole =     document.getElementById('newUserRole');
    const newUserPassword = document.getElementById('newUserPassword');
    const result = await createUser(newName.value, newUsername.value, newUserPassword.value, newUserRole.value)
    const answer = await result.json()
    loadUserssTable();
    if (answer.success) {
        showToast('הפעולה הצליחה', `המשתמש נוצר בהצלחה. הנך מחובר כעת כ-${newUsername.value}`) // TODO rely on username from DB?
        document.getElementById('nav-username').innerHTML = newUsername.value
    } else {
        showToast('הפעולה נכשלה', answer.msgHeb)
        const newUserModal =     new bootstrap.Modal('#newUserModal');
        temporarValuesNewUser.tempName =        newName.value;
        temporarValuesNewUser.tempUsername =    newUsername.value;
        temporarValuesNewUser.tempUserRole =    newUserRole.value;
        newUserModal.show();
    }
})

document.querySelectorAll('input[name="radio-filter"]').forEach(btn => {
    btn.addEventListener('click', () => loadUserssTable())
})

loadUserssTable()

async function createUser(name, username, password, role) {
    return await fetch('/api/v1/users', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            username,
            password,
            role,
        }),
    })
}

async function fetchUsers() {
    // Commented out lines are for future filtering.
    // const status = document.querySelector('input[name="radio-filter"]:checked').value;
    // const params = new URLSearchParams({ status })
    const result = await fetch('/api/v1/users?' /*+ params*/);
    const users = await result.json();
    return users
}

function createActionButtons(i, userId) {
    function createInput(role, userId) {
        function setAttributes(element, attributes) {
            Object.keys(attributes).forEach(att => element.setAttribute(att, attributes[att]))
            return element;
        }
        let id;
        let text;
        let color;
        let name;
        let type;
        let action;
        let dataBsTarget;
        let toCheck;
        switch (role) {

            case "edit":
                id = `btnEdit[${i}]`;
                text = "עריכה";
                color = "warning";
                name = `edit[${i}]`;
                type = "button";
                action = beforeEditing;
                dataBsTarget = "#editUserModal"
                toCheck = true;
                break;

            case "del":
                id = `btnDel[${i}]`;
                text = "מחיקה";
                color = "danger";
                name = `del[${i}]`;
                type = "button";
                action = beforeDeleting;
                dataBsTarget = "#deleteUserModal"
                toCheck = true;
                break;

            default:
                throw new Error('only "edit" or "del"'); // TODO
        }

        const inputAttr = {
            type,
            class: "btn-check",
            name,
            id,
            autocomplete: "off",
        }
        
        const input = setAttributes(document.createElement('input'), inputAttr)
        if (toCheck) input.checked = true;
        input.addEventListener('click', (e) => {
            input.checked ? action(userId, role) : e.preventDefault();
        })

        const labelAttributes = {
            class: `btn btn-sm btn-outline-${color} ${role==='del'?'ms-3':''}`,
            for: id,
            'data-bs-toggle': "modal",
            'data-bs-target': dataBsTarget,
        }
        const label = setAttributes(document.createElement('label'), labelAttributes)
        label.innerText = text;

        return { input, label }
    }
    const { input: editInput, label: editLabel } = createInput("edit", userId);
    const { input: delInput, label: delLabel } = createInput("del", userId);
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('d-flex');
    wrapDiv.append(editInput, editLabel, delInput, delLabel);
    return wrapDiv;
}

async function loadUserssTable() {
    const users = await fetchUsers();
    tbody.innerHTML = '';
    users.forEach((user, i) => {
        if (user.role === 'developer') return; // Skip rendering of dev user
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr[${i}]`);
        const actions = createActionButtons(i, user._id)
        tr.innerHTML = `
            <th>${i+1}</th>
            <td>${user.shortId}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.createdDate}</td>
            <td></td>
            <td id="actions[${i}]"></td>
        `;
        tbody.appendChild(tr);
        document.getElementById(`actions[${i}]`).append(actions)
    });
}

function beforeEditing(id) {
    // const toEditName =      document.getElementById('toEditName');
    // const oldPassword =     document.getElementById('oldPassword');
    // const toEditPassword =  document.getElementById('toEditPassword');
    // const toEditUserRole =  document.getElementById('toEditUserRole');
    const btnModalEdit = document.getElementById('btnModalEdit');
    btnModalEdit.addEventListener('click', () => {
        editUser(id)
    }, { once: true })
    //  TODO placeholders of the current dedails
}

async function editUser(id) {
    const change = {
        newName:     document.getElementById('toEditName').value || undefined,
        oldPassword: document.getElementById('oldPassword').value || undefined,
        newPassword: document.getElementById('toEditPassword').value || undefined,
        newRole:     document.getElementById('toEditUserRole').value || undefined,
    }
    const res = await fetch(`/api/v1/users/${id}?`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(change),
    })
    const answer = await res.json();
    if (answer.success) {
        loadUserssTable();
        showToast('הפעולה הצליחה', 'המשתמש נערך בהצלחה')
    } else {
        showToast('הפעולה נכשלה', `המשתמש לא נערך.<br/>${answer.msgHeb}`)
        // TODO bring back the modal with the draft 
    }
    return res
}

function beforeDeleting(id) {
    const btnModalDelUser = document.getElementById('btnModalDelUser');
    btnModalDelUser.addEventListener('click', () => {
        deleteUser(id)
    }, { once: true })
}

async function deleteUser(id) {
    const res = await fetch(`/api/v1/users/${id}?`, {
        method: "DELETE"
    })
    const answer = await res.json();
    if (answer.success) {
        loadUserssTable();
        showToast('הפעולה הצליחה', 'המשתמש נמחק בהצלחה')
    } else {
        showToast('הפעולה נכשלה', `המשתמש לא נמחק.<br/>${answer.msgHeb}`)
    }
    return res
}

function resetModalNewUser() {
    const newName =         document.getElementById('newName');
    const newUsername =     document.getElementById('newUsername');
    const newUserRole =     document.getElementById('newUserRole');
    const newUserPassword = document.getElementById('newUserPassword');
    newName.value =         temporarValuesNewUser.tempName || '';
    newUsername.value =     temporarValuesNewUser.tempUsername || '';
    newUserPassword.value = ''; // Always
    newUserRole.value =     temporarValuesNewUser.tempUserRole || 'inspector'; // TODO it's too manual
    for (let key in temporarValuesNewUser){
        temporarValuesNewUser[key] = '';
    }
}

function resetModaleditUser() {
    const toEditName =     document.getElementById('toEditName');
    const oldPassword =    document.getElementById('oldPassword');
    const toEditPassword = document.getElementById('toEditPassword');
    const toEditUserRole = document.getElementById('toEditUserRole');
    toEditName.value = '';
    oldPassword.value = '';
    toEditPassword.value = '';
    toEditUserRole.value = 'inspector'; // TODO it's too manual
}


newUserModal.addEventListener('show.bs.modal', (e) => {
    resetModalNewUser();
})
// newUserModal.addEventListener('hide.bs.modal', (e) => {
//     resetModalNewUser();
// })

editUserModal.addEventListener('show.bs.modal', (e) => {
    resetModaleditUser();
})
// editUserModal.addEventListener('hide.bs.modal', (e) => {
//     resetModaleditUser();
// })