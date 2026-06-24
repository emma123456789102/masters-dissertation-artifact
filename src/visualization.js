import * as d3 from 'd3'

export function createViz(selector) {
  const container = document.querySelector(selector)
  if (!container) throw new Error('Container element not found')

  const width = 800
  const height = 400

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // sample static example
  const data = [10, 30, 80, 40, 60]

  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, width])
    .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height - 20, 20])

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', d => y(d))
    .attr('width', x.bandwidth())
    .attr('height', d => height - 20 - y(d))
    .attr('fill', '#4C78A8')
}
