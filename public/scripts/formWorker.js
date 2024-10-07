const checkboxes =      document.querySelectorAll('input[type="checkbox"][name*="[night]"], input[type="checkbox"][name*="[morning]"]'); // Select all night and morning shift checkboxes
const otButtons =       document.querySelectorAll('.ot-button');
const allOtRows =       document.querySelectorAll('.row-ot');
const allCheckboxes =   document.querySelectorAll('.ot-toggle, .shift-toggle');
const allOtBoxes =      document.querySelectorAll('.ot-toggle');
const allShiftBoxes =   document.querySelectorAll('.shift-toggle');
const form =            document.querySelector('form');
const fieldset =        document.querySelector('fieldset');
const fullNameElement = document.getElementById('fullName');
const commentElement =  document.getElementById('comment');
const submitBtn =       document.getElementById("submitBtn");
const submitSpan =      document.getElementById("submitSpan");

const nameFrame = {
  regex: /^[\u0590-\u05FF\s.,;`'"-()\[\]]{2,}$/,
  message: 'שם חייב להיות לפחות 2 אותיות, רק בעברית',
}
const commentFrame = {
  regex: /^[\u0590-\u05FF\s.,;`'"-()\[\]]*$/,
  message: 'תגובה צריכה להיות רק בעברית',
}
// const isLive =    isLiveData;
const isLive =    isLiveData === 'true';
const weekNum =   +currentWeekData + 1; // TODO last week of the year
const year =      currentYearData;

const scheduleWrapper = {
  timeSubmitted: "",
  weekNum,
  year,
  name: "",
  schedule: {},
  comment: "",
}

for (let day = 1; day <= 7; day++) {
  scheduleWrapper.schedule["day" + day] = {
    morning: {
      reg: false,
      ot1: false
    },
    noon: {
      reg: false
    },
    night: {
      reg: false,
      ot1: false,
      ot2: false
    }
  }
}

function onPageLoad() {
  const { startDate, endDate } = getWeekStartEndDates(year, weekNum);
  document.getElementById('weeknum').innerHTML = weekNum;
  document.getElementById('start-date').innerHTML = startDate;
  document.getElementById('end-date').innerHTML = endDate;
  fieldset.disabled = !isLive;
  setPopover();
}
onPageLoad();

allCheckboxes.forEach(checkbox => {
  const day = checkbox.dataset.day;
  const dayInSche = scheduleWrapper.schedule["day" + day];
  const shift = checkbox.dataset.shift;
  const category = checkbox.dataset.category;
  const otRow = document.querySelector(`div.row-ot.day-${day}`);
  const otBoxes = document.querySelectorAll(`input[data-day="${day}"][data-shift="${shift}"][data-category*="ot"]`)

  checkbox.addEventListener('change', () => {
    dayInSche[shift][category] = checkbox.checked;
    const showRowDay = dayInSche["morning"]["reg"] || dayInSche["night"]["reg"];
    const ableOtShift = dayInSche[shift]["reg"];
    if (!ableOtShift) {
      otBoxes.forEach(box => box.checked = false);
      ['ot1', 'ot2'].forEach(key => dayInSche[shift][key] && (dayInSche[shift][key] = false));
    }
    otBoxes.forEach(box => box.disabled = !ableOtShift);
    showRowDay ? otRow.classList.remove('hidden') : otRow.classList.add('hidden');
  })
})

function getWeekStartEndDates(year, weekNum) {
  // Create a Date object representing the first day of the year.
  const d = new Date(year, 0, 1);
  // Get the day of the week (0 for Sunday, 6 for Saturday).
  const day = d.getDay();
  // Set the date to the first Thursday of the year.
  d.setDate(d.getDate() - (day + (weekNum === 0 ? 6 : 0)) % 7);
  // Add the number of weeks multiplied by 7 days to get the start date of the desired week.
  d.setDate(d.getDate() + (weekNum - 1) * 7);
  // Create a copy of the start date for the end date calculation.
  const endDate = new Date(d);
  // Add 6 days to get the end date (Saturday).
  endDate.setDate(endDate.getDate() + 6);
  return {
    startDate: `${d.toLocaleDateString("he-IL", { day: '2-digit' })}/${d.toLocaleDateString("he-IL", { month: '2-digit' })}`,
    endDate: `${endDate.toLocaleDateString("he-IL", { day: '2-digit' })}/${endDate.toLocaleDateString("he-IL", { month: '2-digit' })}`
  };
}

fullNameElement.addEventListener('change', () => {
  const name = checkField(fullNameElement, nameFrame);
  if (name) scheduleWrapper.name = name;
})

commentElement.addEventListener('change', () => {
  const comment = checkField(commentElement, commentFrame);
  if (comment) scheduleWrapper.comment = comment;
})

const checkField = (element, fieldFrame) => {
  const value = element.value.trim();
  const itsOk = fieldFrame.regex.test(value);
  if (itsOk) {
    element.classList.remove('border-danger');
    element.value = value;
    submitBtn.classList.remove('disabled');
    setPopover();
    return value
  } else {
    element.classList.add('border-danger');
    showToast('שים לב', fieldFrame.message);
    submitBtn.classList.add('disabled');
    setPopover();
    return false;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isLive) {
    scheduleWrapper.timeSubmitted = new Date().toLocaleString();
    //weekNum and year are already populated
    if (checkField(fullNameElement, nameFrame)) {
      scheduleWrapper.name = fullNameElement.value;
    } else {
      fullNameElement.scrollIntoView();
      e.stopPropagation();
      return
    }
    // scheduleWrapper.comment = commentElement.value;
    const asStr = JSON.stringify(scheduleWrapper)
    try {
      const response = await fetch('/api/v1/schedules', {
        method: 'POST',
        body: asStr,
        headers: {
          'Content-type': 'application/json',
        },
      })
      const answer = await response.json();
      if (answer.success) {
        window.location.replace(answer.redirect || '/thankyou');
      } else {
        showToast('שגיאה', answer.msgHeb)
      }
    } catch (error) {
      showToast('שגיאה', error)
      console.error('Error fetching', error);
    }
  }
})

function setPopover() {
  const popoverElement = document.querySelector('[data-bs-toggle="popover"]')
  const popover = new bootstrap.Popover(popoverElement)
  if (fieldset.disabled) {
    submitSpan.dataset.bsToggle = 'popover'
    submitSpan.dataset.bsContent = 'הטופס נעול להגשה'
  } else if (submitBtn.classList.contains('disabled')) {
    submitSpan.dataset.bsToggle = 'popover'
    submitSpan.dataset.bsContent = 'וודא שאין בעיה בשדות "שם" ו"הערות מיוחדות"'
  } else {
    popover.disable()

  }
}