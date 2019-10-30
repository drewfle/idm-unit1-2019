/**
 * Global variables
 */
const colors = {};
let stingCircleMatrix;

/**
 * Custom class
 */

/**
 * Group utility functions inside a Util class as static methods.
 */
class Util {
  static get maxViewportSize() {
    return Math.max(windowWidth, windowHeight);
  }
}

class StingCircle {
  constructor({
    circleColor,
    stingColor,
    circleX,
    circleY,
    circleRadius,
    stingLength,
    stingDirection
  }) {
    this.circleColor = circleColor;
    this.stingColor = stingColor;
    this.circleX = circleX;
    this.circleY = circleY;
    this.stingLength = stingLength;
    this.stingDirection = stingDirection;
    this.circleRadius = circleRadius;
    this.circleDiameter = this.circleRadius * 2;
    this.stingBaseX1 = this.calcCirclePointX(40);
    this.stingBaseY1 = this.calcCirclePointY(40);
    this.stingBaseX2 = this.calcCirclePointX(50);
    this.stingBaseY2 = this.calcCirclePointY(50);
  }
  render(distance) {
    stroke(0);
    circle(this.circleX, this.circleY, this.circleDiameter);
    this.renderSting(distance);
  }
  /**
   * Renders sting-shaped triangle.
   * @param {number} distance
   */
  renderSting(distance) {
    // Sting apex has a base position on the circle.
    const baseX = this.calcCirclePointX(45);
    const baseY = this.calcCirclePointY(45);
    const x = baseX + distance;
    const y = baseY - distance;
    beginShape();
    // Order matters here cuz we'll only draw two lines.
    vertex(this.stingBaseX1, this.stingBaseY1);
    vertex(x, y);
    vertex(this.stingBaseX2, this.stingBaseY2);
    endShape(); // No close for retaining circle arc shape.
  }
  /**
   * Calculates coordinate x on a circle.
   * @param {number} degree
   * @param {number} radius
   */
  calcCirclePointX(degree, radius = this.circleRadius) {
    return this.circleX + radius * sin(radians(degree));
  }
  /**
   * Calculates coordinate y on a circle.
   * @param {number} degree
   * @param {number} radius
   */
  calcCirclePointY(degree, radius = this.circleRadius) {
    return this.circleY - radius * cos(radians(degree));
  }
}

/**
 * Stores and renders a matrix of sting circles to fill the screen.
 */
class StingCircleMatrix {
  constructor(rows, columns, offsetX = 0, offsetY = 0) {
    this.rows = rows;
    this.columns = columns;
    this.gapX = windowWidth / (this.rows + 1);
    this.gapY = windowHeight / (this.columns + 1);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.circleRadius = (this.gapX + this.gapY) / 5;
    this.circleDiameter = this.circleRadius * 2;
    this.matrix = [];
    this.angle = 0;
    this.freeze = false;
    this.speed = 200;
    this.controls = {};
    this.initControls();
    this.initStingCircles();
  }
  /**
   * Initializes controls for the assignment parameters
   */
  initControls() {
    // createSlider(min, max, [value], [step])
    this.controls.stingLengthText = createP("sting length");
    this.controls.stingLengthText.position(
      windowWidth / 100,
      windowHeight / 100
    );
    this.controls.stingLengthText.style("color", "red");
    this.controls.stingLength = createSlider(
      0,
      this.circleDiameter,
      this.circleRadius
    );
    this.controls.stingLength.position(windowWidth / 100, windowHeight / 100);
    this.controls.stingLength.style("width", `${windowWidth / 5}px`);
    // this.controls.color = createSlider(0, 0, 0);
    // this.controls.speed = createSlider(0, 0, 0);
    // this.controls.freeze = createRadio();
  }
  /**
   * Initializes sting circles in the matrix
   */
  initStingCircles() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (this.matrix[row] === undefined) {
          this.matrix[row] = [];
        }
        const baseX = this.offsetX + this.gapX;
        const baseY = this.offsetY + this.gapY;
        this.matrix[row][col] = new StingCircle({
          circleColor: colors.white,
          stingColor: colors.white,
          circleX: baseX + row * this.gapX,
          circleY: baseY + col * this.gapY,
          circleRadius: this.circleRadius,
          stingLength: 1,
          stingDirection: 1
        });
      }
    }
  }
  // render(distance = this.circleRadius) {
  render() {
    const distance = this.controls.stingLength.value();
    // Not calculating distance in StingCircle to improve performance.
    // Only updates angle when freeze is false
    if (!this.freeze) {
      this.angle = (frameCount / this.speed) * TWO_PI;
    }
    const dist = distance * cos(this.angle);
    this.matrix.forEach(row => row.forEach(col => col.render(dist)));
  }
  toggleFreeze() {
    this.freeze = !this.freeze;
  }
}

// class Controls {
//   constructor(stingLengthMin,stingLengthMax) {
//     this.stingLength = createSlider(stingLengthMin, stingLengthMac, 0);
//   }
// }

/**
 * P5 hooks
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  colors.white = "white";
  const rows = Math.floor(windowWidth / 120);
  const columns = Math.floor(windowHeight / 120);
  stingCircleMatrix = new StingCircleMatrix(rows, columns);
}
function draw() {
  background(255);
  stingCircleMatrix.render();
}
