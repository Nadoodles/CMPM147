// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// Add the generateGrid function here
function generateGrid(numCols, numRows) {
  let grid = [];
  
  // Initialize the grid with empty cells
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  // Define the number of rectangles and their sizes
  const numRectangles = 3;
  const minRectSize = 3; // Smaller minimum rectangle size
  const maxRectSize = 5; // Smaller maximum rectangle size
  
  // Generate non-overlapping rectangles
  const rectangles = [];
  for (let r = 0; r < numRectangles; r++) {
    let rectWidth, rectHeight, rectX, rectY;
    do {
      rectWidth = floor(random(minRectSize, maxRectSize));
      rectHeight = floor(random(minRectSize, maxRectSize));
      rectX = floor(random(numCols - rectWidth));
      rectY = floor(random(numRows - rectHeight));
    } while (!isRectangleValid(rectX, rectY, rectWidth, rectHeight, rectangles));
    
    rectangles.push({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });
    
    // Fill the rectangle with '.'
    for (let i = rectX; i < rectX + rectWidth; i++) {
      for (let j = rectY; j < rectY + rectHeight; j++) {
        grid[i][j] = ".";
      }
    }
  }
  
  // Place a chest tile randomly in the center of one rectangle
  const randomRect = rectangles[floor(random(rectangles.length))];
  const chestX = randomRect.x + floor(random(randomRect.width));
  const chestY = randomRect.y + floor(random(randomRect.height));
  grid[chestX][chestY] = "C"; // Assume "C" represents a chest tile
  
  // Connect the rectangles with lines
  const connectedRectangles = new Set(); // Keep track of connected rectangles
  for (let i = 0; i < rectangles.length; i++) {
    const rectA = rectangles[i];
    const randomPointA = { x: floor(random(rectA.x, rectA.x + rectA.width)), y: floor(random(rectA.y, rectA.y + rectA.height)) };
    for (let j = i + 1; j < rectangles.length; j++) {
      const rectB = rectangles[j];
      if (!connectedRectangles.has(`${i}-${j}`)) { // Check if the rectangles are already connected
        const randomPointB = { x: floor(random(rectB.x, rectB.x + rectB.width)), y: floor(random(rectB.y, rectB.y + rectB.height)) };
      
        // Connect the two random points with a line
        connectPoints(grid, randomPointA, randomPointB);
        
        // Mark the rectangles as connected
        connectedRectangles.add(`${i}-${j}`);
      }
    }
  }
  
  return grid;
}

function connectPoints(grid, pointA, pointB) {
  let x = pointA.x;
  let y = pointA.y;
  while (x !== pointB.x || y !== pointB.y) {
    const dx = pointB.x - x;
    const dy = pointB.y - y;
    if (random() < 0.5 && dx !== 0) {
      x += dx > 0 ? 1 : -1;
    } else {
      y += dy > 0 ? 1 : -1;
    }
    if (grid[x][y] !== ".") grid[x][y] = "T"; // Change the tunnel symbol here
  }
}

function isRectangleValid(x, y, width, height, rectangles) {
  for (const rect of rectangles) {
    const dx = Math.min(Math.abs(x - rect.x), Math.abs(x + width - rect.x - rect.width));
    const dy = Math.min(Math.abs(y - rect.y), Math.abs(y + height - rect.y - rect.height));
    if (dx < 7 && dy < 7) {
      return false;
    }
  }
  return true;
}






function gridCheck(grid, i, j, target) {  
  return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && grid[i][j] === target;
}


function gridCode(grid, i, j, target) {
  let code = 0;
  if (gridCheck(grid, i - 1, j, target)) code += 1; // North
  if (gridCheck(grid, i + 1, j, target)) code += 2; // South
  if (gridCheck(grid, i, j + 1, target)) code += 4; // East
  if (gridCheck(grid, i, j - 1, target)) code += 8; // West
  return code;
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code] || [0, 0]; // Default offset is (0, 0) if lookup[code] is null
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

const lookup = [
  [1,1],
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];


function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, floor(random(1, 4)), 15);  
      } else if (gridCheck(grid, i, j, "T")){
        placeTile(i, j, floor(random(7, 8)), 24); 
      } else {
        drawContext(grid, i, j, ".", floor(random(22, 24)), 21);

      }
    }
  }
}
