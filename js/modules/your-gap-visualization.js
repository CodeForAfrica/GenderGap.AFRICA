import * as d3 from "d3";

import utils from "../utilities";

export default {
  initialize: (data, user) => {
    let svg = d3.select("#your-gap-visualization")
      .append("svg")
      .style("width", "100%");

    let width = parseInt(window.getComputedStyle(svg.node()).width, 10);
    let height = parseInt(window.getComputedStyle(svg.node()).height, 10);

    svg.attr("viewBox", "0 0 100 100");

    let g = svg.append("g")
      .attr("transform", "translate(0, 50)");

    g.append("line")
      .attr("x1", "6")
      .attr("y1", "0")
      .attr("x2", "94")
      .attr("y2", "0")
      .attr("stroke-width", "0.7")
      .attr("stroke", "#282828");

    let g1 = g.append("g");

    g1.append("text")
      .attr("y", "-10")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", "start")
      .text("WOMEN");

    let g1Text = g1.append("text")
      .attr("y", "-5")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", "start");

    g1Text.append("tspan")
      .attr("font-weight", "600")
      .text("64 $");

    g1Text.append("tspan")
      .text(" / hour");

    g1.append("circle")
      .attr("cx", "3")
      .attr("cy", "0")
      .attr("r", "3")
      .attr("fill", "#282828");

    let g2 = g.append("g")
      .attr("transform", "translate(97,0)");

    g2.append("text")
      .attr("y", "-10")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", "end")
      .text("MEN");

    let g2Text = g2.append("text")
      .attr("y", "-5")
      .attr("font-size", "4")
      .attr("font-weight", "300")
      .attr("fill", "#282828")
      .attr("text-anchor", "end");

    g2Text.append("tspan")
      .attr("font-weight", "600")
      .text("75 $");

    g2Text.append("tspan")
      .text(" / hour");

    g2.append("circle")
      .attr("cx", "0")
      .attr("cy", "0")
      .attr("r", "3")
      .attr("fill", "#282828");

    let g3 = g.append("g")
      .attr("transform", "translate(50,0)");

    g3.append("text")
      .attr("y", "10")
      .attr("font-size", "4")
      .attr("font-weight", "600")
      .attr("fill", utils.COLORS.red)
      .attr("text-anchor", "middle")
      .text("50 $");

    g3.append("text")
      .attr("y", "15")
      .attr("font-size", "4")
      .attr("fill", "#282828")
      .attr("text-anchor", "middle")
      .text("YOU");

    g3.append("circle")
      .attr("cx", "0")
      .attr("cy", "0")
      .attr("r", "3")
      .attr("fill", utils.COLORS.red);
  }
};
