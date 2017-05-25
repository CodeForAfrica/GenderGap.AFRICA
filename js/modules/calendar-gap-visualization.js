import * as d3 from "d3";

import utils from "../utilities";

let EXCHANGE_RATES = {};

// Convert original currency to USD and convert USD to the new currency.
let convertToCurrency = (value, originalCurrency, newCurrency) => {
  if (originalCurrency === newCurrency) return;

  if (newCurrency === "USD") {
    return value / EXCHANGE_RATES[originalCurrency];
  } else if (originalCurrency === "USD") {
    return value * EXCHANGE_RATES[newCurrency]
  } else {
    return convertToCurrency(convertToCurrency(value, originalCurrency, "USD"), "USD", newCurrency);
  }
};

let monthlyView = (salaryDifferenceInDays, workDaysInCurrentMonth, now, salaryIsLessThanAverage) => {
  let calendarGapVisualization = document.querySelector("#calendar-gap-visualization-monthly-view");
  let slider = calendarGapVisualization.closest(".slider");
  let sliderMaxWidth = parseInt(window.getComputedStyle(slider).maxWidth, 10) - parseInt(window.getComputedStyle(slider).paddingLeft, 10) - parseInt(window.getComputedStyle(slider).paddingRight, 10);
  calendarGapVisualization.style.maxHeight = sliderMaxWidth + "px";

  let numberOfWorkDaysInCurrentMonth = workDaysInCurrentMonth.length;

  let grid = calendarGapVisualization.querySelector(".grid");
  workDaysInCurrentMonth.forEach((workDay, i) => {
    let gridItem = document.createElement("div");
    gridItem.className = "grid__item";

    if (salaryIsLessThanAverage) {
      if (numberOfWorkDaysInCurrentMonth - i <= salaryDifferenceInDays) {
        gridItem.classList.add("grid__item--green-square");
      } else {
        gridItem.classList.add("grid__item--gray-square");
      }

      if (workDay.toDateString() === now.toDateString()) {
        gridItem.classList.add("grid__item--black-frame");
      }
    } else {
      if (i < salaryDifferenceInDays) {
        gridItem.classList.add("grid__item--red-square");
      }
    }

    grid.appendChild(gridItem);
  });

  calendarGapVisualization.classList.remove("visualization--hidden");
};

let yearlyView = (salaryDifferenceInDays, now) => {
  let calendarGapVisualization = document.querySelector("#calendar-gap-visualization-yearly-view");
  let slider = calendarGapVisualization.closest(".slider");
  let sliderMaxWidth = parseInt(window.getComputedStyle(slider).maxWidth, 10) - parseInt(window.getComputedStyle(slider).paddingLeft, 10) - parseInt(window.getComputedStyle(slider).paddingRight, 10);
  calendarGapVisualization.style.maxHeight = sliderMaxWidth + "px";

  let n = salaryDifferenceInDays;
  for (let i = 0; n > 0; i++) {
    let month = (now.getMonth() + i) % 12;
    let year = (now.getYear() + (now.getMonth() + i) / 12);

    let monthVisual = document.createElement("div");
    monthVisual.className = "visualization--calendar-gap__stacked-bars";
    calendarGapVisualization.appendChild(monthVisual);

    let monthName = document.createElement("div");
    monthName.className = "";
    monthName.textContent = utils.MONTHS[month];
    monthVisual.appendChild(monthName);

    let bars = document.createElement("div");
    bars.className = "stacked-bars";
    monthVisual.appendChild(bars);

    let numberOfWorkDaysInMonth = utils.getNumberOfWorkDaysInMonth(month, year);

    for (let j = 0; j < numberOfWorkDaysInMonth && n > 0; j++, n--) {
      let bar = document.createElement("div");
      bar.className = "stacked-bars__bar";
      bar.style.backgroundColor = utils.COLORS.red;
      bars.appendChild(bar);
    }
  }

  calendarGapVisualization.classList.remove("visualization--hidden");
};

export default {
  initialize: (data, user) => {
    data.forEach((d) => { EXCHANGE_RATES[d["CURRENCY CODE"]] = d["EXCHANGE RATE (USD)"] });

    // Find the chosen country's currency.
    let userCountryCurrency = data.find(d => d.COUNTRY === user.country)["CURRENCY CODE"];

    // If the chosen currency is different from the chosen country's currency...
    if (user.currency !== userCountryCurrency) {
      // ...convert the chosen salary to the chosen country's currency.
      user.salary = convertToCurrency(user.salary, user.currency, userCountryCurrency);
    }

    let averageSalary = {
      annual: {
        men: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (MEN)"],
        women: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (WOMEN)"]
      },
      monthly: {}
    };

    averageSalary.monthly.men = averageSalary.annual.men / 12;
    averageSalary.monthly.women = averageSalary.annual.women / 12;

    let now = new Date();
    let workDaysInCurrentMonth = utils.getWorkDaysInMonth(now.getMonth(), now.getFullYear());
    let numberOfWorkDaysInCurrentMonth = utils.getNumberOfWorkDaysInMonth(now.getMonth(), now.getFullYear());


    if (user.gender === "female") {
      d3.select("#calendar-gap-visualization-field-1").text("men");

      let salaryDifferenceInDays = Math.round(Math.abs(numberOfWorkDaysInCurrentMonth - (numberOfWorkDaysInCurrentMonth * user.salary) / averageSalary.monthly.men));

      if (user.salary <= averageSalary.monthly.men) {
        d3.select("#calendar-gap-visualization-field-2")
          .style("color", utils.COLORS.green)
          .text(salaryDifferenceInDays + " days less");

        monthlyView(salaryDifferenceInDays, workDaysInCurrentMonth, now, true);
      } else {
        d3.select("#calendar-gap-visualization-field-2")
          .style("color", utils.COLORS.red)
          .text(salaryDifferenceInDays + " days more");

        d3.select(".visualization--calendar-gap__legend").style("display", "none");

        if (salaryDifferenceInDays > numberOfWorkDaysInCurrentMonth) {
          yearlyView(salaryDifferenceInDays, now);
        } else {
          if (salaryDifferenceInDays >= numberOfWorkDaysInCurrentMonth) {
            salaryDifferenceInDays = numberOfWorkDaysInCurrentMonth - 1;
          }

          monthlyView(salaryDifferenceInDays, workDaysInCurrentMonth, now, false);
        }
      }
    } else if (user.gender === "male") {
      d3.select("#calendar-gap-visualization-field-1").text("women");

      let salaryDifferenceInDays = Math.round(Math.abs(numberOfWorkDaysInCurrentMonth - (numberOfWorkDaysInCurrentMonth * user.salary) / averageSalary.monthly.women));

      if (user.salary <= averageSalary.monthly.women) {
        d3.select("#calendar-gap-visualization-field-2")
          .style("color", utils.COLORS.green)
          .text(salaryDifferenceInDays + " days less");

        monthlyView(salaryDifferenceInDays, workDaysInCurrentMonth, now, true);
      } else {
        d3.select("#calendar-gap-visualization-field-2")
          .style("color", utils.COLORS.red)
          .text(salaryDifferenceInDays + " days more");

        d3.select(".visualization--calendar-gap__legend").style("display", "none");

        if (salaryDifferenceInDays > numberOfWorkDaysInCurrentMonth) {
          yearlyView(salaryDifferenceInDays, now);
        } else {
          if (salaryDifferenceInDays >= numberOfWorkDaysInCurrentMonth) {
            salaryDifferenceInDays = numberOfWorkDaysInCurrentMonth - 1;
          }

          monthlyView(salaryDifferenceInDays, workDaysInCurrentMonth, now, false);
        }
      }
    }

    d3.select("#calendar-gap-visualization-field-2")
      .style("font-weight", "600")
      .style("text-decoration", "underline");
  }
};
