function autocomplete(inp, arr) {

    allInputsWithLists.push(inp.id)
    let currentFocus = -1;

    inp.addEventListener('click', function (e) {
        searchAndUpdateList(inp.value);
        return;
    })

    inp.addEventListener('input', function (e) {
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
                const index = item.toUpperCase().search(input.toUpperCase());
                if (index >= 0) {
                    const strStart =    item.substring(0, index)
                    const strBold =     item.substring(index, index + input.length)
                    const strEnd =      item.substring(index + input.length)
                    const newItem =     document.createElement('div');
                    newItem.innerHTML = `${strStart}<strong>${strBold}</strong>${strEnd}`;
                    newItem.value = item;
                    filtered.push(newItem)
                }
                return filtered;
            }, [])
        } else {
            filtereedArray = arr.filter(item => {
                const index = item.toUpperCase().search(input.toUpperCase());
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
        divItem.addEventListener('click', function (e) {
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

const allInputsWithLists = [];
document.addEventListener('click', function (e) {
    allInputsWithLists.forEach(inpId => {
        const inp = document.getElementById(inpId);
        if (inp != e.target) {
            const listToRemove = document.getElementById(inp.id + '-autocomplete-list');
            if (listToRemove) listToRemove.parentElement.removeChild(listToRemove);
        }
    })
})

const years = yearsData.split(',');
const weeks = weeksData.split(',');
const names = namesData.split(',');
const currentYear = currentYearData;
const currentWeek = currentWeekData;

const yearsPick = document.getElementById('yearsPick');
const weeksPick = document.getElementById('weeksPick');
const namesPick = document.getElementById('namesPick');

autocomplete(yearsPick, years);
autocomplete(weeksPick, weeks);
autocomplete(namesPick, names);

yearsPick.value = currentYear;
weeksPick.value = +currentWeek + 1;