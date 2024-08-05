
const tbody = document.getElementById('tbody');
const navUser = document.getElementById('nav-user');
navUser.classList.add('active');
const btnModalCreate = document.getElementById('btnModalCreate');
const newUserModal = document.getElementById('newUserModal')
const editUserModal = document.getElementById('editUserModal')

// const modalEditUser = '';
// const modalNewUser = '';
// const modalDeleteUser = '';
// const modalSuccess = '';


btnModalCreate.addEventListener('click', async (e) => {
    const newName =     document.getElementById('newName');
    const newUsername = document.getElementById('newUsername');
    const newUserRoll = document.getElementById('newUserRoll');
    const newUserPassword = document.getElementById('newUserPassword');
    const result = await createUser(newName.value, newUsername.value, newUserPassword.value, newUserRoll.value)
    const answer = await result.json()
    if (answer.success) {
        console.log('open modal success')
        loadUserssTable();
        const successUserModal = new bootstrap.Modal('#successUserModal');
        const successH1 = document.getElementById('successUserModalH1');
        const successMessege = document.getElementById('successUserModalMessege');
        successH1.innerHTML = "המשתמש נוצר בהצלחה";
        successMessege.innerHTML = answer.msgHeb;
        successUserModal.show();
    } else {
        console.log('open modal fail + reason')
        const successUserModal = new bootstrap.Modal('#successUserModal')
        successUserModal.show();
    }
    console.log(answer)
})

document.querySelectorAll('input[name="radio-filter"]').forEach(btn => {
    btn.addEventListener('click', () => loadUserssTable())
})

loadUserssTable()

async function createUser(name, username, password, roll) {
    return await fetch('/api/v1/users', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            username,
            password,
            roll,
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
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr[${i}]`);
        const actions = createActionButtons(i, user._id)
        tr.innerHTML = `
            <th>${i+1}</th>
            <td>${user.shortId}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.roll}</td>
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
    // const toEditUserRoll =  document.getElementById('toEditUserRoll');
    const btnModalEdit = document.getElementById('btnModalEdit');
    btnModalEdit.addEventListener('click', () => {
        editUser(id)
    }, { once: true })
    //  TODO placeholders of the current dedails
}

async function editUser(id) {
    const change = {
        newName: document.getElementById('toEditName').value || undefined,
        oldPassword: document.getElementById('oldPassword').value || undefined,
        newPassword: document.getElementById('toEditPassword').value || undefined,
        newRoll: document.getElementById('toEditUserRoll').value || undefined,
    }
    console.log(change)
    const res = await fetch(`/api/v1/users/${id}?`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(change),
    })
    const answer = await res.json();
    if (answer.success) {
        console.log('open modal success')
        loadUserssTable();
        const successUserModal = new bootstrap.Modal('#successUserModal');
        const successH1 = document.getElementById('successUserModalH1');
        const successMessege = document.getElementById('successUserModalMessege');
        successH1.innerHTML = "המשתמש נערך בהצלחה";
        successMessege.innerHTML = answer.msgHeb;
        successUserModal.show();
    } else {
        console.log('open modal fail + reason')
        const successUserModal = new bootstrap.Modal('#successUserModal')
        successUserModal.show();
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
        console.log('open modal success')
        loadUserssTable();
        const successUserModal = new bootstrap.Modal('#successUserModal');
        const successH1 = document.getElementById('successUserModalH1');
        const successMessege = document.getElementById('successUserModalMessege');
        successH1.innerHTML = "המשתמש נמחק בהצלחה";
        successMessege.innerHTML = answer.msgHeb;
        successUserModal.show();
    } else {
        // console.log('open modal fail + reason')
        // const successUserModal = new bootstrap.Modal('#successUserModal')
        // successUserModal.show();
    }
    return res
}

function resetModalNewUser() {
    const newName =         document.getElementById('newName');
    const newUsername =     document.getElementById('newUsername');
    const newUserRoll =     document.getElementById('newUserRoll');
    const newUserPassword = document.getElementById('newUserPassword');
    newName.value = '';
    newUsername.value = '';
    newUserPassword.value = '';
    newUserRoll.value = 'inspector'; // TODO it's too manual
}

function resetModaleditUser() {
    const toEditName =     document.getElementById('toEditName');
    const oldPassword =    document.getElementById('oldPassword');
    const toEditPassword = document.getElementById('toEditPassword');
    const toEditUserRoll = document.getElementById('toEditUserRoll');
    toEditName.value = '';
    oldPassword.value = '';
    toEditPassword.value = '';
    toEditUserRoll.value = 'inspector'; // TODO it's too manual
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