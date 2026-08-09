/**
 * @jest-environment jsdom
 */
const fs = require("fs");

const {
  parseCount,
  normalizeData,
  formatStage,
  buildGraph
} = require("../public/js/main.js");

describe("Basic application tests", () => {

  test("public/index.html exists", () => {
    const exists = fs.existsSync("public/index.html");
    expect(exists).toBe(true);
  });

  test("parseCount converts a normal numeric string", () => {
    expect(parseCount("100")).toBe(100);
  });

  test("parseCount converts <5 to 4", () => {
    expect(parseCount("<5")).toBe(4);
  });

  test("parseCount converts <10 to 9", () => {
    expect(parseCount("<10")).toBe(9);
  });

  test("parseCount returns NaN for an empty value", () => {
    expect(parseCount("")).toBeNaN();
  });

  test("parseCount returns NaN for null", () => {
    expect(parseCount(null)).toBeNaN();
  });

  test("formatStage converts d1-d2 into a readable label", () => {
    expect(formatStage("d1-d2"))
      .toBe("Disease 1 → Disease 2");
  });

  test("formatStage converts d2-d3 into a readable label", () => {
    expect(formatStage("d2-d3"))
      .toBe("Disease 2 → Disease 3");
  });

  test("formatStage returns unknown stages unchanged", () => {
    expect(formatStage("unknown"))
      .toBe("unknown");
  });

  test("normalizeData converts raw data into the expected structure", () => {
    const rawData = [
      {
        source: "A01",
        target: "B02",
        stage: "d1-d2",
        count: "25",
        disease1: "A01",
        disease2: "B02",
        disease3: "",
        disease4: ""
      }
    ];

    const result = normalizeData(rawData);

    expect(result.length).toBe(1);

    expect(result[0]).toMatchObject({
      source: "A01",
      target: "B02",
      stage: "d1-d2",
      count: 25,
      disease1: "A01",
      disease2: "B02"
    });
  });

  test("normalizeData removes rows with missing source", () => {
    const rawData = [
      {
        source: "",
        target: "B02",
        stage: "d1-d2",
        count: "20"
      }
    ];

    const result = normalizeData(rawData);

    expect(result.length).toBe(0);
  });

  test("normalizeData removes rows with invalid count", () => {
    const rawData = [
      {
        source: "A01",
        target: "B02",
        stage: "d1-d2",
        count: "invalid"
      }
    ];

    const result = normalizeData(rawData);

    expect(result.length).toBe(0);
  });

  test("buildGraph creates nodes and links", () => {
    const data = [
      {
        source: "A01",
        target: "B02",
        stage: "d1-d2",
        count: 100
      }
    ];

    const graph = buildGraph(data);

    expect(graph.nodes.length).toBe(2);
    expect(graph.links.length).toBe(1);
  });

  test("buildGraph creates correct stage-specific node IDs", () => {
    const data = [
      {
        source: "A01",
        target: "B02",
        stage: "d1-d2",
        count: 100
      }
    ];

    const graph = buildGraph(data);

    const nodeIds = graph.nodes.map(node => node.id);

    expect(nodeIds).toContain("A01_1");
    expect(nodeIds).toContain("B02_2");
  });

  test("buildGraph creates the correct link value", () => {
    const data = [
      {
        source: "A01",
        target: "B02",
        stage: "d1-d2",
        count: 100
      }
    ];

    const graph = buildGraph(data);

    expect(graph.links[0].value).toBe(100);
  });

  test("buildGraph assigns correct levels for d2-d3", () => {
    const data = [
      {
        source: "B02",
        target: "C03",
        stage: "d2-d3",
        count: 50
      }
    ];

    const graph = buildGraph(data);

    const sourceNode =
      graph.nodes.find(node => node.id === "B02_2");

    const targetNode =
      graph.nodes.find(node => node.id === "C03_3");

    expect(sourceNode.level).toBe(2);
    expect(targetNode.level).toBe(3);
  });

  test("buildGraph ignores unsupported stages", () => {
    const data = [
      {
        source: "A01",
        target: "B02",
        stage: "invalid-stage",
        count: 100
      }
    ];

    const graph = buildGraph(data);

    expect(graph.nodes.length).toBe(0);
    expect(graph.links.length).toBe(0);
  });

});