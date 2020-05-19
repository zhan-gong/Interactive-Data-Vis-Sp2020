// import our components
import { Table } from "./Table.js";
import { Barchart } from "./Barchart.js";
import { Geo } from "./Geo.js";

let table, barchart, geo, svg, tooltip;


let state = {
  geojson: null,
  ConfirmedCases: null,
  data: [],
  domain: [],
  selectedState: null,
  selectedMetric: null,
  hover: null
  // hover: {
  //   latitude: null,
  //   longitude: null,
  //   state: null,
  // },
};


Promise.all([
  d3.json("../data/geometryProvince/42.json"),
  d3.csv("../data/project1data.csv", d3.autoType),
]).then(([geojson, ConfirmedCases]) => {
  state.geojson = geojson;
  state.domain = [
    0, 
    d3.max(ConfirmedCases
      .map(d => [d["Recovered"], d["Deaths"], d["Distance"], d["ConfirmedCases"]])
      .flat()
    )];
  state.ConfirmedCases = ConfirmedCases;
  console.log("state: ", state);
  state.data = ConfirmedCases
  init();
});


function init() {
  table = new Table(state, setGlobalState);
  barchart = new Barchart(state, setGlobalState);
  geo = new Geo(state, setGlobalState);
  draw();
}

function draw() {
  table.draw(state);
  barchart.draw(state, setGlobalState);
  geo.draw(state, setGlobalState);
}

function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}



const width = window.innerWidth *0.8,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 8;

d3.csv("../data/projectdatawithoutwuhan.csv", d3.autoType).then(data => {
    "raw_data", data;
    state.data = data;
    init2();
  });


function init2() {
const container = d3.select("#scatter").style("position", "relative");

tooltip = container
  .append("div")
  .attr("class", "tooltip")
  .attr("width", 100)
  .attr("height", 100); 


svg = container
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const xScale = d3
.scaleLinear()
.domain([0, d3.max(state.data, d => d.Distance)])
.range([margin.left, width - margin.right]);

const yScale = d3
.scaleLinear()
.domain(d3.extent(state.data, d => d.ConfirmedCases))
.range([height - margin.bottom, margin.top]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);


svg
.append("g")
.attr("class", "axis x-axis")
.attr("transform", `translate(0,${height - margin.bottom})`)
.call(xAxis)
.append("text")
.attr("class", "axis-label")
.attr("x", "50%")
.attr("dy", "3em")
.text("Distance by Miles");

svg
.append("g")
.attr("class", "axis y-axis")
.attr("transform", `translate(${margin.left},0)`)
.call(yAxis)
.append("text")
.attr("class", "axis-label")
.attr("y", "50%")
.attr("dx", "-3em")
.attr("writing-mode", "vertical-rl")
.text("Confirmed Cases");

draw2();


function draw2() {
const dot = svg
  .selectAll(".dot")
  .data(state.data, d => d.Cities)
  .join(
    enter =>
      enter
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", "lightgrey")
        .attr("opacity", 0.5)
        .attr("fill", "blue")
        .attr("r", radius)
        .attr("cy", d => yScale(d.ConfirmedCases))
        .attr("cx", d => xScale(d.Distance))
      )
      .on("mouseover", d => {
        state.hover = {
          City: d.Cities,
          ConfirmedCases: d.ConfirmedCases,
          Distance: d.Distance
          };
          draw3();
        });
  function draw3() {
  if (state.hover) {
    tooltip
      .html(
        `
        <div>City: ${state.hover.City}</div>
        <div>Confirmed Cases: ${state.hover.ConfirmedCases}</div>
        <div>Distance to Wuhan: ${state.hover.Distance}</div>
      `
      )
  }
}
}}