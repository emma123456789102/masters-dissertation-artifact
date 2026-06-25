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
        const sankey =d3.sankey()
            .nodeId(d => d.name)
            .nodeWidth(20)
            .nodePadding(10)
            .extent([[1, 1], [width - 1, height - 6]]);

        sankey(graph);
        svg.append("g")
            .selectAll("path")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", d => colour(d.stage))
            .attr("stroke-width", d => Math.max(1, d.width))
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .html(`
                        <strong>${d.source.name} -> ${d.target.name}</strong><br>
                        Count: ${d.value.toLocaleString()}<br>
                        Stage: ${d.stage}
                    `);
            })
            .on("mouseleave", () => tooltip.style("opacity", 0));

            const node = svg.append("g")
            .selectAll("g")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node");

        node.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => Math.max(4, d.y1 - d.y0))
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => {
      if (d.x0 < width * 0.25) return "#93c5fd";
      if (d.x0 < width * 0.50) return "#86efac";
      if (d.x0 < width * 0.75) return "#fdba74";
      return "#f9a8d4";
    });

    node.append("text")
    .attr("x", d=>d.x0 <width/2 ? d.x1 +7 :d.x0 -7)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d=>d.x0 <width/2 ? "start" : "end")
    .text(d => d.name);

    updateInsights(data);

    }
    function updateInsights(data) {
        const top = [...data].sort((a,b) => b.count - a.count).slice(0,5);

        const list =d3.select("#topPathways");
        list.selectAll("*").remove();

         top.forEach(d => {
    list.append("li")
      .text(`${d.Source} → ${d.Target} (${d.Count.toLocaleString()})`);
  });

  const unique = new Set();
  data.forEach(d =>{
    unique.add(d.Source);
    unique.add(d.Target);
    });
  