function drawNodeLink(svg, graph, width, height) {
  console.log("Drawing node-link", graph);
  const topLinks = graph.links
  .slice()
  .sort((a, b) => b.value - a.value)
  .slice(0, 150);

const nodeNames = new Set();

topLinks.forEach(d => {
  nodeNames.add(typeof d.source === "object" ? d.source.name : d.source);
  nodeNames.add(typeof d.target === "object" ? d.target.name : d.target);
});

const nodes = Array.from(nodeNames).map(name => ({ name }));

const links = topLinks.map(d => ({
  source: typeof d.source === "object" ? d.source.name : d.source,
  target: typeof d.target === "object" ? d.target.name : d.target,
  value: d.value,
  stage: d.stage
}));
  const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d2-d3", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.name).distance(120))
    .force("charge", d3.forceManyBody().strength(-350))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", d => colour(d.stage))
    .attr("stroke-width", d => Math.max(1, Math.sqrt(d.value) / 40))
    .attr("stroke-opacity", 0.6);

  const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("fill", "#93c5fd")
    .attr("stroke", "#111")
    .call(drag(simulation));

  const labels = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("font-size", 11)
    .attr("dx", 10)
    .attr("dy", 4);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });
}

function drag(simulation) {
  return d3.drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
    
}