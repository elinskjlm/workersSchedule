const weekInput =       document.getElementById('weekInput');
const calendar =        document.getElementById('calendar');
const prevYear =        document.getElementById('prevYear');
const nextYear =        document.getElementById('nextYear');
const prevMonth =       document.getElementById('prevMonth');
const nextMonth =       document.getElementById('nextMonth');
const yearDisplay =     document.getElementById('yearDisplay');
const monthDisplay =    document.getElementById('monthDisplay');
const weeksContainer =  document.getElementById('weeks');
const todayButton =     document.getElementById('todayButton');

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Initial display of current year and month
yearDisplay.innerText = currentYear;

weekInput.addEventListener('click', () => {
    calendar.style.display = 'block';
    createCalendar(currentYear, currentMonth);
});

document.addEventListener('click', (e) => {
    if (!calendar.contains(e.target) && e.target !== weekInput) {
        calendar.style.display = 'none';
    }
});

prevYear.addEventListener('click', () => {
    currentYear--;
    yearDisplay.innerText = currentYear;
    createCalendar(currentYear, currentMonth);
});

nextYear.addEventListener('click', () => {
    currentYear++;
    yearDisplay.innerText = currentYear;
    createCalendar(currentYear, currentMonth);
});

prevMonth.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
        yearDisplay.innerText = currentYear;
    }
    createCalendar(currentYear, currentMonth);
});

nextMonth.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
        yearDisplay.innerText = currentYear;
    }
    createCalendar(currentYear, currentMonth);
});

todayButton.addEventListener('click', () => {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    yearDisplay.innerText = currentYear;
    createCalendar(currentYear, currentMonth);
});

const hebrewDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const hebrewMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

function createCalendar(year, month) {
    weeksContainer.innerHTML = '';
    monthDisplay.innerText = hebrewMonths[month];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = '<div class="d-flex">';
    html += '<div class="week-number fw-bold">שבוע</div>';
    html += '<div class="separator"></div>';
    hebrewDays.forEach(day => {
        html += `<div class="day fw-bold">${day}</div>`;
    });
    html += '</div>';

    let day = 1;
    let dayInNextMonth = 1;

    // Calculate the ISO week number for the given date
    function getISOWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    for (let i = 0; i < 6; i++) { // weeks
        let weekStartDate = new Date(year, month, day);
        let weekNum = getISOWeekNumber(weekStartDate);

        html += '<div class="d-flex week" data-week="' + weekNum + '" data-year="' + year + '">';
        html += `<div class="week-number fw-bold">${weekNum}</div>`;
        html += '<div class="separator"></div>';

        for (let j = 0; j < 7; j++) { // days
            if (i === 0 && j < firstDayOfMonth) {
                html += `<div class="day muted">${daysInPrevMonth - firstDayOfMonth + j + 1}</div>`;
            } else if (day > daysInMonth) {
                html += `<div class="day muted">${dayInNextMonth++}</div>`;
            } else {
                html += `<div class="day">${day}</div>`;
                day++;
            }
        }
        html += '</div>';
        if (day > daysInMonth && (i > 0 || (i === 0 && firstDayOfMonth === 0))) break;
    }

    weeksContainer.innerHTML = html;

    document.querySelectorAll('.week').forEach(week => {
        week.addEventListener('click', function() {
            const chosenYear = this.getAttribute('data-year')
            const chosenWeek = this.getAttribute('data-week');
            weekInput.value = chosenWeek + ',' + chosenYear;
            weekInput.dataset.week = chosenWeek;
            weekInput.dataset.year = chosenYear;
            calendar.style.display = 'none';
            const change = new Event('change', { bubbles: true });
            weekInput.dispatchEvent(change);
        });
    });
}

createCalendar(currentYear, currentMonth);