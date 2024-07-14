
const tbody = document.getElementById('tbody');

document.querySelectorAll('input[name="radio-filter"]').forEach(btn => {
    btn.addEventListener('click', () => loadFormsTable())
})

loadFormsTable()


async function fetchForms() {
    const status = document.querySelector('input[name="radio-filter"]:checked').value;
    const params = new URLSearchParams({ status })
    const result = await fetch('/api/forms?' + params);
    const forms = await result.json();
    return forms
}

function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(att => element.setAttribute(att, attributes[att]))
    return element;
}

function createActionButtons(i, formId, isLive) {
    function createInput(role, formId, isLive = undefined) {
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
                text = "זמין";
                color = "primary";
                // name = `radio[${i}]`;
                name = `toggle[${i}]`; // TODO type?
                // type = "radio";
                type = "checkbox"; // TODO type?
                action = toggleState;
                toCheck = isLive;
                break;

            case "off":
                id = `btnOff[${i}]`;
                text = "כבוי";
                color = "secondary";
                // name = `radio[${i}]`;
                name = `toggle[${i}]`; // TODO type?
                // type = "radio";
                type = "checkbox"; // TODO type?
                action = toggleState;
                toCheck = !isLive;
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
            input.checked ? action(formId, role) : e.preventDefault();
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

    const { input: offInput, label: offLabel } = createInput("off", formId, isLive);
    const { input: onInput, label: onLabel } = createInput("on", formId, isLive);
    const { input: delInput, label: delLabel } = createInput("del", formId);


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

async function loadFormsTable() {
    const forms = await fetchForms();
    tbody.innerHTML = '';
    forms.forEach((form, i) => {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr[${i}]`);
        const actions = createActionButtons(i, form._id, form.isLive)
        tr.innerHTML = `
            <th>${i+1}</th>
            <td>${form.shortId}</td>
            <td>${form.year}</td>
            <td>${form.weekNum}</td>
            <td>${form.dates.startDate}</td>
            <td>${form.dates.endDate}</td>
            <td id="actions[${i}]"></td>
            <td><a href="formworker/${form._id}" target="_blank">לינק</a>
            <a href="#" id="copy[${i}]", data-link="formworker/${form._id}">העתקה</a></td>
        `;
        tbody.appendChild(tr);
        document.getElementById(`actions[${i}]`).append(actions)
        const copyLink = document.getElementById(`copy[${i}]`);
        const origin = window.location.origin
        copyLink.addEventListener('click', () => {
            navigator.clipboard.writeText(`${origin}/${copyLink.dataset.link}`)
        })
    });
}

async function toggleState(id, set) {
    if (!(['on', 'off'].includes(set))) throw new Error('only "on" or "off"')
    const res = await fetch(`/api/forms/${id}?`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: set }),
    })
    loadFormsTable()
    return res
}

function beforeDeleting(id, _) {
    const btnModalDel = document.getElementById('btnModalDel');
    btnModalDel.addEventListener('click', () => {
        deleteForm(id, _)
    }, { once: true })
}

async function deleteForm(id, _) {
    const res = await fetch(`/api/forms/${id}?`, {
        method: "DELETE"
    })
    loadFormsTable()
    return res
}

const newForm = document.getElementById("newBtn");
newForm.addEventListener('click', async () => {
    if (weekInput.value) {
        const values = {
            weekNum: weekInput.dataset.week,
            year: weekInput.dataset.year,
            isLive: false,
            timeCreated: new Date(),
        }

        const result = await fetch(`/api/forms/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
        loadFormsTable()
        return result

    }
})