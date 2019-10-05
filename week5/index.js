/**
 * Student: Andrew Liu
 */

let x = 0;
let y = 0;
let interval = 1;
let direction = 1;
let characterColor = "white";

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  const { walkerWidth, walkerHeight } = calcSize();
  const { x, y } = calcPosition(walkerWidth);
  const walker = new NYCWalker(x, y, walkerWidth, walkerHeight, characterColor);
  walker.draw();
}

class NYCWalker {
  constructor(
    positionX,
    positionY,
    characterWidth,
    characterHeight,
    characterColor
  ) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.characterWidth = characterWidth;
    this.characterHeight = characterHeight;
    this.characterColor = characterColor;
    this.baseWidth = 100;
    this.baseHeight = 150;
  }

  draw() {
    background(0);
    strokeWeight(this.characterWidth / 42);
    stroke(this.characterColor);
    this.drawHead();
    this.drawTorso();
    this.drawLeftArm();
    this.drawRightArm();
    this.drawLeftLeg();
    this.drawRightLeg();
  }

  /**
   * Scales and draws walker based on window size.
   * @param {object} coordinates
   */
  drawDots(coordinates) {
    coordinates
      .map(([x, y]) => [
        (x * this.characterWidth) / this.baseWidth + this.positionX,
        (y * this.characterHeight) / this.baseHeight + this.positionY
      ])
      .forEach(([x, y]) => point(x, y));
  }

  drawHead() {
    this.drawDots([
      [64, 5],
      [70, 11],
      [68, 20],
      [60, 23],
      [55, 16],
      [56, 9],
      [62, 14],
      [64, 29],
      [57, 34],
      [53, 26]
    ]);
  }
  drawTorso() {
    this.drawDots([
      [45, 44],
      [52, 50],
      [55, 58],
      [53, 69],
      [52, 78],
      [47, 84],
      [38, 77],
      [30, 78],
      [31, 68],
      [32, 60],
      [35, 50],
      [42, 52],
      [48, 60],
      [45, 71],
      [40, 66]
    ]);
  }
  drawLeftArm() {
    this.drawDots([
      [44, 29],
      [34, 34],
      [24, 38],
      [15, 43],
      [12, 53],
      [11, 64],
      [9, 74],
      [16, 69],
      [18, 59],
      [20, 50],
      [28, 44],
      [37, 41],
      [47, 36]
    ]);
  }
  drawRightArm() {
    this.drawDots([
      [67, 40],
      [69, 50],
      [74, 59],
      [83, 67],
      [92, 72],
      [84, 74],
      [76, 70],
      [69, 65],
      [65, 58],
      [61, 49],
      [57, 42]
    ]);
  }
  drawLeftLeg() {
    this.drawDots([
      [40, 91],
      [36, 101],
      [32, 112],
      [26, 123],
      [21, 135],
      [16, 146],
      [6, 145],
      [10, 137],
      [14, 126],
      [18, 116],
      [23, 106],
      [26, 96],
      [30, 87]
    ]);
  }
  drawRightLeg() {
    this.drawDots([
      [55, 87],
      [61, 97],
      [64, 108],
      [67, 121],
      [70, 132],
      [72, 144],
      [63, 143],
      [60, 132],
      [57, 119],
      [53, 108],
      [47, 98]
    ]);
  }
}

/**
 * Controls walker moving speed with mouse click or screen tap. Three speeds available.
 */
function mouseClicked() {
  if (interval === 100) {
    interval = 1;
  } else {
    interval *= 10;
  }
}

/**
 * Controls walker color with double click with mouse.
 */
function doubleClicked() {
  if (characterColor === "white") {
    characterColor = "red";
  } else {
    characterColor = "white";
  }
}

// Utility functions ---------------------------

/**
 * Calculates walker positions so that our walker can walk back and forth as well
 * as staying in the middle in the window vertically.
 * @param {number} walkerWidth
 */
function calcPosition(walkerWidth) {
  if (x + walkerWidth > windowWidth) {
    direction = -1;
  } else if (x < 0) {
    direction = 1;
  }
  x += direction * interval;
  if (windowHeight >= windowWidth) {
    y = windowHeight / 4;
  }
  return { x, y };
}

/**
 * Calculates walker size. If the window is in landscape, just fit the walker within
 * the window height. If the window is in portrait, then the walker only fits 2/3 of
 * the window height.
 */
function calcSize() {
  let walkerWidth, walkerHeight;
  if (windowHeight >= windowWidth) {
    walkerHeight = windowHeight / 2;
    walkerWidth = walkerHeight / 1.5;
  } else {
    walkerHeight = windowHeight;
    walkerWidth = walkerHeight / 1.5;
  }
  return { walkerWidth, walkerHeight };
}
