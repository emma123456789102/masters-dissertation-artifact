const CSV_NATIONAL = "./data/trajectory_transitions.csv";
const CSV_FIFE_TAYSIDE =
  "./data/dataset2_demographic_transitions.csv";

let svg;
let allData = [];
let currentView = "sankey";
let currentDataset = "dataset1";
let nodeLinkZoom = null;

/*
 * Convert values such as "<5" into a usable number.
 */
function parseCount(raw) {
  if (raw == null || raw === "") return NaN;

  const value = String(raw).trim();
  const lessThanMatch = value.match(/^<\s*(\d+)$/);

  if (lessThanMatch) {
    const limit = Number(lessThanMatch[1]);
    return Math.max(1, limit - 1);
  }

  const number = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : NaN;
}

/*
 * Convert either dataset into the same structure.
 *
 * The disease1–disease4 fields are essential for filtering a
 * disease by its position within the complete trajectory.
 */
function normalizeData(rawData) {
  return rawData
    .map(row => ({
      source: String(
        row.source ?? row.Source ?? ""
      ).trim(),

      target: String(
        row.target ?? row.Target ?? ""
      ).trim(),

      stage: String(
        row.stage ?? row.Stage ?? ""
      ).trim(),

      start_stage: String(
        row.start_stage ??
        row.stage_start ??
        row.Start_Stage ??
        row.Stage_start ??
        ""
      ).trim(),

      count: parseCount(row.count ?? row.Count),

      disease1: String(
        row.disease1 ??
        row["disease 1"] ??
        row.d1 ??
        ""
      ).trim(),

      disease2: String(
        row.disease2 ??
        row["disease 2"] ??
        row.d2 ??
        ""
      ).trim(),

      disease3: String(
        row.disease3 ??
        row["disease 3"] ??
        row.d3 ??
        ""
      ).trim(),

      disease4: String(
        row.disease4 ??
        row["disease 4"] ??
        row.d4 ??
        ""
      ).trim(),

      sex: String(
        row.sex ?? row.Sex ?? ""
      ).trim(),

      age_group: String(
        row.age_group ??
        row.Age_group ??
        row["age group"] ??
        ""
      ).trim(),

      simd: String(
        row.simd ?? row.SIMD ?? ""
      ).trim(),

      dataset: String(
        row.dataset ?? row.Dataset ?? ""
      ).trim(),

      n_death: parseCount(
        row.n_death ?? row.deaths
      )
    }))
    .filter(row =>
      row.source &&
      row.target &&
      row.stage &&
      Number.isFinite(row.count)
    );
}

document.addEventListener("DOMContentLoaded", async () => {
  svg = d3.select("#sankey");

  setupButtons();
  setupDatasetSelector();
  setupSelectedDiseaseButton();

  await loadDataset(CSV_NATIONAL, "dataset1");
});

/*
 * Load a selected CSV and redraw the dashboard.
 */
async function loadDataset(path, datasetName) {
  try {
    const rawData = await d3.csv(path);

    console.log("CSV loaded:", path);
    console.log("Columns:", rawData.columns);

    allData = normalizeData(rawData);
    currentDataset = datasetName;

    console.log("Normalised rows:", allData.length);
    console.log("Normalised sample:", allData.slice(0, 5));

    updateDemographicControlState();
    drawDashboard();
  } catch (error) {
    console.error("Unable to load dataset:", error);

    allData = [];

    if (svg) {
      svg.selectAll("*").remove();

      svg.append("text")
        .attr("x", 20)
        .attr("y", 40)
        .text("The selected dataset could not be loaded.");
    }
  }
}

function formatStage(stage) {
  const labels = {
    d1: "Disease 1",
    d2: "Disease 2",
    d3: "Disease 3",
    d4: "Disease 4",
    "d1-d2": "Disease 1 → Disease 2",
    "d2-d3": "Disease 2 → Disease 3",
    "d3-d4": "Disease 3 → Disease 4"
  };

  return labels[stage] || stage;
}

/*
 * Return an element value safely.
 */
function getControlValue(selector, fallback = "all") {
  const element = document.querySelector(selector);
  return element ? element.value : fallback;
}

function setupButtons() {
  d3.select("#stageFilter")
    .on("change", drawDashboard);

  d3.select("#frequencyFilter")
    .on("input", drawDashboard);

  d3.select("#diseaseSearch")
    .on("input", drawDashboard);

  d3.select("#sexFilter")
    .on("change", () => {
      resetOtherDemographicFilters("sex");
      drawDashboard();
    });

  d3.select("#ageFilter")
    .on("change", () => {
      resetOtherDemographicFilters("age");
      drawDashboard();
    });

  d3.select("#simdFilter")
    .on("change", () => {
      resetOtherDemographicFilters("simd");
      drawDashboard();
    });

  d3.select("#sankeyBtn")
    .on("click", () => {
      currentView = "sankey";
      setActiveViewButton("sankeyBtn");
      drawDashboard();
    });

  d3.select("#nodeBtn")
    .on("click", () => {
      currentView = "node";
      setActiveViewButton("nodeBtn");
      drawDashboard();
    });

  d3.select("#pathwaysBtn")
    .on("click", () => {
      currentView = "pathways";
      setActiveViewButton("pathwaysBtn");
      drawDashboard();
    });

  d3.select("#zoomInBtn")
    .on("click", () => {
      if (nodeLinkZoom) {
        svg.transition()
          .call(nodeLinkZoom.scaleBy, 1.25);
      }
    });

  d3.select("#zoomOutBtn")
    .on("click", () => {
      if (nodeLinkZoom) {
        svg.transition()
          .call(nodeLinkZoom.scaleBy, 0.8);
      }
    });

  d3.select("#resetZoomBtn")
    .on("click", () => {
      if (nodeLinkZoom) {
        svg.transition()
          .call(
            nodeLinkZoom.transform,
            d3.zoomIdentity
          );
      }
    });

  d3.select("#resetBtn")
    .on("click", resetFilters);
}

function setActiveViewButton(activeId) {
  d3.selectAll(
    "#sankeyBtn, #nodeBtn, #pathwaysBtn"
  ).classed("active-view", false);

  d3.select(`#${activeId}`)
    .classed("active-view", true);
}

/*
 * Dataset 2 does not provide intersections such as:
 * Female + age 18–34 + SIMD 1.
 *
 * Therefore, when one demographic category is selected,
 * the other two are returned to "all".
 */
function resetOtherDemographicFilters(activeType) {
  if (currentDataset !== "dataset2") return;

  if (activeType !== "sex") {
    d3.select("#sexFilter").property("value", "all");
  }

  if (activeType !== "age") {
    d3.select("#ageFilter").property("value", "all");
  }

  if (activeType !== "simd") {
    d3.select("#simdFilter").property("value", "all");
  }
}

function resetFilters() {
  d3.select("#stageFilter")
    .property("value", "all");

  d3.select("#frequencyFilter")
    .property("value", 0);

  d3.select("#diseaseSearch")
    .property("value", "");

  d3.select("#sexFilter")
    .property("value", "all");

  d3.select("#ageFilter")
    .property("value", "all");

  d3.select("#simdFilter")
    .property("value", "all");

  updateSelectedDisease(null);
  drawDashboard();
}

/*
 * Apply frequency, demographic, disease-code and disease-position
 * filters to the loaded data.
 */
function getFilteredData() {
  const minFrequency = Number(
    getControlValue("#frequencyFilter", 0)
  );

  const searchTerm = getControlValue(
    "#diseaseSearch",
    ""
  )
    .trim()
    .toUpperCase();

  const diseasePosition = getControlValue(
    "#stageFilter",
    "all"
  );

  const selectedSex = getControlValue(
    "#sexFilter",
    "all"
  );

  const selectedAge = getControlValue(
    "#ageFilter",
    "all"
  );

  const selectedSIMD = getControlValue(
    "#simdFilter",
    "all"
  );

  d3.select("#frequencyValue")
    .text(minFrequency.toLocaleString());

  let data = allData.filter(row =>
    Number.isFinite(row.count) &&
    row.count >= minFrequency
  );

  /*
   * Apply demographics only to Dataset 2.
   */
  if (currentDataset === "dataset2") {
    if (selectedSex !== "all") {
      data = data.filter(row =>
        row.sex.toLowerCase() ===
        selectedSex.toLowerCase()
      );
    }

    if (selectedAge !== "all") {
      data = data.filter(row =>
        row.age_group === selectedAge
      );
    }

    if (selectedSIMD !== "all") {
      data = data.filter(row =>
        row.simd === selectedSIMD
      );
    }
  }

  /*
   * Search for a disease at a specific position in the
   * complete trajectory.
   *
   * Example:
   * Disease code B52 + Disease 2
   * returns trajectories where disease2 === "B52".
   */
  if (searchTerm !== "") {
    const positionColumns = {
      d1: "disease1",
      d2: "disease2",
      d3: "disease3",
      d4: "disease4"
    };

    if (diseasePosition !== "all") {
      const field = positionColumns[diseasePosition];

      data = data.filter(row =>
        String(row[field] || "")
          .trim()
          .toUpperCase() === searchTerm
      );
    } else {
      data = data.filter(row =>
        [
          row.disease1,
          row.disease2,
          row.disease3,
          row.disease4
        ].some(code =>
          String(code || "")
            .trim()
            .toUpperCase() === searchTerm
        )
      );
    }
  }

  return data;
}

function updateSelectedDisease(code) {
  const selected = d3.select("#selectedDisease");
  const button = document.getElementById(
    "selectedDiseaseRefBtn"
  );

  if (!code) {
    selected.text("No disease selected.");

    if (button) {
      button.hidden = true;
      delete button.dataset.icdCode;
    }

    return;
  }

  selected.text(`Selected disease: ${code}`);

  if (button) {
    button.hidden = false;
    button.dataset.icdCode = code;
  }
}

/*
 * Give each code a unique ID for each disease position.
 *
 * For example, L03 at Disease 1 and L03 at Disease 3 are
 * separate Sankey nodes.
 */
function buildGraph(data) {
  const nodesMap = new Map();

  const transitions = {
    "d1-d2": {
      sourceLevel: 1,
      targetLevel: 2
    },
    "d2-d3": {
      sourceLevel: 2,
      targetLevel: 3
    },
    "d3-d4": {
      sourceLevel: 3,
      targetLevel: 4
    }
  };

  const links = [];

  data.forEach(row => {
    const transition = transitions[row.stage];

    if (!transition) return;

    const sourceId =
      `${row.source}_${transition.sourceLevel}`;

    const targetId =
      `${row.target}_${transition.targetLevel}`;

    nodesMap.set(sourceId, {
      id: sourceId,
      name: row.source,
      level: transition.sourceLevel
    });

    nodesMap.set(targetId, {
      id: targetId,
      name: row.target,
      level: transition.targetLevel
    });

    links.push({
      source: sourceId,
      target: targetId,
      value: row.count,
      stage: row.stage
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links
  };
}

function drawDashboard() {
  if (!svg) return;

  svg.selectAll("*").remove();
  svg.on(".zoom", null);

  nodeLinkZoom = null;

  const container = document.querySelector(".main");

  if (!container) {
    console.error("The .main dashboard panel was not found.");
    return;
  }

  const width = Math.max(
    400,
    container.clientWidth - 30
  );

  const height = 560;

  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  const data = getFilteredData();
  const graph = buildGraph(data);

  console.log("Current view:", currentView);
  console.log("Filtered rows:", data.length);
  console.log(
    "Graph:",
    graph.nodes.length,
    "nodes and",
    graph.links.length,
    "links"
  );

  if (data.length === 0 || graph.links.length === 0) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .text(
        "No data are available for the selected filters."
      );

    updateInsights([]);
    updateSelectedDisease(null);
    return;
  }

  if (currentView === "sankey") {
    drawSankey(svg, graph, width, height);
  } else if (currentView === "node") {
    drawNodeLink(svg, graph, width, height);
  } else if (currentView === "pathways") {
    drawCommonPathways(svg, data, width, height);
  }

  updateInsights(data);
}

function setupDatasetSelector() {
  const datasetSelect =
    document.getElementById("datasetSelect");

  if (!datasetSelect) return;

  datasetSelect.addEventListener(
    "change",
    async event => {
      resetFilters();

      if (event.target.value === "dataset2") {
        await loadDataset(
          CSV_FIFE_TAYSIDE,
          "dataset2"
        );
      } else {
        await loadDataset(
          CSV_NATIONAL,
          "dataset1"
        );
      }
    }
  );
}

/*
 * Disable demographic controls when the national dataset is used,
 * because it contains no demographic subgroups.
 */
function updateDemographicControlState() {
  const disabled = currentDataset !== "dataset2";

  ["sexFilter", "ageFilter", "simdFilter"]
    .forEach(id => {
      const control = document.getElementById(id);

      if (control) {
        control.disabled = disabled;

        if (disabled) {
          control.value = "all";
        }
      }
    });
}

function setupSelectedDiseaseButton() {
  const button = document.getElementById(
    "selectedDiseaseRefBtn"
  );

  if (!button) return;

  button.addEventListener("click", () => {
    const code = button.dataset.icdCode;
    const modal = document.getElementById("ICDModal");

    if (!code || !modal) return;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  });
}