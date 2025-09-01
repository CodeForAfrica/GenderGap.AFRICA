import * as d3 from "d3";

let globalGapVisualization = () => {
  let initialize = (data, user) => {
    let countryData = data.find(d => d.COUNTRY.replace("*", "") === user.country);

    let salaryMan   = +countryData["Estimated Earned Income Male"] * 1000,
        salaryWoman = +countryData["Estimated Earned Income Female"] * 1000,
        difference  = Math.round((salaryMan - salaryWoman) / 12);

    let format = d3.format(",.0f");

    document.querySelector(".global__user-country").innerHTML = countryData.COUNTRY;
    document.querySelector(".global__user-difference").innerHTML = format(difference);

    // Sort data from largest gap to smallest
    data.sort((a, b) => {
      let gapA = (+a["Estimated Earned Income Male"] - +a["Estimated Earned Income Female"]);
      let gapB = (+b["Estimated Earned Income Male"] - +b["Estimated Earned Income Female"]);
      return gapB - gapA;
    });

    // Get rank of user's country
    let rank = data.findIndex(d => d.COUNTRY.replace("*", "") === user.country) + 1;
    let superlative = "largest";
    if (rank > data.length / 2) {
      rank = data.length - rank + 1;
      superlative = "smallest";
    }
    let suffix = "";
    if (rank === 1) {
      suffix = "st";
    } else if (rank === 2) {
      suffix = "nd";
    } else if (rank === 3) {
      suffix = "rd";
    } else {
      suffix = "th";
    }

    document.querySelector(".global__rank").innerHTML = rank + suffix;
    document.querySelector(".global__superlative").innerHTML = superlative;

    let globalCountries = document.querySelector(".global__countries");
    data.forEach((d, i) => {
      let salaryMan   = +d["Estimated Earned Income Male"] * 1000,
          salaryWoman = +d["Estimated Earned Income Female"] * 1000,
          difference  = (salaryMan - salaryWoman) / salaryWoman;

      let html = `
        <div class="global__country-wrapper ${d.COUNTRY === countryData.COUNTRY ? "global__country-wrapper--highlight" : ""}">
          <span class="global__country-rank">${i + 1}</span>
          <span class="global__country-name">${d.COUNTRY}</span>
          <span class="global__country-bar">
            <span class="global__country-bar-female" style="width: ${100 / (1 + difference)}%"></span>
          </span>
          <span class="global__country-female-salary">$${format(salaryWoman)}</span>
          <span class="global__country-male-salary">$${format(salaryMan)}</span>
        </div>
      `;

      globalCountries.insertAdjacentHTML("beforeend", html);
    });

    document.querySelector(".global__country-wrapper--highlight").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  let destroy = () => {
    [...document.querySelectorAll(".global__country-wrapper")].forEach(d => d.remove());
  };

  return {
    initialize: initialize,
    destroy: destroy
  };
};

export default globalGapVisualization();