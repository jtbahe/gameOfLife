let rows = 75;
let cols = 75;
let playing = false;
let timer;
let reproductionTime = 500;

let grid = new Array(rows);
let nextGrid = new Array(rows);

function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// initialize
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

//Lay out the grid
function createTable() {
  let gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    console.error("Problem: no div for the grid table");
  }
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

function cellClickHandler() {
  let rowcol = this.id.split("_");
  let row = rowcol[0];
  let col = rowcol[1];

  let classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      var cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
}

function setupControlButtons() {
  let startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  let clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  let randomButton = document.getElementById("random");
  randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
  if (playing) return;
  clearButtonHandler();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let isLive = Math.round(Math.random());
      if (isLive == 1) {
        let cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

function clearButtonHandler() {
  console.log("clear the game: stop playing, clear the grid");

  playing = false;
  let startButton = document.getElementById("start");
  startButton.innerHTML = "start";

  clearTimeout(timer);

  let cellsList = document.getElementsByClassName("live");
  let cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids();
}

// start/pause/contine the game
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "continue";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "pause";
    play();
  }
}

// run the game
function play() {
  computeNextGen();
  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  copyAndResetGrid();

  updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}

function countNeighbors(row, col) {
  var count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

window.onload = initialize;
