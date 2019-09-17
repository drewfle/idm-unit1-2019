/**
 * Student: Andrew Liu
 * Wall Drawing #130 (1972) Grid and arcs from four corners.
 *
 * Just realized we have two assignments instead of one. So quickly designed a recursive
 * drawGrid function and a simple drawArcs function.
 */

const eighteenPercentGray = 124;
let centerX;
let centerY;

function setup() {
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  noFill();
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  stroke(eighteenPercentGray);
  drawGrid();
  stroke(0);
  drawArcs();
}

function drawArcs() {
  arc(centerX, 0, windowWidth, windowHeight, 0, PI);
  arc(windowWidth, centerY, windowWidth, windowHeight, HALF_PI, HALF_PI);
  arc(centerX, windowHeight, windowWidth, windowHeight, PI, 0);
  arc(0, centerY, windowWidth, windowHeight, HALF_PI, HALF_PI);
}

function drawGrid() {
  const deltaY = centerY * Math.tan(radians(45));
  const centerX = windowWidth / 2;
  const x1 = centerX - deltaY;
  const y1 = windowHeight;
  const x2 = centerX + deltaY;
  const y2 = 0;
  const x3 = centerX - deltaY;
  const y3 = 0;
  const x4 = centerX + deltaY;
  const y4 = windowHeight;
  line(centerX - deltaY, windowHeight, centerX + deltaY, 0);
  line(centerX - deltaY, 0, centerX + deltaY, windowHeight);
  keepDrawingLines(x1, y1, x2, y2, x3, y3, x4, y4, 1);
}

function keepDrawingLines(x1, y1, x2, y2, x3, y3, x4, y4, i = 1) {
  const interval = 30 * i;
  const deltaX = interval / Math.cos(radians(45));
  if (
    x2 - deltaX < 0 ||
    x1 + deltaX > windowWidth ||
    x3 + deltaX > windowWidth ||
    x4 - deltaX < 0
  ) {
    return;
  }
  line(x1 - deltaX, windowHeight, x2 - deltaX, 0);
  line(x1 + deltaX, windowHeight, x2 + deltaX, 0);
  line(x3 + deltaX, 0, x4 + deltaX, windowHeight);
  line(x3 - deltaX, 0, x4 - deltaX, windowHeight);
  keepDrawingLines(x1, y1, x2, y2, x3, y3, x4, y4, ++i);
}
