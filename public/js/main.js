const csvFilePath = "./data/trajectory_transitions.csv";
let svg;
let allData = [];
let currentView = "sankey";

document.addEventListener("DOMContentLoaded", () => {
  svg = d3.select("#sankey");

  d3.csv(csvFilePath).then(data => {
    console.log("CSV loaded:", data);
    console.log("Columns:", data.columns);

  data.forEach(d => {
    d.source = d.source || d.Source;
    d.target = d.target || d.Target;
    d.stage = d.stage || d.Stage;
    d.stage_start = d.stage_start || d.Stage_start;
    d.count = +(d.count || d.Count);
  });
// code for the filter to remove any rows with missing or invalid data
  allData = data.filter(d => 
    d.source && 
    d.target &&
    d.stage &&
     !isNaN(d.count));
// for mind sence
     console.log("the normaliesed data sample:", allData.slice(0, 5));
  setupButtons();
  drawDashboard();
  });
});

function formatStage(stage) {
  const labels ={
    "d1": "Disease 1",
    "d2": "Disease 2",
    "d3": "Disease 3",
    "d4": "Disease 4",
    "d1-d2": "Transition from Disease 1 to Disease 2",
    "d2-d3": "Transition from Disease 2 to Disease 3",
    "d3-d4": "Transition from Disease 3 to Disease 4"
  };
  return labels[stage] || stage;
  };



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
    data = data.filter(d => d.stage_start === selectedStage);
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
  const grouped = d3.rollups(
    data,
    v => d3.sum(v, d => +d.count),
    d => d.source,
    d => d.target,
    d => d.stage
  );

  const links = [];

  grouped.forEach(([source, targets]) => {
    targets.forEach(([target, stages]) => {
      stages.forEach(([stage, value]) => {
        links.push({ source, target, stage, value });
      });
    });
  });

  const topLinks = links
    .sort((a, b) => b.value - a.value)
    .slice(0, 80);

  const nodesMap = new Map();

  topLinks.forEach(d => {
    nodesMap.set(d.source, { name: d.source });
    nodesMap.set(d.target, { name: d.target });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links: topLinks
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

  // Display message if no data is available
     console.log("Dashboard drawn with current view:", currentView);
    console.log("Filtered data sample:", getFilteredData().slice(0, 5));
  

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
    //Test 
  // svg.append("circle")
  //   .attr("cx", width / 2)
  //   .attr("cy", height / 2)
  //   .attr("r", 50)
  //   .attr("fill", "red");
  // if (currentView === "node") drawNodeLink(svg, graph, width, height);
  // if (currentView === "pathways") drawCommonPathways(svg, data, width, height);

  updateInsights(data);

  // information button
  const infoButton = d3.select("#infoBtn");
  const modal = d3.select("#infoModal");

}
