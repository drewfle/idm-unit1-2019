let hasUserClickedOrTouched = false;
let img;
let coordinateRecords = [];

function preload() {
  img = loadImage("walk.jpg");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // image(img, 0, 0, 100, 150);
}
function draw() {
  stroke(255);
  strokeWeight(3);
  const walker = new NYCWalk(0, 0, 400, 600, "red");
  point(100, 150);
  walker.draw();
}

// Utility functions ---

function calcPosition() {
  return [mouseX, mouseY];
}
function calcSize() {
  
}

// file:///Users/drewfle/Dev/drewfle-github/idm-unit1-2019/week5/index.html
// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
class NYCWalk {
  constructor(
    positionX,
    positionY,
    characterWidth, // 1
    characterHeight, // 2
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
    this.drawHead();
    this.drawTorso();
    this.drawLeftArm();
    this.drawRightArm();
    this.drawLeftLeg();
    this.drawRightLeg();
  }

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
 * Checks if user mouse cursor or
 */
function checkHasUserClickedOrTouched() {
  if (
    !hasUserClickedOrTouched &&
    (touches.length || (mouseX === 0 && mouseY === 0))
  ) {
    hasUserClickedOrTouched = true;
  }
  return hasUserClickedOrTouched;
}

function mouseClicked() {
  coordinateRecords.push([mouseX, mouseY]);
}
function doubleClicked() {
  coordinateRecords = coordinateRecords.slice(0, coordinateRecords.length - 1);
  console.log(JSON.stringify(coordinateRecords));
}
