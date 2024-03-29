const checkboxes = document.querySelectorAll('input[type="checkbox"][name*="[night]"], input[type="checkbox"][name*="[morning]"]'); // Select all night and morning shift checkboxes
const otButtons = document.querySelectorAll('.ot-button'); // Select all OT buttons
const weekNum = 13; // TEMP
const year = 2024; // TEMP


function onPageLoad() {
  const { startDate, endDate } = getWeekStartEndDates(year, weekNum);
  document.getElementById('weeknum').innerHTML = weekNum;
  document.getElementById('start-date').innerHTML = startDate;
  document.getElementById('end-date').innerHTML = endDate;
}
onPageLoad();

const schedule = {
  id: 0,
  timeSubmitted: "",
  weekYear: [weekNum, year],
  name: "",
  schedule: {
    day0: {
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
      },
    },
  },
  comment: "",
  status: 0
}
schedule.name = "sgsrggr";
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



checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    const otRow = this.closest('.row-shifts').nextElementSibling; // Get the next sibling row (OT row)
    const otButtons = otRow.querySelectorAll('.ot-button.' + (this.name.includes('night') ? 'night' : 'morning')); // Select relevant OT buttons based on checkbox type

    otButtons.forEach(button => {
      if (this.checked) {
        button.classList.remove('disabled'); // Enable OT buttons
        otRow.style.display = 'flex'; // Show OT row
      } else {
        button.classList.add('disabled'); // Disable OT buttons
        button.value = ''; // Reset value
        if (!otRow.querySelector('.ot-button:not(.disabled)')) {
          otRow.style.display = 'none'; // Hide OT row if no enabled OT buttons
        }
      }
    });
  });
});


otButtons.forEach(button => {
  button.addEventListener('click', function () {
    if (this.value !== 'on') {
      this.value = 'on';
      this.classList.add('btn-primary');
    } else {
      this.value = ''; // Reset value (if needed)
      this.classList.remove('btn-primary');
    }

  });
});





document.getElementById("submitBtn").addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  schedule.timeSubmitted = new Date().toLocaleString();
  console.log(document.getElementById('ots[2][night][ot1]'))
  document.getElementById('ots[2][night][ot1]').focus();
  // const aaa = document.getElementById('day1[morning][reg]');
  // console.log(aaa.checked);
  // aaa.focus();
  // validateForm();
  console.log(schedule);
});



function checkName(name) {
  name = name.trim();
  return /^[\u0590-\u05FF\s]{2,}$/.test(name);
}

const fullNameElement = document.getElementById('fullName');

function validateForm() {
  const fullName = fullNameElement.value.trim();
  if (checkName(fullName)) {
    schedule.name = fullName;
  } else {
    fullNameElement.focus();
    if (typeof fullNameElement.scrollIntoViewIfNeeded === 'function') {
      fullNameElement.scrollIntoViewIfNeeded({ behavior: "smooth" }); // Scroll smoothly if needed
    } else {
      fullNameElement.scrollIntoView({ behavior: "smooth" }); // Fallback for older browsers
    }
    window.alert('name!!');
    return false;
  }
}


