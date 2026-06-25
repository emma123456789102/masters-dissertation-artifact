const csvFilePath = "data/trajectory_data(in) (1).csv";

const svg = d3.select("#sankey");
const tooltip = d3.select("#tooltip");

const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d1-d3", "d1-d4", "d2-d3", "d2-d4", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

    let allData = [];

    d3.csv(csvFilePath).then(data => {
        data.forEach(d => {
            d.count = +d.count;
        });
        allData = data;

        const stages =[...new Set(data.map( d => d.stage))].sort();

        d3.select("#stageFilter")
        .selectAll("option.stage")
        .data(stages)
        .enter()
        .append("option")
        .attr("value", d =>d)
        .text(d =>d);

        drawDashboard();

        d3.select("#stageFilter").on("change", drawDashboard); 
        d3.select("#minFrequency").on("input", drawDashboard);
        d3.select("#diseaseSearch").on("input", drawDashboard);

        d3.select("#resetButton").on("click", () => {
            d3.select("#stageFilter").property("value", "");
            d3.select("#minFrequency").property("value", 1);
            d3.select("#diseaseSearch").property("value", "");
            drawDashboard();
        });

    });

    function drawDashboard() {
        svg.selectAll("*").remove();

        const container = document.querySelector(".main");
        const width = container.clientWidth - 30;
        const height = container.clientHeight - 80;
        
        svg.attr("width", width).attr("height", height);

         const selectedStage = d3.select("#stageFilter").property("value");
         const minFrequency = +d3.select("#minFrequency").property("value");
         const diseaseSearch = d3.select("#diseaseSearch").property("value").trim().toUpperCase();

         d3.select("#freqLabel").text(minFrequency.toLocaleString());

         let data = allData.filter (d=> d.count >=minFrequency);

         if(selectedStage != "all") {
            data = data.filter(d => d.Stage === selectedStage);

         }

         if(searchTerm !== ""){
            data = data.filter(d =>
                d.source.toUpperCase().includes(searchTerm) ||
                d.Target.toUpperCase().includes(searchTerm)
            );
         }

         const nodesMap = new Map();

         data.forEach(d => {
            nodesMap.set(d.source, {name : d.source});
            nodesMap.set(d.Target, {name : d.Target});
         });

         const graph = {
            nodes: Array.from(nodesMap.values()),
            links: data.map(d => ({
                source: d.source,
                target: d.Target,
                value: d.count,
                stage: d.Stage

            }))
         };

         if (graph.nodes.length === 0 || graph.links.length === 0) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .text("No data available for the selected filters.");
                updateInsights([]);
                return;

         }
        const
