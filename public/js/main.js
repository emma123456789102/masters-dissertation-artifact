const csvFilePath = "data/trajectory_transitions.csv";

const svg = d3.select("#sankey");
let allData = [];
let currentView = "sankey";
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
d3.csv(csvFilePath).then(data => {
  console.log("CSV loaded:", data);
  console.log("Columns:", data.columns);

  data.forEach(d => {
    d.source = d.source || d.Source;
    d.target = d.target || d.Target;
    d.stage = d.stage || d.Stage;
    d.count = +(d.count || d.Count);
  });

  allData = data.filter(d => d.source && d.target && d.stage && !isNaN(d.count));

  setupButtons();
  drawDashboard();
});

function setupButtons() {
  d3.select("#stageFilter").on("change", drawDashboard);
  d3.select("#frequencyFilter").on("input", drawDashboard);
  d3.select("#diseaseSearch").on("input", drawDashboard);

  d3.select("#sankeyBtn").on("click", () => {
    currentView = "sankey";
    drawDashboard();
  });

  d3.select("#nodeBtn").on("click", () => {
    console.log("Node-link button clicked");
    currentView = "node";
    drawDashboard();
  });

  d3.select("#pathwaysBtn").on("click", () => {
    currentView = "pathways";
    drawDashboard();
  });

  d3.select("#resetBtn").on("click", () => {
    d3.select("#stageFilter").property("value", "all");
    d3.select("#frequencyFilter").property("value", 0);
    d3.select("#diseaseSearch").property("value", "");
    drawDashboard();
  });
}

function getFilteredData() {
  const selectedStage = d3.select("#stageFilter").property("value");
  const minFrequency = +d3.select("#frequencyFilter").property("value");
  const searchTerm = d3.select("#diseaseSearch").property("value").trim().toUpperCase();

  d3.select("#frequencyValue").text(minFrequency.toLocaleString());

  let data = allData.filter(d => d.count >= minFrequency);

  if (selectedStage !== "all") {
    data = data.filter(d => d.stage === selectedStage);
  }

  if (searchTerm !== "") {
    data = data.filter(d =>
      d.source.toUpperCase().includes(searchTerm) ||
      d.target.toUpperCase().includes(searchTerm)
    );
  }

  return data;
}

function buildGraph(data) {
  const nodesMap = new Map();

  data.forEach(d => {
    nodesMap.set(d.source, { name: d.source });
    nodesMap.set(d.target, { name: d.target });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links: data.map(d => ({
      source: d.source,
      target: d.target,
      value: d.count,
      stage: d.stage
    }))
  };
}

function drawDashboard() {
  svg.selectAll("*").remove();

  const container = document.querySelector(".main");
  const width = container.clientWidth - 30;
  const height = 560;

  svg.attr("width", width).attr("height", height);

  const data = getFilteredData();
  const graph = buildGraph(data);

  if (data.length === 0) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .text("No data available for the selected filters.");
    updateInsights([]);
    return;
  }

  if (currentView === "sankey") drawSankey(svg, graph, width, height);
  if (currentView === "node") drawNodeLink(svg, graph, width, height);
  if (currentView === "pathways") drawCommonPathways(svg, data, width, height);

  updateInsights(data);

  // information button
  const infoButton = d3.select("#infoBtn");
  const modal = d3.select("#infoModal");

}
