function drawNodeLink(svg, graph, width, height) {
  console.log("Drawing node-link", graph);

  const nodes = (graph.nodes || []).map((d, i) => ({
    id: String(d.id || d.name || i),
    name: d.name || d.id || `node${i}`,
    level: d.level,
    x: d.x || width / 2 + (i % 10) * 5,
    y: d.y || height / 2 + (i % 10) * 5
  }));

  const links = (graph.links || []).slice()
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 150)
    .map(d => ({
      source: String(d.source),
      target: String(d.target),
      value: d.value,
      stage: d.stage
    }));

  if (nodes.length === 0 || links.length === 0) {
    console.warn('No node-link data to render', nodes.length, links.length);
    return;
  }

  const colour = d3.scaleOrdinal()
    .domain(["d1-d2", "d2-d3", "d3-d4"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  svg.attr('width', width).attr('height', height);
  svg.select('defs').remove();
  svg.selectAll('.zoom-layer').remove();

  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -4 8 8')
    .attr('refX', 10)
    .attr('refY', 0)
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
      .attr('d', 'M0,-4 L8,0 L0,4')
      .attr('fill', '#111');

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-250))
    .force('center', d3.forceCenter(width / 2, height / 2));

  console.log('Node-link layout data:', nodes.length, links.length, nodes.slice(0, 5), links.slice(0, 5));

  const container = svg.append('g').attr('class', 'zoom-layer');

  const link = container.append('g')
    .attr('class', 'link-layer')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', d => colour(d.stage) || '#999')
    .attr('stroke-width', d => Math.max(1, Math.sqrt(d.value || 1) / 40))
    .attr('stroke-opacity', 0.7)
    .attr('marker-end', 'url(#arrowhead)');

  const node = container.append('g')
    .attr('class', 'node-layer')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 8)
    .attr('fill', '#93c5fd')
    .attr('stroke', '#111')
    .attr('stroke-width', 1.2)
    .call(drag(simulation));

  node.append('title').text(d => `${d.name}\nLevel: ${d.level || 'unknown'}`);

  const label = container.append('g')
    .attr('class', 'label-layer')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.name)
    .attr('font-size', 10)
    .attr('fill', '#111');

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    label
      .attr('x', d => d.x + 10)
      .attr('y', d => d.y + 4);
  });

  const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on('zoom', event => {
      container.attr('transform', event.transform);
    });

  svg.call(zoom);
  nodeLinkZoom = zoom;
}

function drag(simulation) {
  return d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
