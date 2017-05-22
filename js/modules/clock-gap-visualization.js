import * as d3 from "d3";

import utils from "../utilities";

export default {
  initialize: (data, user) => {
    let svg = d3.select("#clock-gap-visualization")
      .append("svg")
      .style("width", "100%");

    let width = parseInt(window.getComputedStyle(svg.node()).width, 10);
    let height = parseInt(window.getComputedStyle(svg.node()).height, 10);
    let radius = width / 2;

    svg.attr("viewBox", "0 0 " + width + " " + height);

    let g = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let pie = d3.pie()
      .sort(null)
      .value((d) => d)
      .startAngle(-90 * (Math.PI/180))
      .endAngle(90 * (Math.PI/180))
      .padAngle(0.005);

    let path = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - 15);

    let arc = g.selectAll(".arc")
      .data(pie([1, 1, 1, 1, 1, 1, 1, 1]))
      .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", (d, i) => i < 5 ? utils.COLORS.red : "#969696");

    let pad = value => (value < 10) ? "0" + value : value;

    let now = new Date();
    let currentTime = now.getHours() % 13 + ":" + pad(now.getMinutes()) + " " + ((now.getHours() < 12) ? "AM" : "PM");

    let text = g.append("text")
      .attr("text-anchor", "middle")
      .attr("class", "text");

    text.append("tspan")
      .attr("fill", utils.COLORS.red)
      .attr("font-weight", "600")
      .text(currentTime);

    text.append("tspan")
      .attr("fill", "#282828")
      .attr("font-weight", "300")
      .text(" / one hour ago");

    g.append("text")
      .attr("x", "-180")
      .attr("fill", "#282828")
      .attr("text-anchor", "start")
      .text("9 AM");

    g.append("text")
      .attr("x", "180")
      .attr("fill", "#282828")
      .attr("text-anchor", "end")
      .text("6 AM");
  }
};
