class Geo {

  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.4;
    this.margins = { top: 20, bottom: 20, left: 20, right: 20 };
    this.format = d3.format(",." + d3.precisionFixed(1) + "f");

    this.svg = d3
    .select("#geo")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

  }
  draw(state, setGlobalState) {

    const logScale = d3
      .scaleSymlog()
      .domain(d3.extent(state.ConfirmedCases.map(d => d['ConfirmedCases'])))
      .range([0.5, 1]);

    this.colorScale = d3.scaleSequential(d => d3.interpolateYlGnBu(logScale(d)));

    const projection = d3.geoAlbers().fitSize([this.width, this.height], state.geojson);
    const path = d3.geoPath().projection(projection);
    const hubeimap = this.svg

    // const filteredData = state.ConfirmedCases.find(d => state.selectedState === d.Cities);
    // const geoData = state.data.map(d =>{
    //   return {
    //     state: state.selectedState,
    //     value: filteredData,
    //   }
    // })
    // console.log(geoData)
    // console.log(filteredData)


    hubeimap
      .selectAll(".state")
      .data(state.geojson.features)
      .join("path")
      .attr("d", path)
      .attr("class", "state")
      .attr("fill", d => {
      const stateName = d.properties.name

      const stateConfirmedCases = state.ConfirmedCases.find(e => e.Cities === stateName)['ConfirmedCases'] 

      return this.colorScale(stateConfirmedCases)
    })
    .on("click", function(d)
    {
     
        d3.select(selectedState).selectAll("." + d).attr("fill", "green");		/* Highlight all counties in range selected */
    });
    // .on("click", d => {
    //   this.svg.attr("fill-opacity","0.8")
    //   setGlobalState(d.properties.name);})
      
    // hubeimap
    //   .data(state.geojson.features)
    //   .append("title").text(d => d.properties.name);
    

    const lables = this.svg
      .append("g")
      .selectAll(".lables")
      .data(state.geojson.features)
      .enter()
      .append("text")
      .attr("class","lables")
      .attr('font-size', 12)
      .attr("fill", 'white')
      .attr('text-anchor', 'middle')
      .attr("transform", function(d) {

        return "translate(" + path.centroid(d) + ")";
  
      })
  
      .style("text-anchor", "middle")
  
      .text(function(d) {
  
        return d.properties.name;})

    // hubeimap.on("click", () => {
    // const [mx, my] = d3.mouse(hubeimap.node());
    // const proj = projection.invert([mx, my]);
    // state.hover["longitude"] = proj[0];
  //   // state.hover["latitude"] = proj[1];
  // });


}}

  export { Geo };

