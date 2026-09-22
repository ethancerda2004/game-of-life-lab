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