// Reference: http://stackoverflow.com/a/13146828/1300992
let getDaysInMonth = (month, year) => {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

let getWorkDaysInMonth = (month, year) => {
  let daysInMonth = getDaysInMonth(month, year);
  let workDaysInMonth = daysInMonth.filter((day) => day.getDay() >= 1 && day.getDay() <= 5);
  return workDaysInMonth;
};

let getNumberOfWorkDaysInMonth = (month, year) => {
  let workDaysInMonth = getWorkDaysInMonth(month, year);
  let numberOfWorkDaysInMonth = workDaysInMonth.length;
  return numberOfWorkDaysInMonth;
};

export default {
  COLORS: Object.freeze({
    green: "#54b242",
    red: "#c0392b"
  }),

  MONTHS: ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"],

  getDaysInMonth: getDaysInMonth,

  getWorkDaysInMonth: getWorkDaysInMonth,

  getNumberOfWorkDaysInMonth: getNumberOfWorkDaysInMonth
};
