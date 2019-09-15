/**
 * Wall Drawing #130 (1972) Grid and arcs from four corners.
 */

const eighteenPercentGray = 124;
let centerX;
let centerY;
let slope;

function setup() {
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  slope = windowHeight / windowWidth;
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(eighteenPercentGray);
  keepDrawingLines();
}

function keepDrawingLines(line1 = {}, line2 = {}) {
  if (!Object.keys(line1).length) {
    line1.x1 = centerX - centerY * Math.tan(radians(45));
    line1.y1 = windowHeight;
    line1.x2 = centerX + centerY * Math.tan(radians(45));
    line1.y2 = 0;
    line(...Object.values(line1));
  }
  if (!Object.keys(line2).length) {
    line2.x1 = centerX - centerY * Math.tan(radians(45));
    line2.y1 = 0;
    line2.x2 = centerX + centerY * Math.tan(radians(45));
    line2.y2 = windowHeight;
    line(...Object.values(line2));
  }

  // keepDrawingLines(line1, line2);
  // line(20, windowHeight, 300, 0);
}
