/**
 * Wall Drawing #130 (1972) Grid and arcs from four corners.
 */

const eighteenPercentGray = 124;
let slope;

function setup() {
  slope = windowHeight / windowWidth;
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(eighteenPercentGray);

  // while() {
  // line(x1, y1, x2, y2)
  // line(x3, y3, x4, y4)
  // }
  line(0, 0, 10, 10);
}

function keepDrawingLines(
  x1 = 0,
  y1 = 0,
  x2 = windowWidth,
  y2 = windowHeight,
  x3 = windowWidth,
  y3 = 0,
  x4 = 0,
  y4 = windowHeight
) {
  // add stop case
  // draw first line
  if (x1 === 0 && y1 === 0 && x2 === windowWidth && y2 === windowHeight) {
    line(x1, y1, x2, y2);
  }
  if (x3 === windowWidth && y3 === 0 && x4 === 0 && y4 === windowHeight) {
    line(x3, y3, x4, y4);
  }
  line(x1, y1, x2, y2);
  line(x3, y3, x4, y4);
  keepDrawingLines(x1, y1, x2, y2, x3, y3, x4, y4);
}
