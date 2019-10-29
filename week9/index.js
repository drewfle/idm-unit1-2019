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
  render() {
    stroke(0);
    circle(this.circleX, this.circleY, this.circleDiameter);
    this.renderSting(this.circleDiameter);
  }
  /**
   * Renders sting-shaped triangle.
   * @param {number} distance
   * @param {number} direction
   */
  renderSting(distance = this.circleRadius, direction = 1) {
    const x = this.calcCirclePointX(45 * direction, distance);
    const y = this.calcCirclePointY(45 * direction, distance);
    beginShape();
    // Order matters here cuz we'll only draw two lines.
    vertex(this.stingBaseX1, this.stingBaseY1);
    vertex(x, y);
    vertex(this.stingBaseX2, this.stingBaseY2);
    endShape(); // No close to retain circle arc shape.
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
    this.gapX = windowWidth / this.rows;
    this.gapY = windowHeight / this.columns;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.circleRadius = Util.maxViewportSize / 30;
    this.matrix = [];
    this.init();
  }
  init() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (this.matrix[row] === undefined) {
          this.matrix[row] = [];
        }
        const x = this.offsetX + this.gapX / 2;
        const y = this.offsetY + this.gapY / 2;
        this.matrix[row][col] = new StingCircle({
          circleColor: colors.white,
          stingColor: colors.white,
          circleX: x + row * this.gapX,
          circleY: y + col * this.gapY,
          circleRadius: this.circleRadius,
          stingLength: 1,
          stingDirection: 1
        });
      }
    }
  }
  render() {
    this.matrix.forEach(row => row.forEach(col => col.render()));
  }
}

/**
 * P5 hooks
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  colorMode(HSB);

  colors.white = "white";
  const rows = Math.floor(windowWidth / 100);
  const columns = Math.floor(windowHeight / 100);
  stingCircleMatrix = new StingCircleMatrix(rows, columns);
}
function draw() {
  stingCircleMatrix.render();
}
