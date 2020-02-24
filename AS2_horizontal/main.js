
d3.csv("../data/CoronaVirus.csv", d3.autoType).then(data => {
  console.log(data);

  const width = window.innerWidth * 0.9,
    height = window.innerHeight,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 100, right: 100 };
  
  const barColor = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Count), d3.max(data, d => d.Count)])
    .range([d3.interpolateGreens(0.5), d3.interpolateGreens(1)]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d.City))
    .range([margin.top, height - margin.bottom])
    .paddingInner(paddingInner);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Count), d3.max(data, d => d.Count)])
    .range([0, width - 3*margin.right]);

  const yAxis = d3.axisLeft(yScale)

  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const rect = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("y", d => yScale(d.City) + margin.top)
    .attr("x", d => xScale(d3.min(data, d => d.Count))+margin.left)
    .attr("width", d => xScale(d.Count))
    .attr("height", yScale.bandwidth())
    .attr("fill", d => barColor(d.Count))

  const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("y", d => yScale(d.City) + margin.top)
    .attr("x", d => xScale(d.Count) + 110)
    .text(d => d.Count)
    .attr("dy", "1.5em");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+ margin.left +", "+ margin.top +")")
    .call(yAxis);
});