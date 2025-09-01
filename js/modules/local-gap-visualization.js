import * as d3 from "d3";
import utils from "../utilities";

let localGapVisualization = () => {
  let initialize = (data, dataCurrencies, user) => {
    let countryData = data.find(d => d.COUNTRY.replace("*", "") === user.country);

    let salaryMan   = +countryData["Estimated Earned Income Male"] * 1000,
        salaryWoman = +countryData["Estimated Earned Income Female"] * 1000,
        salary      = user.salary,
        salaryOther = 0;

    if (user.gender === "male") {
      salaryOther = (salaryWoman / salaryMan) * salary;
    } else {
      salaryOther = (salaryMan / salaryWoman) * salary;
    }

    let percent = Math.round(((salaryMan - salaryWoman) / salaryWoman) * 100);

    let format = d3.format(",.0f");

    document.querySelector(".gap__you .gap__man-woman").innerHTML = user.gender;
    [...document.querySelectorAll(".gap__you .gap__amount")].forEach((span) => {
      span.innerHTML = format(salary);
    });
    [...document.querySelectorAll(".gap__you .gap__currency")].forEach((span) => {
      span.innerHTML = user.currency;
    });

    document.querySelector(".gap__them .gap__man-woman-other").innerHTML = user.otherGender;
    [...document.querySelectorAll(".gap__them .gap__amount-other")].forEach((span) => {
      span.innerHTML = format(salaryOther);
    });
    [...document.querySelectorAll(".gap__them .gap__currency-other")].forEach((span) => {
      span.innerHTML = user.currency;
    });

    if (salaryOther > salary) {
      [...document.querySelectorAll(".gap__them .gap__more-less-other")].forEach((span) => {
        span.innerHTML = "more";
      });
    } else {
      [...document.querySelectorAll(".gap__them .gap__more-less-other")].forEach((span) => {
        span.innerHTML = "less";
      });
    }

    if (user.gender === "female") {
      document.querySelector(".gap__bar--you").classList.add("gap__bar--woman");
      document.querySelector(".gap__bar--them").classList.add("gap__bar--man");
    } else {
      document.querySelector(".gap__bar--you").classList.add("gap__bar--man");
      document.querySelector(".gap__bar--them").classList.add("gap__bar--woman");
    }

    [...document.querySelectorAll(".gap__bar--you .gap__amount")].forEach((span) => {
      span.innerHTML = format(salary);
    });
    [...document.querySelectorAll(".gap__bar--you .gap__currency")].forEach((span) => {
      span.innerHTML = user.currency;
    });

    document.querySelector(".gap__bar--them .gap__gender-other").innerHTML = user.otherGender;
    document.querySelector(".gap__bar--them .gap__bar-amount").innerHTML = format(salaryOther);

    [...document.querySelectorAll(".gap__country")].forEach((span) => {
      span.innerHTML = countryData.COUNTRY;
    });

    document.querySelector(".gap__percent").innerHTML = percent;

    if (percent > 0) {
      document.querySelector(".gap__more-less").innerHTML = "more";
    } else {
      document.querySelector(".gap__more-less").innerHTML = "less";
    }

    let salaryDifference      = Math.round(salaryMan - salaryWoman),
        salaryDifferenceOther = Math.round(salaryOther - salary);

    document.querySelector(".gap__difference-other .gap__amount").innerHTML = format(Math.abs(salaryDifferenceOther));
  };

  return {
    initialize: initialize
  };
};

export default localGapVisualization();