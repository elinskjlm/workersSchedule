const checkboxes = document.querySelectorAll('input[type="checkbox"][name*="[night]"], input[type="checkbox"][name*="[morning]"]'); // Select all night and morning shift checkboxes
const otButtons = document.querySelectorAll('.ot-button'); // Select all OT buttons
const weekNum = 24; // TEMP
const year = 2024; // TEMP
const allOtRows = document.querySelectorAll('.row-ot');
const allCheckboxes = document.querySelectorAll('.ot-toggle, .shift-toggle');
const allOtBoxes = document.querySelectorAll('.ot-toggle');
const allShiftBoxes = document.querySelectorAll('.shift-toggle');
const fullNameElement = document.getElementById('fullName');
const commentElement = document.getElementById('comment');
const submitBtn = document.getElementById("submitBtn");
const regexName = /^[\u0590-\u05FF\s'"\`\-().\[\]]{2,}$/;

const schedule = {
  timeSubmitted: "",
  regardingWeek: [weekNum, year],
  name: "",
  schedule: {
  },
  comment: "",
  status: 0
}

for (let day = 1; day <= 7; day++) {
  schedule.schedule["day" + day] = {
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
}
onPageLoad();


allCheckboxes.forEach(checkbox => {
  const day = checkbox.dataset.day;
  const dayInSche = schedule.schedule["day" + day];
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


submitBtn.addEventListener("click", event => {
  schedule.timeSubmitted = new Date().toLocaleString();
  //regardingWeek is alredy populated
  if (checkName()){
    schedule.name = fullNameElement.value;
  } else {
    fullNameElement.scrollIntoView();
    event.preventDefault();
    event.stopPropagation();
    return
  }
  schedule.comment = commentElement.value;
});

fullNameElement.addEventListener('change', () => {
  checkName();
})

const checkName = () => {
  const fullName = fullNameElement.value.trim();
  const isNameOk = regexName.test(fullName);
  if (isNameOk) {
    fullNameElement.classList.remove('border-danger');
    fullNameElement.value = fullName;
    schedule.name = fullName;
  } else {
    fullNameElement.classList.add('border-danger');
  }
  return isNameOk;
}

