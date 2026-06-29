function drawCommonPathways(svg, data, width, height) {
  const top = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const margin = { top: 30, right: 30, bottom: 40, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
    .domain([0, d3.max(top, d => d.count)])
    .range([0, innerWidth]);

  const y = d3.scaleBand()
    .domain(top.map(d => `${d.source} → ${d.target}`))
    .range([0, innerHeight])
    .padding(0.25);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll("rect")
    .data(top)
    .enter()
    .append("rect")
    .attr("y", d => y(`${d.source} → ${d.target}`))
    .attr("width", d => x(d.count))
    .attr("height", y.bandwidth())
    .attr("fill", "#93c5fd")
    .attr("stroke", "#111");

  g.selectAll("text.value")
    .data(top)
    .enter()
    .append("text")
    .attr("class", "value")
    .attr("x", d => x(d.count) + 6)
    .attr("y", d => y(`${d.source} → ${d.target}`) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => d.count.toLocaleString());

  g.append("g").call(d3.axisLeft(y));
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5));
}