// import our components
import { Table } from "./Table.js";
import { Barchart } from "./Barchart.js";
import { Geo } from "./Geo.js";

let table, barchart, geo;

let state = {
  geojson: null,
  ConfirmedCases: null,
  data: [],
  domain: [],
  selectedState: null,
  selectedMetric: null,
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

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}
