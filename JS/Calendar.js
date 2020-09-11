const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayOfWeeksShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayOfWeeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const calendarBody = document.querySelector('.calendar-body');
const selectedDayBox = document.querySelector('.selected-day');
const selectedDateFullBox = document.querySelector('.selected-date-full');
const todayButton = document.querySelector('.today');
let todayDate = new Date();
let currentYear = todayDate.getFullYear();
let currentMonth = monthArray[todayDate.getMonth()];
let selectedMonthYear;
let monthDatesBox;
let nextMonth;
let previousMonth;
let stillToday = true;
let lastMonthOffset = 0;
let lastDate = todayDate.getDate();

function monthDates(chosenDate) {
    chosenDate.setDate(lastDate);
    monthDatesBox.innerHTML = "";
    lastMonthOffset = 0;

    todayDate = new Date();

    if (chosenDate.getDate() == todayDate.getDate() && chosenDate.getMonth() == todayDate.getMonth() && chosenDate.getFullYear() == todayDate.getFullYear()) stillToday = true;
    else stillToday = false;
    nextDay();

    let firstDay = new Date(chosenDate.getTime() - ((chosenDate.getDate() - 1) * 24 * 60 * 60 * 1000));
    dayOfMonths[1] = ((chosenDate.getFullYear() / 4).toString().split('.').length == 1) ? 29 : 28;

    let startDay = firstDay.getDay();
    let startMonth = firstDay.getMonth();

    for (let i = 1; i <= startDay; i++) {
        if (startMonth == 0) startMonth = monthArray.length;

        let date = document.createElement('div');
        date.classList.add('date');

        dateValue = document.createElement('span');
        dateValue.classList.add('past');
        dateValue.innerText = dayOfMonths[startMonth - 1] - (startDay - i);

        date.append(dateValue);
        monthDatesBox.append(date);
        lastMonthOffset = i;
        startMonth = firstDay.getMonth();
    }

    const rowsNeeded = (Math.ceil((dayOfMonths[startMonth] + startDay) / 7) == 5) ? "five" : "six";

    monthDatesBox.className = "month-dates";
    monthDatesBox.classList.add(rowsNeeded);

    for (let i = 1; i <= dayOfMonths[startMonth]; i++) {
        let date = document.createElement('div');
        date.classList.add('date');

        dateValue = document.createElement('span');
        dateValue.innerText = i;

        if (i == chosenDate.getDate()) dateValue.classList.add('selected-date');

        date.append(dateValue);
        monthDatesBox.append(date);
    }

    let extra = 0;

    if (rowsNeeded == "five") extra = 5;
    else if (rowsNeeded == "six") extra = 6;
    extra = ((dayOfWeeksShort.length * extra) - (dayOfMonths[startMonth] + startDay));

    for (let i = 1; i <= extra; i++) {
        let date = document.createElement('div');
        date.classList.add('date');

        dateValue = document.createElement('span');
        dateValue.classList.add('future');
        dateValue.innerText = i;

        date.append(dateValue);
        monthDatesBox.append(date);
    }

    displayDate(chosenDate.getDate(), chosenDate.getMonth(), chosenDate.getFullYear());
}

function displayDate(date, month, year) {
    let suffix = "th";

    switch (date) {
        case 1:
        case 21:
        case 31:
            suffix = "st";
            break;
        case 2:
        case 22:
            suffix = "nd";
            break;
        case 3:
        case 23:
            suffix = "rd";
            break;
    }
    selectedDayBox.innerText = dayOfWeeks[(parseInt(date) + (lastMonthOffset - 1)) % 7];
    selectedDateFullBox.innerText = date + suffix + ' ' + monthArray[month] + ', ' + year;
}

function createYears() {
    resetCalendarBox();
    const decade = Math.floor(currentYear / 10) * 10;

    selectedMonthYear.parentElement.classList.add('out');
    selectedMonthYear.innerText = decade - 1 + ' - ' + (decade + 10);

    const yearsBox = document.createElement('section');
    yearsBox.classList.add('years');

    yearsBox.addEventListener('click', (e) => {
        if (e.target.classList.contains("year") && !e.target.classList.contains("selected")) {
            currentYear = parseInt(e.target.innerText);
            selectedMonthYear.parentElement.classList.remove('out');
            createMonths();
        }
    });

    let yearBox = document.createElement('div');
    yearBox.classList.add('year');
    yearBox.classList.add('past');
    yearBox.innerText = decade - 1;
    yearsBox.append(yearBox);

    for (let i = decade; i < (decade + 10); i++) {
        const yearBox = document.createElement('div');
        yearBox.classList.add('year');

        if (i == currentYear) yearBox.classList.add('selected');

        yearBox.innerText = i;

        yearsBox.append(yearBox);
    }

    yearBox = document.createElement('div');
    yearBox.classList.add('year');
    yearBox.classList.add('future');
    yearBox.innerText = decade + 10;
    yearsBox.append(yearBox);

    calendarBody.classList = "calendar-body years-list";
    calendarBody.append(yearsBox);
}

function createMonths() {
    resetCalendarBox();
    selectedMonthYear.innerText = currentYear;

    const monthsBox = document.createElement('section');
    monthsBox.classList.add('months');

    monthsBox.addEventListener('click', (e) => {
        if (e.target.classList.contains("month")) {
            currentMonth = monthArray[Array.from(monthsBox.children).indexOf(e.target)];

            createDays(new Date(currentMonth + ', ' + currentYear));
        }
    });

    monthArray.forEach(month => {
        const monthBox = document.createElement('div');
        monthBox.classList.add('month');

        if (month == currentMonth) monthBox.classList.add('selected');

        monthBox.innerText = month;

        monthsBox.append(monthBox);
    });

    calendarBody.classList = "calendar-body months-list";
    calendarBody.append(monthsBox);
}

function createDays(date) {
    resetCalendarBox();

    currentMonth = monthArray[date.getMonth()];
    currentYear = date.getFullYear();

    const daysBox = document.createElement('section');
    daysBox.classList.add('month-days');

    dayOfWeeksShort.forEach(dayOfWeek => {
        const day = document.createElement('div');
        day.classList.add('day');
        day.innerText = dayOfWeek;

        daysBox.append(day);
    });

    calendarBody.classList = "calendar-body days-list";
    calendarBody.append(daysBox);

    selectedMonthYear.innerText = currentMonth + ', ' + currentYear;
    createDates(date);
}

function createDates(date) {
    const datesBox = document.createElement('section');
    datesBox.classList.add('month-dates');

    calendarBody.classList = "calendar-body days-list";
    calendarBody.append(datesBox);

    datesBox.addEventListener('click', (e) => {
        if (!e.target.classList.contains('past') && !e.target.classList.contains('future') && e.target.tagName == "SPAN") {
            document.querySelector('.selected-date').classList.remove('selected-date');
            e.target.classList.add('selected-date');

            lastDate = parseInt(e.target.innerText);
            todayDate = new Date();

            if (lastDate == todayDate.getDate() && monthArray.indexOf(currentMonth) == todayDate.getMonth() && currentYear == todayDate.getFullYear()) stillToday = true;
            else stillToday = false;
            nextDay();

            displayDate(lastDate, monthArray.indexOf(currentMonth), currentYear);
        }
    });

    monthDatesBox = datesBox;
    monthDates(date);
}

function resetCalendarBox() {
    calendarBody.innerHTML = "";

    const selected = document.createElement('section');
    selected.classList.add('selected');
    selected.innerHTML += '<div class="previous-month"><img src="./Images/Chevron-Left.svg" alt="&lt;"></div><div class="selected-month-year"></div><div class="next-month"><img src="./Images/Chevron-Right.svg" alt="&gt;"></div>';

    selectedMonthYear = selected.querySelector('.selected-month-year');
    nextMonth = selected.querySelector('.next-month');
    previousMonth = selected.querySelector('.previous-month');

    selectedMonthYear.addEventListener('click', () => {
        if (calendarBody.classList.contains('months-list') || calendarBody.classList.contains('days-list')) stillToday = false;

        if (calendarBody.classList.contains('days-list')) createMonths();
        else if (calendarBody.classList.contains('months-list')) createYears();
    });

    nextMonth.addEventListener('click', () => {
        currentMonthIndex = monthArray.indexOf(currentMonth);

        if (currentMonthIndex == monthArray.length - 1) {
            ++currentYear;
            currentMonthIndex = -1;
        }

        if (calendarBody.classList.contains('days-list')) {
            currentMonth = monthArray[currentMonthIndex += 1];

            selectedMonthYear.innerText = currentMonth + ', ' + currentYear;
            monthDates(new Date(currentMonth + ', ' + currentYear));
        } else if (calendarBody.classList.contains('months-list')) {
            ++currentYear;
            selectedMonthYear.innerText = currentYear;
            createMonths();
        }
    });

    previousMonth.addEventListener('click', () => {
        currentMonthIndex = monthArray.indexOf(currentMonth);

        if (currentMonthIndex == 0) {
            currentYear -= 1;
            currentMonthIndex = monthArray.length;
        }

        if (calendarBody.classList.contains('days-list')) {
            currentMonth = monthArray[currentMonthIndex -= 1];
            selectedMonthYear.innerText = currentMonth + ', ' + currentYear;

            monthDates(new Date(currentMonth + ', ' + currentYear));
        } else if (calendarBody.classList.contains('months-list')) {
            currentYear -= 1;
            selectedMonthYear.innerText = currentYear;
            createMonths();
        }
    });

    calendarBody.append(selected);
}

function nextDay() {
    let nextDayTimer;
    clearInterval(nextDayTimer);
    todayDate = new Date();

    nextDayTimer = setInterval(() => {
        if (stillToday) {
            const timeLeft = new Date();

            if (!timeLeft.getHours() && !timeLeft.getMinutes() && !timeLeft.getSeconds()) {
                lastDate = timeLeft.getDate();
                createDays(timeLeft);
            }
        } else clearInterval(nextDayTimer);
    }, 1000);
}

todayButton.addEventListener('click', () => {
    todayDate = new Date();
    lastDate = todayDate.getDate();
    createDays(todayDate);
});

addEventListener('DOMContentLoaded', createDays(todayDate));