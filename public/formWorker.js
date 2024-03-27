const checkboxes = document.querySelectorAll('input[type="checkbox"][name*="[night]"], input[type="checkbox"][name*="[morning]"]'); // Select all night and morning shift checkboxes
const schedule = {
    "day1": {
        "morning": false,
        "otMorning": false,
        "noon": false,
        "night": false,
        "otNight1": false,
        "otNight2": false
    }
}


checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
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

const otButtons = document.querySelectorAll('.ot-button'); // Select all OT buttons

otButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.value !== 'on'){
            this.value = 'on';
            this.classList.add('btn-primary');
        } else {
            this.value = ''; // Reset value (if needed)
            this.classList.remove('btn-primary');
        }

    });
});
