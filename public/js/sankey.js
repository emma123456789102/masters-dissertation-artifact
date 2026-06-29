function drawSankey(svg, graph, width, height) {
  const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d1-d3", "d1-d4", "d2-d3", "d2-d4", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

  const sankey = d3.sankey()
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
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => colour(d.stage))
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("fill", "none")
    .attr("stroke-opacity", 0.6)
    .append("title")
    .text(d => `${d.source.name} → ${d.target.name}\nCount: ${d.value.toLocaleString()}\nStage: ${d.stage}`);

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
    })
    .attr("stroke", "#111");

  node.append("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 7 : d.x0 - 7)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);
}