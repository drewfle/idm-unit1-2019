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
  noLoop();
}

function draw() {
  background(eighteenPercentGray);
  keepDrawingLines();
}
function keepDrawingLines(line1 = {}, line2 = {}, i = 1) {
  console.log(i);
  console.log(line1);
  console.log(line2);
  const interval = 30 * i;
  const deltaX = interval / Math.cos(radians(45));
  if (i > 30) {
    return;
  }
  if (
    line1.x2 < 0 ||
    line1.x1 > windowWidth ||
    line2.x1 > windowWidth ||
    line2.x2 < 0
  ) {
    return;
  }
  if (!Object.keys(line1).length && !Object.keys(line2).length) {
    const deltaY = centerY * Math.tan(radians(45));
    line1.x1 = centerX - deltaY;
    line1.y1 = windowHeight;
    line1.x2 = centerX + deltaY;
    line1.y2 = 0;
    line(...Object.values(line1));
    line2.x1 = centerX - deltaY;
    line2.y1 = 0;
    line2.x2 = centerX + deltaY;
    line2.y2 = windowHeight;
    line(...Object.values(line2));
  }

  line(line1.x1 - deltaX, windowHeight, line1.x2 - deltaX, 0);
  line(line1.x1 + deltaX, windowHeight, line1.x2 + deltaX, 0);
  line(line2.x1 + deltaX, 0, line2.x2 + deltaX, windowHeight);
  line(line2.x1 - deltaX, 0, line2.x2 - deltaX, windowHeight);

  keepDrawingLines(line1, line2, ++i);
}
