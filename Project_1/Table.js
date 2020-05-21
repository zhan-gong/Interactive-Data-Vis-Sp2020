class Table {

  constructor(state, setGlobalState) {

    const slimmedData = state.data.map(d => ({
      "Cities": d.Cities,
      "Distance": d['Distance'],
      "ConfirmedCases": d['ConfirmedCases']
    })).sort((a, b) => d3.descending(a['Distance'], b['Distance']))

    const logScale = d3
      .scaleSymlog()
      .domain(d3.extent(slimmedData, d => d['ConfirmedCases']))
      .range([0.5, 1]);

    this.colorScale = d3.scaleSequential(d => d3.interpolateYlGnBu(logScale(d)));

    const columns = ["Cities", "Distance/kilometerss from Wuhan","Confirmed Cases"];
    const table = d3.select("#table").append("table");
    const format = d3.format(",." + d3.precisionFixed(1) + "f");

    table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(columns)
      .join("th")
      .text(d => d);

    this.tableRows = table
      .append("tbody")
      .selectAll("tr")
      .data(slimmedData)
      .join("tr")
      .style("background-color", d => this.colorScale(d['ConfirmedCases']))
      .style("color", "#eee");

    this.tableRows
      .selectAll("td")
      .data(d => Object.values(d))
      .join("td")
      .text(d => typeof(d) === "string" ? d : format(d));

    this.tableRows.on("click", d => {
      setGlobalState({ selectedState: d.Cities });
    });
  }

  draw(state, setGlobalState) {
    
    this.tableRows.style("background-color", d =>
      state.selectedState === d.Cities ? "grey" : this.colorScale(d['ConfirmedCases'])
    );
  }
}

export { Table };
