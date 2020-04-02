  d3.csv("../data/project1data.csv", d3.autoType).then(data => {
    console.log(data);
  
    const width = window.innerWidth * 0.9,
      height = window.innerHeight / 3,
      paddingInner = 0.2,
      margin = { top: 20, bottom: 40, left: 60, right: 40 };
  
    const barColor = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.Population), d3.max(data, d => d.Population)])
      .range([d3.interpolateGreens(0.5), d3.interpolateGreens(1)]);
  
    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.Cities))
      .range([margin.left, width - margin.right])
      .paddingInner(paddingInner);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.Population)])
      .range([height - margin.bottom, margin.top]);
  
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale);
    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.Population))
      .attr("x", d => xScale(d.Cities))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.Population))
      .attr("fill", d => barColor(d.Population));
  
    const text = svg
      .selectAll("text")
      .data(data)
      .enter().append("text")
      .text(d => d.Population)
        .attr("x", d => xScale(d.Cities) + (xScale.bandwidth() / 2) - 30)
        .attr("y", d => yScale(d.Population))
        .attr("dy", "-0.5em");
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("y", "50%")
      .attr("dx", "-3em")
      .attr("writing-mode", "vertical-rl");
  
  
  });