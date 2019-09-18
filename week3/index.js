/**
 * Student: Andrew Liu
 * Making linear micro moire patterns.
 */

const eighteenPercentGray = 124;
let halfW;
let slope;
let interval;
let movingY;
let increment = 1;
let oneThirdH;

function setup() {
  halfW = windowWidth / 2;
  slope = halfW / windowHeight;
  interval = windowHeight / 123;
  movingY = 0;
  createCanvas(windowWidth, windowHeight);
  background(255);
}
function draw() {
  background(255);
  drawTriangle();
  moveLine();
}

function drawTriangle() {
  const loX = halfW;
  const hiY = 0;
  beginShape(LINES);
  for (let loY = interval; loY <= windowHeight; loY += interval) {
    stroke(255 - (loY * 255) / windowHeight);
    const hiRightX = loX + slope * loY;
    const hiLeftX = loX - slope * loY;
    vertex(hiRightX, hiY);
    vertex(loX, loY);
    vertex(hiLeftX, hiY);
    vertex(loX, loY);
  }
  endShape();
}

function moveLine() {
  stroke(eighteenPercentGray);
  if (movingY === windowHeight) {
    increment = -1;
  }
  if (movingY === 0) {
    increment = 1;
  }
  movingY += increment;
  beginShape(LINES);
  vertex(windowWidth, 0);
  vertex(halfW, movingY);
  vertex(0, 0);
  vertex(halfW, movingY);
  endShape();
}
