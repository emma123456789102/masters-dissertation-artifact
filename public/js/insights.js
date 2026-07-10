function updateInsights(data) {
  const pathCounts = new Map();

  data.forEach(d => {
    const path = `${d.source} → ${d.target}`;
    const count = +d.count || 0;
    pathCounts.set(path, (pathCounts.get(path) || 0) + count);
  });

  const top = Array.from(pathCounts.entries())
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  const list = d3.select("#topPathways");
  list.selectAll("*").remove();

  top.forEach(d => {
    list.append("li")
      .text(`${d.path} (${d.count.toLocaleString()})`);
  });

  const unique = new Set();
  data.forEach(d => {
    unique.add(d.source);
    unique.add(d.target);
  });

  d3.select("#totalTransitions").text(data.length.toLocaleString());
  d3.select("#uniqueDiseases").text(unique.size.toLocaleString());
  d3.select("#highestFrequency").text(top[0] ? top[0].count.toLocaleString() : "0");
}