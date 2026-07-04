function drawSankey(svg, graph, width, height) {
  const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d2-d3", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  const sankey = d3.sankey()
    .nodeId(d => d.name)
    .nodeWidth(22)
    .nodePadding(14)
    .extent([[20, 20], [width - 20, height - 20]]);

  sankey(graph);

  svg.append("g")
    .selectAll("path")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => colour(d.stage))
    .attr("stroke-width", d => Math.max(3, d.width))
    .attr("fill", "none")
    .attr("stroke-opacity", 0.75)
    .on("mousemove", (event, d) => {
      showTooltip(event, `
        <strong>${d.source.name} → ${d.target.name}</strong><br>
        Stage: ${d.stage}<br>
        Frequency: ${d.value.toLocaleString()}
      `);
    })
    .on("mouseleave", hideTooltip);

  const node = svg.append("g")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node");

  node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => Math.max(10, d.y1 - d.y0))
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", "#93c5fd")
    .attr("stroke", "#111");

  node.append("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);
}