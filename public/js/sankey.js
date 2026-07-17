function drawSankey(svg, graph, width, height) {
  const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d2-d3", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  const sankey = d3.sankey()
    .nodeId(d => d.id)
    .nodeWidth(22)
    .nodePadding(14)
    .extent([[20, 20], [width - 20, height - 20]]);

  sankey(graph);

  // compute aggregated incoming/outgoing counts per node for tooltip info
  const inCounts = {};
  const outCounts = {};
  graph.links.forEach(l => {
    const s = l.source && l.source.name ? l.source.name : l.source;
    const t = l.target && l.target.name ? l.target.name : l.target;
    outCounts[s] = (outCounts[s] || 0) + (l.value || 0);
    inCounts[t] = (inCounts[t] || 0) + (l.value || 0);
  });

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
    .attr("fill", d => {
      const levelColor = {1: "#1f77b4", 2: "#ff7f0e", 3: "#2ca02c", 4: "#d62728"};
      
      return (d.level && levelColor[d.level]) || "#93c5fd";
    })
    .attr("stroke", "#111")
    .on("mousemove", (event, d) => {
      const lvl = d.level ? `d${d.level}` : 'Unknown';
      const incoming = (inCounts[d.name] || 0).toLocaleString();
      const outgoing = (outCounts[d.name] || 0).toLocaleString();
      showTooltip(event, `
        <strong>${d.name}</strong><br>
        Level: ${lvl}<br>
        Incoming: ${incoming}<br>
        Outgoing: ${outgoing}
      `);
    })
    .on("mouseleave", hideTooltip)
    .on("click", (event, d) => {
      if (window.selectDiseaseCode) {
        window.selectDiseaseCode(d.name);
      }
    });

  node.append("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);

  // Add legend into the Key Insights panel (HTML) so it appears in the insights column
  const legendData = [
    { label: 'Disease 1', color: '#1f77b4' },
    { label: 'Disease 2', color: '#ff7f0e' },
    { label: 'Disease 3', color: '#2ca02c' },
    { label: 'Disease 4', color: '#d62728' }
  ];

  const insights = d3.select('.insights');
  if (!insights.empty()) {
    let legendDiv = insights.select('#sankeyLegend');
    if (legendDiv.empty()) {
      legendDiv = insights.append('div').attr('id', 'sankeyLegend').attr('class', 'legend-html insight-card');
    } else {
      legendDiv.html('');
    }

    legendDiv.append('h3').text('Legend');

    const item = legendDiv.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('div')
      .attr('class', 'legend-item');

    item.append('span')
      .attr('class', 'swatch')
      .style('background', d => d.color)
      .style('display', 'inline-block')
      .style('width', '14px')
      .style('height', '14px')
      .style('margin-right', '8px')
      .style('border', '1px solid #111');

    item.append('span')
      .text(d => d.label);
  }
}