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
  interval = isMobileUA() ? windowHeight / 90 : windowHeight / 180;
  movingY = 0;
  createCanvas(windowWidth, windowHeight);
  background(255);
}
function draw() {
  // Clear vertices from previous frame
  background(255);
  drawTriangle();
  moveLine();
}

/**
 * Draws an upside down triangle filled with gray gradient
 */
function drawTriangle() {
  const loX = halfW;
  const hiY = 0;
  beginShape(LINES);
  for (let loY = interval; loY <= windowHeight; loY += interval) {
    // Create gray gradient strokes
    stroke(255 - (loY * 255) / windowHeight);
    const delta = slope * loY;
    const hiRightX = loX + delta;
    const hiLeftX = loX - delta;
    vertex(hiRightX, hiY);
    vertex(loX, loY);
    vertex(hiLeftX, hiY);
    vertex(loX, loY);
  }
  endShape();
}

/**
 * Animates the line that creates moire as it approaches the apex of triangle
 */
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

/**
 * Fixes an issue in smaller mobile browser where line gaps are too tight
 */
function isMobileUA() {
  return [/Android/i, /iPhone/i].some(regex =>
    navigator.userAgent.match(regex)
  );
}
