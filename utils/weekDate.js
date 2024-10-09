function weeknumToDates (year, weekNum) {
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

function dateToWeeknum (date) {
    const givenDate = new Date(date);
    const janFirst = new Date(givenDate.getFullYear(), 0, 1);
    const daysSinceJanFirst = Math.floor((givenDate - janFirst) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil((daysSinceJanFirst + janFirst.getDay() + 1) / 7);
    return weekNumber;
}

module.exports = {
    currentDate: new Date(),
    get currentWeekday()    { return this.currentDate.getDay() },
    get currentFullYear()   { return this.currentDate.getFullYear() },
    get currentWeeknum()    { return dateToWeeknum(this.currentDate) },
    get nextWeekDate()      { return new Date (this.currentDate.getTime() + 1000 * 60 * 60 * 24 * 7) },
    get nextWeekYear()      { return this.nextWeekDate.getFullYear() },
    get nextWeeknum()       { return dateToWeeknum(this.nextWeekDate) },
    get nextWeekDates()     { return weeknumToDates(this.nextWeekYear, this.nextWeeknum) },
    weeknumToDates,
    dateToWeeknum,
}