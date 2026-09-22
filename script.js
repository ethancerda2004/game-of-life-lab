const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const columns = canvas.width / cellSize;
const rows = canvas.height / cellSize;

function drawGrid() {
  ctx.strokeStyle = "#cccccc";

  for (let x = 0; x <= canvas.width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

drawGrid();
const grid = Array.from(
  { length: rows },
  () => Array(columns).fill(0)
);

function drawCells() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (grid[row][column] === 1) {
        ctx.fillStyle = "#222222";
        ctx.fillRect(
          column * cellSize,
          row * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  drawGrid();
}

canvas.addEventListener("click", function (event) {
  const rectangle = canvas.getBoundingClientRect();

  const x = event.clientX - rectangle.left;
  const y = event.clientY - rectangle.top;

  const column = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  grid[row][column] = grid[row][column] === 0 ? 1 : 0;

  drawCells();
});

drawCells();

function countNeighbors(row, column) {
  let neighbors = 0;

  for (let rowChange = -1; rowChange <= 1; rowChange++) {
    for (let columnChange = -1; columnChange <= 1; columnChange++) {
      if (rowChange === 0 && columnChange === 0) {
        continue;
      }

      const neighborRow = row + rowChange;
      const neighborColumn = column + columnChange;

      const isInsideGrid =
        neighborRow >= 0 &&
        neighborRow < rows &&
        neighborColumn >= 0 &&
        neighborColumn < columns;

      if (isInsideGrid) {
        neighbors += grid[neighborRow][neighborColumn];
      }
    }
  }

  return neighbors;
}

function stepSimulation() {
  const nextGrid = Array.from(
    { length: rows },
    () => Array(columns).fill(0)
  );

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const neighbors = countNeighbors(row, column);
      const isAlive = grid[row][column] === 1;

      if (isAlive && survivalRules.includes(neighbors)) {
        nextGrid[row][column] = 1;
      }

      if (!isAlive && birthRules.includes(neighbors)) {
        nextGrid[row][column] = 1;
      }
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (Math.random() < noiseProbability) {
        nextGrid[row][column] = 1 - nextGrid[row][column];
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      grid[row][column] = nextGrid[row][column];
    }
  }

  drawCells();
}

document
  .getElementById("stepButton")
  .addEventListener("click", stepSimulation);

  let simulationTimer = null;

function runSimulation() {
  if (simulationTimer === null) {
    const speed = Number(document.getElementById("speedSlider").value);
simulationTimer = setInterval(stepSimulation, 1100 - speed * 100);
  }
}

function pauseSimulation() {
  clearInterval(simulationTimer);
  simulationTimer = null;
}

function resetSimulation() {
  pauseSimulation();

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      grid[row][column] = 0;
    }
  }

  drawCells();
}

document
  .getElementById("runButton")
  .addEventListener("click", runSimulation);

document
  .getElementById("pauseButton")
  .addEventListener("click", pauseSimulation);

document
  .getElementById("resetButton")
  .addEventListener("click", resetSimulation);

  document
  .getElementById("speedSlider")
  .addEventListener("input", function () {
    if (simulationTimer !== null) {
      pauseSimulation();
      runSimulation();
    }
  });

  function randomizeGrid() {
  pauseSimulation();

  const density = Number(
    document.getElementById("densitySlider").value
  );

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      grid[row][column] = Math.random() < density ? 1 : 0;
    }
  }

  drawCells();
}

document
  .getElementById("randomButton")
  .addEventListener("click", randomizeGrid);

  let birthRules = [3];
let survivalRules = [2, 3];

function applyRules() {
  const birthText = document.getElementById("birthRule").value;
  const survivalText = document.getElementById("survivalRule").value;

  const validRule = /^[0-8]*$/;

  if (!validRule.test(birthText) || !validRule.test(survivalText)) {
    alert("Rules can only contain numbers from 0 through 8.");
    return;
  }

  birthRules = birthText.split("").map(Number);
  survivalRules = survivalText.split("").map(Number);

  document.getElementById("ruleDisplay").textContent =
    `B${birthText}/S${survivalText}`;

  pauseSimulation();
}

document
  .getElementById("applyRulesButton")
  .addEventListener("click", applyRules);

  function createRandomRule() {
  const birth = [];
  const survival = [];

  for (let count = 0; count <= 8; count++) {
    if (Math.random() < 0.5) {
      birth.push(count);
    }

    if (Math.random() < 0.5) {
      survival.push(count);
    }
  }

  return { birth, survival };
}

function createExperimentGrid(size, density) {
  return Array.from(
    { length: size },
    () =>
      Array.from(
        { length: size },
        () => Math.random() < density ? 1 : 0
      )
  );
}

function countExperimentNeighbors(testGrid, row, column) {
  let neighbors = 0;
  const size = testGrid.length;

  for (let rowChange = -1; rowChange <= 1; rowChange++) {
    for (
      let columnChange = -1;
      columnChange <= 1;
      columnChange++
    ) {
      if (rowChange === 0 && columnChange === 0) {
        continue;
      }

      const neighborRow = row + rowChange;
      const neighborColumn = column + columnChange;

      if (
        neighborRow >= 0 &&
        neighborRow < size &&
        neighborColumn >= 0 &&
        neighborColumn < size
      ) {
        neighbors += testGrid[neighborRow][neighborColumn];
      }
    }
  }

  return neighbors;
}

function stepExperimentGrid(testGrid, birth, survival) {
  const size = testGrid.length;
  const nextGrid = Array.from(
    { length: size },
    () => Array(size).fill(0)
  );

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const neighbors =
        countExperimentNeighbors(testGrid, row, column);

      const isAlive = testGrid[row][column] === 1;

      if (isAlive && survival.includes(neighbors)) {
        nextGrid[row][column] = 1;
      }

      if (!isAlive && birth.includes(neighbors)) {
        nextGrid[row][column] = 1;
      }
    }
  }

  return nextGrid;
}

function countExperimentCells(testGrid) {
  return testGrid
    .flat()
    .reduce((total, cell) => total + cell, 0);
}

function experimentGridKey(testGrid) {
  return testGrid.flat().join("");
}

function testRule(rule) {
  const size = 18;
  const densities = [0.15, 0.30, 0.50];
  const outcomes = [];
  const finalDensities = [];
  const activities = [];

  for (const startingDensity of densities) {
    let testGrid =
      createExperimentGrid(size, startingDensity);

    const initialLive = countExperimentCells(testGrid);
    const seenGrids = new Map();
    let outcome = "active";
    let activity = 0;

    for (let generation = 0; generation < 50; generation++) {
      const key = experimentGridKey(testGrid);

      if (seenGrids.has(key)) {
        const period = generation - seenGrids.get(key);
        outcome = period === 1 ? "stable" : "oscillation";
        break;
      }

      seenGrids.set(key, generation);

      const nextGrid = stepExperimentGrid(
        testGrid,
        rule.birth,
        rule.survival
      );

      let changedCells = 0;

      for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
          if (testGrid[row][column] !== nextGrid[row][column]) {
            changedCells++;
          }
        }
      }

      activity = changedCells / (size * size);
      testGrid = nextGrid;

      if (countExperimentCells(testGrid) === 0) {
        outcome = "extinction";
        break;
      }
    }

    const finalLive = countExperimentCells(testGrid);
    const finalDensity = finalLive / (size * size);
    const initialDensity = initialLive / (size * size);

    if (outcome === "active") {
      if (finalDensity > initialDensity + 0.15) {
        outcome = "growth";
      } else if (activity > 0.15) {
        outcome = "disorder";
      } else {
        outcome = "mixed";
      }
    }

    outcomes.push(outcome);
    finalDensities.push(finalDensity);
    activities.push(activity);
  }

  const outcomeCounts = {};

  for (const outcome of outcomes) {
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
  }

  const category = Object.keys(outcomeCounts).reduce(
    (best, current) =>
      outcomeCounts[current] > outcomeCounts[best]
        ? current
        : best
  );

  const averageFinalDensity =
    finalDensities.reduce((sum, value) => sum + value, 0) /
    finalDensities.length;

  const averageActivity =
    activities.reduce((sum, value) => sum + value, 0) /
    activities.length;

  return {
    category,
    averageFinalDensity,
    averageActivity
  };
}

function sampleOneHundredRules() {
  const button = document.getElementById("sampleRulesButton");
  const summary = document.getElementById("experimentSummary");
  const output = document.getElementById("experimentResults");

  button.disabled = true;
  summary.textContent =
    "Running 300 simulations. Please wait...";
  output.textContent = "";

  setTimeout(function () {
    const results = [];
    const categoryCounts = {};

    for (let number = 1; number <= 100; number++) {
      const rule = createRandomRule();
      const measurement = testRule(rule);

      const ruleName =
        `B${rule.birth.join("")}/S${rule.survival.join("")}`;

      results.push({
        ruleName,
        ...measurement
      });

      categoryCounts[measurement.category] =
        (categoryCounts[measurement.category] || 0) + 1;
    }

    const categorySummary = Object.entries(categoryCounts)
      .map(([category, count]) => `${category}: ${count}`)
      .join(" | ");

    summary.textContent =
      `Completed 100 rules × 3 starting configurations. ${categorySummary}`;

    output.textContent = results
      .map(
        (result, index) =>
          `${index + 1}. ${result.ruleName} | ` +
          `${result.category} | final density: ` +
          `${(result.averageFinalDensity * 100).toFixed(1)}% | ` +
          `activity: ${(result.averageActivity * 100).toFixed(1)}%`
      )
      .join("\n");

    button.disabled = false;
  }, 50);
}

document
  .getElementById("sampleRulesButton")
  .addEventListener("click", sampleOneHundredRules);

  let noiseProbability = 0;

const noiseSlider = document.getElementById("noiseSlider");
const noiseValue = document.getElementById("noiseValue");

noiseSlider.addEventListener("input", function () {
  noiseProbability = Number(noiseSlider.value);
  noiseValue.textContent = `${(noiseProbability * 100).toFixed(1)}%`;
});