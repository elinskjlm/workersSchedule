const optionMap =   new Map();
const tbody =       document.getElementById('tbody');
const navSched =    document.getElementById('nav-schedule');
const namesField =  document.getElementById('names-field');
const namesList =   document.getElementById('names-list');
navSched.classList.add('active');

document.querySelectorAll('input[name="radio-filter"]').forEach(btn => {
    btn.addEventListener('click', () => loadSchedulesTable())
})

async function fetchSchedules() {
    const onlyOpen =        document.querySelector('input[name="radio-open"]:checked').value;
    const onlyProper =      document.querySelector('input[name="radio-proper"]:checked').value;
    const onlySeen =        document.querySelector('input[name="radio-seen"]:checked').value;
    const weekNum =         weekInput.dataset.week;
    const year =            weekInput.dataset.year;
    const name =            namesField.value;
    const params = new URLSearchParams({ onlyOpen, onlyProper, onlySeen, weekNum, year, name })
    const result = await fetch('/api/v1/schedules?' + params);
    const schedules = await result.json();
    return schedules
}

function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(att => element.setAttribute(att, attributes[att]))
    return element;
}

function createActionButtons(i, scheduleId, isOpen) {
    function createInput(role, scheduleId, isOpen = undefined) {
        let id;
        let text;
        let color;
        let name;
        let type;
        let action;
        let toCheck;
        switch (role) {
            case "on":
                id = `btnOn[${i}]`;
                text = "לטיפול";
                color = "info";
                // name = `radio[${i}]`;
                name = `toggle[${i}]`; // TODO type?
                // type = "radio";
                type = "checkbox"; // TODO type?
                action = toggleState;
                toCheck = isOpen;
                break;

            case "off":
                id = `btnOff[${i}]`;
                text = "טופל";
                color = "secondary";
                // name = `radio[${i}]`;
                name = `toggle[${i}]`; // TODO type?
                // type = "radio";
                type = "checkbox"; // TODO type?
                action = toggleState;
                toCheck = !isOpen;
                break;

            case "del":
                id = `btnDel[${i}]`;
                text = "מחיקה";
                color = "danger";
                name = `del[${i}]`;
                type = "button";
                action = beforeDeleting;
                toCheck = true;
                break;

            default:
                throw new Error('only "on" or "off"'); // TODO
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
            input.checked ? action(scheduleId, role) : e.preventDefault();
        })

        const labelAttributes = {
            class: `btn btn-sm btn-outline-${color} ${role==='del'?'ms-3':''}`,
            for: id,
            'data-bs-toggle': role==='del'?"modal":"",
            'data-bs-target': role==='del'?"#deleteModal":"",
        }
        const label = setAttributes(document.createElement('label'), labelAttributes)
        label.innerText = text;

        return { input, label }
    }

    const { input: offInput, label: offLabel } = createInput("off", scheduleId, isOpen);
    const { input: onInput, label: onLabel } = createInput("on", scheduleId, isOpen);
    const { input: delInput, label: delLabel } = createInput("del", scheduleId);


    const groupAttribues = {
        id: `toggleGroup[${i}]`,
        class: "btn-group",
        role: "group",
        ariaLabel: "Basic radio toggle button group"
    }
    const toggleGroup = setAttributes(document.createElement('div'), groupAttribues)
    toggleGroup.append(offInput, offLabel, onInput, onLabel)
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('d-flex');
    wrapDiv.append(toggleGroup, delInput, delLabel);
    return wrapDiv;
}

async function loadSchedulesTable() {
    const schedules = await fetchSchedules();
    tbody.innerHTML = '';
    schedules.forEach((schedule, i) => {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr[${i}]`);
        const actions = createActionButtons(i, schedule._id, schedule.isOpen)
        tr.innerHTML = `
            <th>${i+1}</th>
            <td>${schedule.shortId}</td>
            <td>${schedule.year}</td>
            <td>${schedule.weekNum}</td>
            <td>${schedule.name}</td>
            <td>${schedule.dateDay}, <small class="text-muted text-sm">${schedule.dateHour}</small></td>
            <td id="actions[${i}]"></td>
            <td>${schedule.isProper ? '👍<small>תקין</small>' : '😡<small>לא תקין</small>'}</td>
            <td>${schedule.isSeen ? '👀<small>נקרא</small>' : '🕶️<small>לא נקרא</small>'}</td>
            <td><a href="/schedules/read?scheduleid=${schedule._id}" target="_blank">פתיחה</a></td>
        `;
        tbody.appendChild(tr);
        document.getElementById(`actions[${i}]`).append(actions)
    });
}

async function toggleState(id, set) {
    if (!(['on', 'off'].includes(set))) throw new Error('only "on" or "off"')
    const res = await fetch(`/api/v1/schedules/${id}?`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ open: set }),
    })
    loadSchedulesTable()
    return res
}

function beforeDeleting(id, _) {
    const btnModalDel = document.getElementById('btnModalDel');
    btnModalDel.addEventListener('click', () => {
        deleteSchedule(id, _)
    }, { once: true })
}

async function deleteSchedule(id, _) {
    const res = await fetch(`/api/v1/schedules/${id}?`, {
        method: "DELETE"
    })
    loadSchedulesTable()
    return res
}

const updateButton = document.getElementById("update-button");
updateButton.addEventListener('click', async () => {
    loadSchedulesTable();
})

loadSchedulesTable()

async function getAvailableNames() {
    const response = await fetch('/api/v1/schedules/getNames')
    const availableNames = await response.json()
    return availableNames;
}


function loadNameList(availableNames) {
    namesList.textContent = '';
    if (availableNames) {
        availableNames.forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name.name);
            option.setAttribute('data-id', name._id);
            namesList.appendChild(option)
            optionMap.set(option.value, option.dataset.id);
        })
    }
}

async function refreshNames() {
    namesField.value = '';
    const availableNames = await getAvailableNames();
    console.dir(availableNames)
    loadNameList(availableNames);
}

refreshNames();