// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/CoronaVirus.csv", d3.autoType).then(data => {
  console.log(data);

  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const width = window.innerWidth * 0.9,
    height = window.innerHeight,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 100, right: 100 };

  /** SCALES */
  // reference for d3.scales: https://github.com/d3/d3-scale
  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d.City))
    .range([margin.top, height - margin.bottom])
    .paddingInner(paddingInner);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Count), d3.max(data, d => d.Count)])
    .range([0, width - 3*margin.right]);

  // reference for d3.axis: https://github.com/d3/d3-axis
  // const yAxis = d3.axisBottom(xScale).ticks(data.length);
  const yAxis = d3.axisLeft(yScale)

  /** MAIN CODE */
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // append rects
  const rect = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("y", d => yScale(d.City) + margin.top)
    .attr("x", d => xScale(d3.min(data, d => d.Count))+margin.left)
    .attr("width", d => xScale(d.Count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue")

  // append text
  const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    // .attr("class", "label")
    .attr("y", d => yScale(d.City) + margin.top)
    .attr("x", d => xScale(d.Count) + 110)
    // .attr("x", d => yScale(d.City) + (yScale.bandwidth() / 2))
    // .attr("y", d => xScale(d.Count))
    .text(d => d.Count)
    // .attr("dx", "1.5em")
      .attr("dy", "1.5em");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+ margin.left +", "+ margin.top +")")
    .call(yAxis);
});