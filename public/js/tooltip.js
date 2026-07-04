const tooltip = d3.select("#tooltip");

function showTooltip(event, html) {
  tooltip
    .style("opacity", 1)
    .style("left", event.pageX + 12 + "px")
    .style("top", event.pageY + 12 + "px")
    .html(html);
}

function hideTooltip() {
  tooltip.style("opacity", 0);
}