import * as d3 from "d3";

import utils from "../utilities";

const VIEWBOX = {
  width: 100,
  height: 30
};

const CIRCLE = {
  radius: 2.5
};

export default {
  initialize: (data, user) => {

    document.querySelector("#your-gap-visualization-country").textContent = user.country;

    let averageSalary = {
      annual: {
        men: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (MEN)"],
        women: data.find(d => d.COUNTRY === user.country)["AVERAGE ANNUAL SALARY (WOMEN)"]
      },
      hourly: {}
    };
    averageSalary.hourly.men = Math.round(averageSalary.annual.men / 240 / 8 * 10) / 10;
    averageSalary.hourly.women = Math.round(averageSalary.annual.women / 240 / 8 * 10) / 10;

    let userSalaryHourly = Math.round(user.salary * 12 / 240 / 8 * 10) / 10;

    let extent = d3.extent([averageSalary.hourly.men, averageSalary.hourly.women, userSalaryHourly])

    let scale = d3.scaleLinear()
      .domain([extent[0], extent[1]])
      .range([0 + CIRCLE.radius, VIEWBOX.width - CIRCLE.radius]);

    let svg = d3.select("#your-gap-visualization")
      .append("svg")
      .style("width", "100%");

    let width = parseInt(window.getComputedStyle(svg.node()).width, 10);
    let height = parseInt(window.getComputedStyle(svg.node()).height, 10);

    svg.attr("viewBox", "0 0 " + VIEWBOX.width + " " + VIEWBOX.height + "");

    let g = svg.append("g")
      .attr("transform", "translate(0," + VIEWBOX.height / 2 + ")");

    g.append("line")
      .attr("x1", CIRCLE.radius * 2)
      .attr("y1", "0")
      .attr("x2", 100 - CIRCLE.radius * 2)
      .attr("y2", "0")
      .attr("stroke-width", "0.7")
      .attr("stroke", "#282828");

    let xPosition = {
      women: scale(averageSalary.hourly.women),
      men: scale(averageSalary.hourly.men),
      you: scale(userSalaryHourly)
    };

    let getTextAnchor = (xPosition) => {
      let oneThird = (scale.range()[0] + scale.range()[1]) / 3;
      let twoThirds = oneThird * 2;

      if (xPosition <= oneThird) {
        return "start";
      } else if (xPosition > oneThird && xPosition <= twoThirds) {
        return "middle";
      } else {
        return "end";
      }
    };

    let isLowest = (xPosition) => {
      return xPosition === scale.range()[0];
    }

    let isHighest = (xPosition) => {
      return xPosition === scale.range()[1];
    }

    let isInTheMiddle = (xPosition) => {
      return !(isLowest(xPosition) || isHighest(xPosition));
    };

    let gWomen = g.append("g")
      .attr("class", "women")
      .attr("transform", "translate(" + xPosition.women + ",0)");

    let gWomenText = gWomen.append("g")
      .attr("class", "women__text");

    gWomenText.append("text")
      .attr("y", isInTheMiddle(xPosition.women) ? "10" : "-10")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", getTextAnchor(xPosition.women))
      .text("WOMEN");

    let g1Text = gWomenText.append("text")
      .attr("y", isInTheMiddle(xPosition.women) ? "15" : "-5")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", getTextAnchor(xPosition.women));

    g1Text.append("tspan")
      .attr("font-weight", "600")
      .text(averageSalary.hourly.women + " " + user.currency);

    g1Text.append("tspan")
      .text(" / hour");

    gWomen.append("circle")
      .attr("r", CIRCLE.radius)
      .attr("fill", "#282828");

    let gMen = g.append("g")
      .attr("class", "men")
      .attr("transform", "translate(" + xPosition.men + ",0)");

    let gMenText = gMen.append("g")
      .attr("class", "men__text");

    gMenText.append("text")
      .attr("y", isInTheMiddle(xPosition.men) ? "10" : "-10")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", getTextAnchor(xPosition.men))
      .text("MEN");

    let g2Text = gMenText.append("text")
      .attr("y", isInTheMiddle(xPosition.men) ? "15" : "-5")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", getTextAnchor(xPosition.men));

    g2Text.append("tspan")
      .attr("font-weight", "600")
      .text(averageSalary.hourly.men + " " + user.currency);

    g2Text.append("tspan")
      .text(" / hour");

    gMen.append("circle")
      .attr("r", CIRCLE.radius)
      .attr("fill", "#282828");

    let gYou = g.append("g")
      .attr("class", "you")
      .attr("transform", "translate(" + xPosition.you + ",0)");

    let gYouText = gYou.append("g")
      .attr("class", "you__text");

    gYouText.append("text")
      .attr("y", isInTheMiddle(xPosition.you) ? "10" : "-10")
      .attr("font-size", "4")
      .attr("font-weight", "600")
      .attr("fill", utils.COLORS.red)
      .attr("text-anchor", getTextAnchor(xPosition.you))
      .text(userSalaryHourly + " " + user.currency);

    gYouText.append("text")
      .attr("y", isInTheMiddle(xPosition.you) ? "15" : "-5")
      .attr("font-size", "4")
      .attr("fill", "#282828")
      .attr("text-anchor", getTextAnchor(xPosition.you))
      .text("YOU");

    gYou.append("circle")
      .attr("r", CIRCLE.radius)
      .attr("fill", utils.COLORS.red);

    let previousWidth = null;
    let previousWomenTextAnchor = null;
    let previousMenTextAnchor = null;
    let resize = () => {
      width = parseInt(window.getComputedStyle(svg.node()).width, 10);
      height = parseInt(window.getComputedStyle(svg.node()).height, 10);

      if (width < 360) {
        svg.attr("preserveAspectRatio", "xMidYMin");
        g.attr("transform", "rotate(90) translate(0," + -(VIEWBOX.width / 2) + ") scale(" + height / width + ")");
        if (previousWidth >= 360 || previousWidth === null) {

          if (isLowest(xPosition.you)) {
            gYouText.attr("transform", "rotate(-90) translate(5,10)");
          } else if (isLowest(xPosition.women)) {
            gWomenText.attr("transform", "rotate(-90) translate(5,10)");
          } else if (isLowest(xPosition.men)) {
            gMenText.attr("transform", "rotate(-90) translate(5,10)");
          }

          if (isInTheMiddle(xPosition.you)) {
            gYouText.attr("transform", "rotate(-90) translate(-25,-10)");
          } else if (isInTheMiddle(xPosition.women)) {
            gWomenText.attr("transform", "rotate(-90) translate(-25,-10)");
          } else if (isHighest(xPosition.men)) {
            gMenText.attr("transform", "rotate(-90) translate(-25,-10)");
          }

          if (isHighest(xPosition.you)) {
            gYouText.attr("transform", "rotate(-90) translate(5,7)")
          } else if (isHighest(xPosition.women)) {
            gWomenText.attr("transform", "rotate(-90) translate(5,7)")
          } else if (isHighest(xPosition.men)) {
            gMenText.attr("transform", "rotate(-90) translate(5,7)")
          }

          gWomenText.selectAll("text")
            .attr("font-size", "3")
            .attr("text-anchor", "start");

          gMenText.selectAll("text")
            .attr("font-size", "3")
            .attr("text-anchor", "start");

          gYouText.selectAll("text")
            .attr("font-size", "3")
            .attr("text-anchor", "start");
        }
      } else if (width >= 360) {
        svg.attr("preserveAspectRatio", "xMidYMid");
        g.attr("transform", "translate(0," + VIEWBOX.height / 2 + ")");
        if (previousWidth < 360) {
          gWomenText.attr("transform", "");
          gMenText.attr("transform", "")
          gYouText.attr("transform", "");

          gWomenText.selectAll("text")
            .attr("font-size", "4")
            .attr("text-anchor", getTextAnchor(xPosition.women));

          gMenText.selectAll("text")
            .attr("font-size", "4")
            .attr("text-anchor", getTextAnchor(xPosition.men));

          gYouText.selectAll("text")
            .attr("font-size", "4")
            .attr("text-anchor", getTextAnchor(xPosition.you));
        }
      }

      previousWidth = width;
    };

    window.addEventListener("resize", resize);
    resize();
  }
};
