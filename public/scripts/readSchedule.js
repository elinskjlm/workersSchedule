const optionMap = new Map();
let currentId;

// const currentYear = currentYearData; // Defined already in weekPicker.js
// const weekInput =   document.getElementById('weekInput'); // Defined already in weekPicker.js
// const calendar =    document.getElementById('calendar'); // Defined already in weekPicker.js
const namesField =      document.getElementById('names-field');
const namesList =       document.getElementById('names-list');
const toggleSeen =      document.getElementById('toggleSeen');
const toggleOpen =      document.getElementById('toggleOpen');
const toggleProper =    document.getElementById('toggleProper');
// const resetButton = document.getElementById('resetButton');

const navRead = document.getElementById('nav-read');
navRead.classList.add('active');

const weekNum = weekNumData;
const year = yearData;
const scheduleId = scheduleIdData;

// ----Week to names-----
async function getAvailableNames() {
    const chosenWeek = weekInput.dataset.week;
    const chosenYear = weekInput.dataset.year;
    if (weekInput.value) {
        const response = await fetch('/api/v1/schedules/getNames?' + new URLSearchParams({
            year: chosenYear,
            weeknum: chosenWeek
        }))
        const availableNames = await response.json()
        return availableNames;
    }
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
    loadNameList(availableNames);
}

// ----Name to form-----


function attachDataId() {
    const dataId = optionMap.get(namesField.value);
    if (dataId) {
        namesField.dataset.id = dataId;
    } else {
        delete namesField.dataset.id;
    }
}

async function fetchAndLoadForm(id = '') {
    if (!id) id = namesField.dataset.id;
    if (!id) return false;
    const wrappedSchedule = await fetchSchedule(id);
    loadSchedule(wrappedSchedule);
    if (!namesField.value) namesField.value = wrappedSchedule.name;
    return;
}

async function fetchSchedule(id) {
    const result = await fetch(`/api/v1/schedules/${id}`)
    const wrappedSchedule = await result.json();
    return wrappedSchedule;
}

function loadSchedule(wrappedSchedule) {
    currentId =              wrappedSchedule.id;
    const comment =          wrappedSchedule.comment;
    const timeSubmittedISO = wrappedSchedule.timeSubmitted;
    const schedule =         wrappedSchedule.schedule;
    const isProper =         wrappedSchedule.isProper;
    const isSeen =           wrappedSchedule.isSeen;
    const isOpen =           wrappedSchedule.isOpen;
    const timeSubmitted = new Date(timeSubmittedISO)

    for (let i = 1; i <= 7; i++) {
        const day = 'day' + i;
        const dailySchedule = schedule[day];

        const morningReg =  dailySchedule.morning.reg;
        const morningOt =   dailySchedule.morning.ot;
        const noonReg =     dailySchedule.noon.reg;
        const nightReg =    dailySchedule.night.reg;
        const nightOt1 =    dailySchedule.night.ot1;
        const nightOt2 =    dailySchedule.night.ot2;

        const cbMorningReg =    document.querySelector(`#shifts\\[${i}\\]\\[morning\\]\\[reg\\]`)
        const cbMorningOt =     document.querySelector(`#ots\\[${i}\\]\\[morning\\]\\[ot1\\]`)
        const cbNoonReg =       document.querySelector(`#shifts\\[${i}\\]\\[noon\\]\\[reg\\]`)
        const cbNightReg =      document.querySelector(`#shifts\\[${i}\\]\\[night\\]\\[reg\\]`)
        const cbNightOt1 =      document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot1\\]`)
        const cbNightOt2 =      document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot2\\]`)

        cbMorningReg.checked =  morningReg;
        cbMorningOt.checked =   morningOt;
        cbNoonReg.checked =     noonReg;
        cbNightReg.checked =    nightReg;
        cbNightOt1.checked =    nightOt1;
        cbNightOt2.checked =    nightOt2;
    }

    const elComment = document.querySelector('#comment');
    elComment.innerHTML = comment;

    toggleOpen.checked = isOpen;
    toggleSeen.checked = isSeen;
    toggleProper.checked = isProper;

    const yearSubmit =      timeSubmitted.getFullYear().toString().slice(2);
    const monthSubmit =     (timeSubmitted.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const dateSubmit =      timeSubmitted.getDate().toString().padStart(2, '0');
    const hoursSubmit =     timeSubmitted.getHours().toString().padStart(2, '0');
    const minutesSubmit =   timeSubmitted.getMinutes().toString().padStart(2, '0');
    const elDateSubmitted = document.querySelector('#dateSubmitted');
    const elTimeSubmitted = document.querySelector('#timeSubmitted');
    elDateSubmitted.innerHTML = `${dateSubmit}/${monthSubmit}/${yearSubmit}`;
    elTimeSubmitted.innerHTML = `${hoursSubmit}:${minutesSubmit}`;

    toggleSeen.checked = true;
    toggleState(currentId, 'seen', true)
    return true;
}

function clearSchedule() {
    [toggleOpen, toggleProper, toggleSeen].forEach(el => el.checked = false);
    currentId = '';
    for (let i = 1; i <= 7; i++) {
        const cbMorningReg = document.querySelector(`#shifts\\[${i}\\]\\[morning\\]\\[reg\\]`)
        const cbMorningOt = document.querySelector(`#ots\\[${i}\\]\\[morning\\]\\[ot1\\]`)
        const cbNoonReg = document.querySelector(`#shifts\\[${i}\\]\\[noon\\]\\[reg\\]`)
        const cbNightReg = document.querySelector(`#shifts\\[${i}\\]\\[night\\]\\[reg\\]`)
        const cbNightOt1 = document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot1\\]`)
        const cbNightOt2 = document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot2\\]`)

        cbMorningReg.checked = false;
        cbMorningOt.checked = false;
        cbNoonReg.checked = false;
        cbNightReg.checked = false;
        cbNightOt1.checked = false;
        cbNightOt2.checked = false;
    }
    const elComment = document.querySelector('#comment');
    const elDateSubmitted = document.querySelector('#dateSubmitted');
    const elTimeSubmitted = document.querySelector('#timeSubmitted');
    elComment.innerHTML = '';
    elDateSubmitted.innerHTML = '';
    elTimeSubmitted.innerHTML = '';
}


[toggleOpen, toggleProper, toggleSeen].forEach(el => el.addEventListener('change', () => {
    currentId ? toggleState(currentId, el.dataset.toggle, el.checked) : '';
}))

async function toggleState(id, toggle, checked) {
    const state = checked ? 'on' : 'off';
    const res = await fetch(`/api/v1/schedules/` + id, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [toggle]: state }),
    })
}

weekInput.addEventListener('change', () => refreshNames())


namesField.addEventListener('blur', () => attachDataId())
namesField.addEventListener('blur', () => fetchAndLoadForm(namesField.dataset.id))
namesField.addEventListener('input', () => clearSchedule())
// resetButton.addEventListener('click', () => clearSchedule())

weekInput.value = (weekNum && year) ? `${weekNum},${year}`: ``;
weekInput.dataset.week = weekNum;
weekInput.dataset.year = year;
refreshNames()
fetchAndLoadForm(scheduleId)