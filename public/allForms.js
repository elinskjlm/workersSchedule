const currentYear = currentYearData;
const currentWeek = currentWeekData;
const /*NEW*/optionMap = new Map();
const /*OLD*/allInputsWithLists = {};
const years = yearsData.split(',');
const weeks = weeksData.split(',');

const /*OLD*/yearsPick = document.getElementById('yearsPick');
const /*OLD*/weeksPick = document.getElementById('weeksPick');
const /*OLD*/namesPick = document.getElementById('namesPick');
const /*OLD*/updateButton = document.getElementById('updateButton');
const /*OLD*/namesButton = document.getElementById('namesButton');

const /*NEW*/yearsField = document.getElementById('years-field');
const /*NEW*/weeksField = document.getElementById('weeks-field');
const /*NEW*/namesField = document.getElementById('names-field');
const /*NEW*/yearsList = document.getElementById('years-list');
const /*NEW*/weeksList = document.getElementById('weeks-list');
const /*NEW*/namesList = document.getElementById('names-list');
const /*NEW*/updateNamesBtn = document.getElementById('update-names-button')
const /*NEW*/updateFormBtn = document.getElementById('update-form-button')

const /*BOTH*/resetButton = document.getElementById('resetButton');


function /*OLD*/autocomplete(inp, arr, role) {
    allInputsWithLists[role] = inp.id;
    let currentFocus = -1;

    inp.addEventListener('click', function () {
        searchAndUpdateList(inp.value);
        return;
    })

    inp.addEventListener('input', function () {
        currentFocus = -1;
        closeBrotherList();
        searchAndUpdateList(inp.value);
        return;
    })

    inp.addEventListener('keydown', function (e) {
        const divList = document.getElementById(this.id + "-autocomplete-list");
        if (!divList) return false;
        const itemsArr = divList.getElementsByTagName("div");
        switch (e.code) {
            case 'ArrowDown':
                currentFocus++;
                addActive(itemsArr);
                break;
            case 'ArrowUp':
                currentFocus--;
                addActive(itemsArr);
                break;
            case 'Enter':
                if (currentFocus > -1) {
                    if (itemsArr) { itemsArr[currentFocus].click() };
                }
                break;
        }
        return;
    })

    function addActive(list) {
        if (!list) return false;
        removeActive(list);
        if (currentFocus >= list.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = list.length - 1;
        list[currentFocus].classList.add("autocomplete-active");
        list[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    function removeActive(list) {
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove("autocomplete-active");
        }
    }

    function searchAndUpdateList(input) {
        let filtereedArray;
        if (input) {
            filtereedArray = arr.reduce((filtered, item) => {
                const asStr = item.toString()
                const index = asStr.toUpperCase().search(input.toUpperCase());
                if (index >= 0) {
                    const strStart = asStr.substring(0, index)
                    const strBold = asStr.substring(index, index + input.length)
                    const strEnd = asStr.substring(index + input.length)
                    const newItem = document.createElement('div');
                    newItem.innerHTML = `${strStart}<strong>${strBold}</strong>${strEnd}`;
                    newItem.value = asStr;
                    filtered.push(newItem)
                }
                return filtered;
            }, [])
        } else {
            filtereedArray = arr.filter(item => {
                const asStr = item.toString()
                const index = asStr.toUpperCase().search(input.toUpperCase());
                return index >= 0;
            })
        }
        createAndAppendList(filtereedArray, inp)
    }

    function createAndAppendList(arr, brotherNode) {
        const divList = document.createElement('div');
        divList.setAttribute('id', brotherNode.id + '-autocomplete-list');
        divList.classList.add('autocomplete-items', 'rounded');
        arr.forEach(item => {
            createAndAppendItem(item, divList);
        });
        brotherNode.parentNode.appendChild(divList);
        return;
    }

    function createAndAppendItem(item, parentNode) {
        const divItem = document.createElement('div');
        divItem.innerHTML = item.innerHTML || item;
        divItem.value = item.value || item;
        divItem.addEventListener('click', function () {
            setInputValue(divItem.value);
        })
        parentNode.appendChild(divItem);
        return;
    }

    function setInputValue(val) {
        inp.value = val;
        closeBrotherList();
        return;
    }

    function closeBrotherList() {
        const commonParent = inp.parentNode
        const lists = commonParent.querySelectorAll('#' + inp.id + '-autocomplete-list');
        lists.forEach(list => commonParent.removeChild(list));
        return;
    }
}

function /*OLD*/closeOpenedLists(e) {
    for (const [role, inpId] of Object.entries(allInputsWithLists)) {
        const inp = document.getElementById(inpId);
        if (inp != e.target) {
            const listToClose = document.getElementById(inp.id + '-autocomplete-list');
            if (listToClose) listToClose.parentElement.removeChild(listToClose);
        }
    }
}

async function /*OLD*//*TODO_DRY*/getAvailableNames() {
    if (yearsPick.value && weeksPick.value) {
        const response = await fetch('/api/schedules/getNames?' + new URLSearchParams({
            year: yearsPick.value,
            weeknum: weeksPick.value
        }))
        const availableNames = await response.json()
        return availableNames;
    }
}

async function /*NEW*//*TODO_DRY*/getAvailableNamesNEW() {
    if (yearsField.value && weeksField.value) {
        const response = await fetch('/api/schedules/getNames?' + new URLSearchParams({
            year: yearsField.value,
            weeknum: weeksField.value
        }))
        const availableNames = await response.json()
        return availableNames;
    }
}

async function /*NEW*//*TODO_DRY*/getAvailableWeeksNEW() {
    if (yearsField.value) {
        const response = await fetch('/api/schedules/getWeeks?' + new URLSearchParams({
            year: yearsField.value,
        }))
        const availableWeeks = await response.json()
        return availableWeeks;
    }
}

async function /*NEW*//*TODO_DRY*/getAvailableYearsNEW() {
    const response = await fetch('/api/schedules/getYears');
    const availableYears = await response.json()
    return availableYears;
}

function /*NEW*/attachDataId() {
    const dataId = optionMap.get(namesField.value);
    if (dataId) {
        namesField.dataset.id = dataId;
    } else {
        delete namesField.dataset.id;
    }
}

function /*NEW*/clearList(list) {
    list.textContent = '';
}

function /*NEW*/loadNameList(availableNames) {
    /*NEW*/clearList(namesList);
    if (availableNames) {
        availableNames.forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name.name);
            option.setAttribute('data-id', name._id);
            namesList.appendChild(option)
            optionMap.set(option.value, option.dataset.id);
        })
        // const allOptions = document.querySelectorAll('#names-list-temp option');
        // allOptions.forEach(opt => {
        //     optionMap.set(opt.value, opt.dataset.id);
        // })
    }
}

function /*NEW*/loadSimpleList(listElement, arr) {
    /*NEW*/clearList(listElement);
    arr.forEach(item => {
        const option = document.createElement('option');
        option.setAttribute('value', item);
        listElement.appendChild(option)
    })
}

async function /*NEW*/refreshYears() {
    console.log('refresh years')
    // TODO if current year is not in year (same for weeks)
    const years = await getAvailableYearsNEW()
    /*NEW*/loadSimpleList(/*NEW*/yearsList, years);
    /*NEW*/weeksField.value = '';
    /*NEW*/namesField.value = '';
    /*NEW*/refreshWeeks();
}

async function /*NEW*/refreshWeeks() {
    console.log('refresh weeks')
    /*NEW*/namesField.value = '';
    const weeks = await /*NEW*/getAvailableWeeksNEW()
    /*NEW*/loadSimpleList(weeksList, weeks);
    /*NEW*/refreshNames();
}

async function /*NEW*/refreshNames() {
    console.log('refresh names')
    const availableNames = await /*NEW*/getAvailableNamesNEW();
    /*NEW*/loadNameList(availableNames);
}

async function /*OLD*/refreshNamesOLD() {
    const availableNames = await /*OLD*/getAvailableNames();
    /*OLD*/autocomplete(namesPick, availableNames, 'names');
}

async function /*BOTH*/fetchAndLoadForm(id = '') {
    if (!id) id = namesField.dataset.id;
    // const id = namesField.dataset.id;
    if (!id) return false;
    const wrappedSchedule = await /*BOTH*/fetchSchedule(id);
    /*BOTH*/loadSchedule(wrappedSchedule);
    return;
}

async function /*BOTH*/fetchSchedule(id) {
    const result = await fetch(`/api/schedules/${id}`)
    const wrappedSchedule = await result.json();
    return wrappedSchedule;
}

function /*BOTH*/loadSchedule(wrappedSchedule) {
    const comment = wrappedSchedule.comment;
    const timeSubmittedISO = wrappedSchedule.timeSubmitted;
    const timeSubmitted = new Date(timeSubmittedISO)
    const schedule = wrappedSchedule.schedule;

    for (let i = 1; i <= 7; i++) {
        const day = 'day' + i;
        const dailySchedule = schedule[day];

        const morningReg = dailySchedule.morning.reg;
        const morningOt = dailySchedule.morning.ot;
        const noonReg = dailySchedule.noon.reg;
        const nightReg = dailySchedule.night.reg;
        const nightOt1 = dailySchedule.night.ot1;
        const nightOt2 = dailySchedule.night.ot2;

        const cbMorningReg = document.querySelector(`#shifts\\[${i}\\]\\[morning\\]\\[reg\\]`)
        const cbMorningOt = document.querySelector(`#ots\\[${i}\\]\\[morning\\]\\[ot1\\]`)
        const cbNoonReg = document.querySelector(`#shifts\\[${i}\\]\\[noon\\]\\[reg\\]`)
        const cbNightReg = document.querySelector(`#shifts\\[${i}\\]\\[night\\]\\[reg\\]`)
        const cbNightOt1 = document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot1\\]`)
        const cbNightOt2 = document.querySelector(`#ots\\[${i}\\]\\[night\\]\\[ot2\\]`)

        cbMorningReg.checked = morningReg;
        cbMorningOt.checked = morningOt;
        cbNoonReg.checked = noonReg;
        cbNightReg.checked = nightReg;
        cbNightOt1.checked = nightOt1;
        cbNightOt2.checked = nightOt2;
    }

    const elComment = document.querySelector('#comment');
    elComment.innerHTML = comment;

    const yearSubmit = timeSubmitted.getFullYear().toString().slice(2);
    const monthSubmit = (timeSubmitted.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const dateSubmit = timeSubmitted.getDate().toString().padStart(2, '0');
    const hoursSubmit = timeSubmitted.getHours().toString().padStart(2, '0');
    const minutesSubmit = timeSubmitted.getMinutes().toString().padStart(2, '0');
    const elDateSubmitted = document.querySelector('#dateSubmitted');
    const elTimeSubmitted = document.querySelector('#timeSubmitted');
    elDateSubmitted.innerHTML = `${dateSubmit}/${monthSubmit}/${yearSubmit}`;
    elTimeSubmitted.innerHTML = `${hoursSubmit}:${minutesSubmit}`;

    return true;
}

function /*BOTH*/clearSchedule() {
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

window.addEventListener('load', async () => {

    /*NEW*/yearsField.value = /*BOTH*/currentYear;
    /*NEW*/weeksField.value = +/*BOTH*/currentWeek + 1;
    await /*NEW*/refreshYears()
    .then(() => {/*NEW*/yearsField.value = /*BOTH*/currentYear;})
    // .then(() => {/*NEW*/refreshWeeks()})
    .then(() => {/*NEW*/weeksField.value = /*BOTH*/+currentWeek + 1;})
    // .then(() => {/*NEW*/refreshNames()})
    .catch(e => console.error(e));

    /*OLD*/autocomplete(/*OLD*/yearsPick, years, 'years');
    /*OLD*/autocomplete(/*OLD*/weeksPick, weeks, 'weeks');
    /*OLD*/autocomplete(/*OLD*/namesPick, [], 'names');

    /*OLD*/yearsPick.value = /*BOTH*/currentYear;
    /*OLD*/weeksPick.value = +/*BOTH*/currentWeek + 1;

})

document.addEventListener('click', e => /*OLD*/closeOpenedLists(e))

/*NEW*/updateNamesBtn.addEventListener('click', () => /*NEW*/refreshNames())
/*NEW*/updateFormBtn.addEventListener('click', () => /*BOTH*/fetchAndLoadForm(namesField.dataset.id))
/*NEW*/namesField.addEventListener('blur', () => /*NEW*/attachDataId())
/*NEW*/namesField.addEventListener('blur', () => /*NEW*/fetchAndLoadForm(namesField.dataset.id))
/*NEW*/namesField.addEventListener('input', () => /*NEW*/clearSchedule())
/*NEW*/yearsField.addEventListener('change', () => /*NEW*/refreshYears())
/*NEW*/weeksField.addEventListener('change', () => /*NEW*/refreshWeeks())

/*OLD*/namesButton.addEventListener('click', () => /*OLD*/getAvailableNames())
/*OLD*/updateButton.addEventListener('click', () => /*NEW*/fetchAndLoadForm()) /*👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻*/

/*BOTH*/resetButton.addEventListener('click', () => /*BOTH*/clearSchedule())

