const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

let svg;
let xScale;
let yScale;

let state = {
  data: [],
  selectedParty: "All",
};

d3.csv("../data/Popular_Baby_Names.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.Rank))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.Count))
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected party is", this.value);
    state.selectedParty = this.value;
    draw(); 
  });

  selectElement
    .selectAll("option")
    .data(["All", "FEMALE", "MALE"])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Rank");

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
    .text("Count");

  draw();
}


function draw() {
  let filteredData = state.data;
  if (state.selectedParty !== "All") {
    filteredData = state.data.filter(d => d.Gender === state.selectedParty);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.name)
    .join(
      enter =>
        enter
          .append("circle")
          .attr("class", "dot")
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.Gender === "MALE") return "black";
            else if (d.Gender === "FEMALE") return "pink";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(d.Count))
          .attr("cx", d => width)
          .call(enter =>
            enter
              .transition()
              .delay(d => 100 * d.Rank)
              .duration(500)
              .attr("cx", d => xScale(d.Rank))
          ),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(250)
            .attr("stroke", "pink")
            .transition()
            .duration(250)
            .attr("stroke", "black")
        ),
      exit =>
        exit.call(exit =>
          exit
            .transition()
            .delay(d => 50 * d.Rank)
            .duration(500)
            .attr("fill", "white")
            .remove()
        )
    );
}
