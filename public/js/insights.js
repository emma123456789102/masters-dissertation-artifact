function updateInsights(data) {
  const top = [...data].sort((a, b) => b.count - a.count).slice(0, 5);

  const list = d3.select("#topPathways");
  list.selectAll("*").remove();

  top.forEach(d => {
    list.append("li")
      .text(`${d.source} → ${d.target} (${d.count.toLocaleString()})`);
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