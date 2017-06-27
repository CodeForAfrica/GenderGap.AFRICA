import * as d3 from "d3";

import utils from "../utilities";

const VIEWBOX = {
  width: 100,
  height: 65
};

const ARC = {
  thickness: 4
};

const BAR = {
  width: ARC.thickness + 1.5 * 2,
  height: 1.2
};

const NOW = new Date();

let computeTimeElapsedSince9AmToday = (date) => {
  let date9AmToday = new Date();
  date9AmToday.setHours(9, 0, 0, 0);
  return utils.dateDiffInHours(date9AmToday, date) + utils.pad(date.getMinutes()) / 60;
};

let timeScale = d3.scaleTime()
  .domain([new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 9, 0, 0, 0),
           new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 18, 0, 0, 0)])
  .range([0, 9]);

let setAttr = (elem, name, value) => {
  elem.setAttribute(name, value * 300 + 100);
};

let scale = d3.scaleLinear()
  .domain([0, 9])
  .range([180, 0]);

export default {
  initialize: (data, user) => {

    let averageSalary = {
      annual: {
        men: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (MEN)"],
        women: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (WOMEN)"],
      },
      hourly: {}
    };
    averageSalary.hourly.men = averageSalary.annual.men / 240 / 8 * 10;
    averageSalary.hourly.women = averageSalary.annual.women / 240 / 8 * 10;

    let userSalaryHourly = user.salary * 12 / 240 / 8 * 10;

    let date = null;
    if (user.gender === "female") {
      document.querySelector("#clock-gap-visualization-field-1").textContent = "man";
      let salaryRatio = averageSalary.hourly.men / userSalaryHourly;
      date = timeScale.invert(9 / salaryRatio);
    } else if (user.gender === "male") {
      document.querySelector("#clock-gap-visualization-field-1").textContent = "woman";
      let salaryRatio = averageSalary.hourly.women / userSalaryHourly;
      date = timeScale.invert(9 / salaryRatio);
    }

    let svg = d3.select("#clock-gap-visualization")
      .append("svg")
      .style("width", "100%");

    let timeElapsed = computeTimeElapsedSince9AmToday(date);

    let pair = utils.angleToPoints(utils.degreesToRadians(270 - scale(timeElapsed)));

    let partialFill = svg.append("defs")
      .append("linearGradient")
      .attr("id", "partial-fill")
      .attr("x1", pair.x1)
      .attr("y1", pair.y1)
      .attr("x2", pair.x2)
      .attr("y2", pair.y2);

    partialFill.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", utils.COLORS.red);

    partialFill.append("stop")
      .attr("offset", date.getMinutes() / 60 * 100 + "%")
      .attr("stop-color", utils.COLORS.red);

    partialFill.append("stop")
      .attr("offset", date.getMinutes() / 60 * 100 + "%")
      .attr("stop-color", "#969696");

    partialFill.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#969696");

    let width = parseInt(window.getComputedStyle(svg.node()).width, 10);
    let height = parseInt(window.getComputedStyle(svg.node()).height, 10);
    let sidePadding = 10;
    let radius = VIEWBOX.width / 2 - sidePadding;

    svg.attr("viewBox", "0 0 " + VIEWBOX.width + " " + VIEWBOX.height);

    let g = svg.append("g")
      .attr("transform", "translate(0,55)");

    let pie = d3.pie()
      .sort(null)
      .value((d) => d)
      .startAngle(-90 * (Math.PI/180))
      .endAngle(90 * (Math.PI/180))
      .padAngle(0.005);

    let path = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - ARC.thickness);

    let arcs = g.append("g")
      .attr("class", "arcs")
      .attr("transform", "translate(" + VIEWBOX.width / 2 + ",0)");

    const NUMBER_OF_HOURS_BETWEEN_9AM_AND_6PM = 9;
    const WORK_DAY_HOURS = new Array(NUMBER_OF_HOURS_BETWEEN_9AM_AND_6PM).fill(1);

    let arc = arcs.selectAll(".arc")
      .data(pie(WORK_DAY_HOURS))
     .enter().append("g")
      .attr("class", "arc")
     .append("path")
      .attr("d", path)
      .attr("fill", (d, i) => {
        if (i < Math.floor(timeElapsed)) {
          return utils.COLORS.red;
        } else if (i === Math.floor(timeElapsed)) {
          return "url(#partial-fill)";
        } else {
          return "#969696";
        }
      });

    let textWrapper = g.append("g")
      .attr("class", "text-wrapper")
      .attr("transform", "translate(" + VIEWBOX.width / 2 + ",0)");

    let convertTotalHoursToText = (totalHours) => {
      let days = Math.floor(totalHours / 24);
      let hours = Math.round(utils.mod(totalHours, 24) * 10) / 10;
      return (days ? days + " day" + (days === 1 ? "" : "s") + " and " : "") + hours + " hour" + (hours === 1 ? "" : "s");
    };

    let text = textWrapper.append("text")
      .attr("class", "text")
      .attr("fill", utils.COLORS.red)
      .attr("font-size", "5")
      .attr("font-weight", "600")
      .attr("text-anchor", "middle")
      .text(timeElapsed > 9 ? convertTotalHoursToText(Math.round((timeElapsed - 9) * 10) / 10) + " more" : utils.formatDate(date));

    d3.select("#clock-gap-visualization-field-2")
      .style("color", utils.COLORS.red)
      .style("font-weight", "600")
      .style("text-decoration", "underline")
      .text(timeElapsed > 9 ? convertTotalHoursToText(Math.round((timeElapsed - 9) * 10) / 10) + " more" : convertTotalHoursToText(Math.round((9 - timeElapsed) * 10) / 10) + " less");

    let startTime = g.append("text")
      .attr("x", sidePadding + ARC.thickness / 2)
      .attr("y", "1.4em")
      .attr("font-size", "3")
      .attr("fill", "#282828")
      .attr("text-anchor", "middle")
      .text("9 AM");

    let endTimeText = convertTotalHoursToText(Math.round((timeElapsed - 9) * 10) / 10) + " more"
    let endTime = g.append("text")
      .attr("transform", "translate(" + (VIEWBOX.width - (sidePadding + ARC.thickness / 2)) + ", 0)")
      .attr("y", "1.4em")
      .attr("font-size", "3")
      .attr("fill", "#282828")
      .attr("text-anchor", "middle")

    if (timeElapsed > 9) {
      endTime.append("tspan")
        .attr("x", "0")
        .attr("y", "1.4em")
        .text(endTimeText.substr(0, endTimeText.indexOf("and ") + 4));

      endTime.append("tspan")
        .attr("x", "0")
        .attr("y", "2.8em")
        .text(endTimeText.substr(endTimeText.indexOf("and ") + 4, endTimeText.length - 1));
    } else {
      endTime.text("6:00 PM");
    }

    let angle = scale(computeTimeElapsedSince9AmToday(NOW));

    if (angle >= 30 && angle <= 150) {
      let position = {
        x: Math.cos(angle * (Math.PI/180)) * (radius - ARC.thickness - (BAR.width - ARC.thickness) / 2),
        y: Math.sin(angle * (Math.PI/180)) * (radius - ARC.thickness - (BAR.width - ARC.thickness) / 2)
      };

      position.y = -position.y;

      let gNow = arcs.append("g")
        .attr("class", "now")
        .attr("transform", "translate(" + position.x + "," + position.y + ") rotate(" + -angle + ")");

      let gNowBar = gNow.append("rect")
        .attr("class", "now__bar")
        .attr("width", BAR.width)
        .attr("height", BAR.height)
        .attr("y", -BAR.height / 2)
        .attr("fill", "#282828");

      // This should only be shown if the current time is less than 6:00 PM.
      let gNowText = gNow.append("text")
        .attr("font-size", "3")
        .attr("transform", "translate(" + (BAR.width + 2) + "," + (-BAR.height / 2) + ") rotate(" + (angle > 90 ? 180 : 0) + ")")
        .attr("text-anchor", angle > 90 ? "end" : "start")
        .attr("fill", "#282828");

      gNowText.append("tspan")
        .attr("x", "0")
        .attr("y", "0")
        .text("Now");

      gNowText.append("tspan")
        .attr("x", "0")
        .attr("y", "1.2em")
        .attr("font-weight", "600")
        .text(utils.formatDate(NOW));
    }

    let previousWidth = null;
    let resize = () => {
      width = parseInt(window.getComputedStyle(svg.node()).width, 10);
      height = parseInt(window.getComputedStyle(svg.node()).height, 10);

      if (width < 360) {
        svg.attr("viewBox", "0 0 " + VIEWBOX.width + " " + (VIEWBOX.height + 10));

        if (previousWidth >= 360 || previousWidth === null) {
          textWrapper.attr("transform", "translate(" + VIEWBOX.width / 2 + ",15)")
            .select("text")
            .attr("font-size", "8");
        }
      } else if (width >= 360) {
        svg.attr("viewBox", "0 0 " + VIEWBOX.width + " " + VIEWBOX.height);

        if (previousWidth < 360 || previousWidth === null) {
          textWrapper.attr("transform", "translate(" + VIEWBOX.width / 2 + ",0)")
            .select("text")
            .attr("font-size", "5");
        }
      }

      previousWidth = width;
    };

    window.addEventListener("resize", resize);
    resize();
  }
};
