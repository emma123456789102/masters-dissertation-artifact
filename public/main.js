const csvFilePath = "data/trajectory_data(in) (1).csv";

const svg = d3.select("#sankey");
const tooltip = d3.select("#tooltip");

const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d1-d3", "d1-d4", "d2-d3", "d2-d4", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

    let allData = [];