/**
 * Student: drewfle
 *
 * Just wanted to create a matrix of circle/triangle animations. Didn't know it
 * became 300 lines of code.
 */

/**
 * Global variables -----------------------------------------------------------
 */
const colors = {};
let stingCircleMatrix;
let freeze;

/**
 *
 */
function toggleFreeze() {
  if (this.checked()) {
    freeze = true;
  } else {
    freeze = false;
  }
}

/**
 * Custom class ---------------------------------------------------------------
 */

/**
 * Group utility functions inside a Util class as static methods.
 */
class Util {
  static get maxViewportSize() {
    return Math.max(windowWidth, windowHeight);
  }
  /**
   * Calculates the complementary color in HSB mode.
   * @param {color} fromColor
   */
  static calcComplementaryColor(fromColor) {
    const toColor = color(
      180 - hue(fromColor),
      saturation(fromColor),
      brightness(fromColor)
    );
    return toColor;
  }
}

/**
 * The base visual element class for this assignment.
 */
class StingCircle {
  /**
   * @param {color} circleColor
   * @param {color} stingColor
   * @param {number} circleX
   * @param {number} circleY
   * @param {number} circleRadius
   */
  constructor(circleColor, stingColor, circleX, circleY, circleRadius) {
    this.circleColor = circleColor;
    this.stingColor = stingColor;
    this.circleX = circleX;
    this.circleY = circleY;
    this.circleRadius = circleRadius;
    this.circleDiameter = this.circleRadius * 2;
    this.stingBaseX1 = this.calcCirclePointX(40);
    this.stingBaseY1 = this.calcCirclePointY(40);
    this.stingBaseX2 = this.calcCirclePointX(50);
    this.stingBaseY2 = this.calcCirclePointY(50);
  }
  /**
   * @param {number} distance
   * @param {color} stingColor
   */
  render(distance, stingColor) {
    noStroke();
    fill(Util.calcComplementaryColor(stingColor));
    circle(this.circleX, this.circleY, this.circleDiameter);
    this.renderSting(distance, stingColor);
  }
  /**
   * Renders sting-shaped triangle.
   * @param {number} distance
   * @param {color} stingColor
   */
  renderSting(distance, stingColor) {
    fill(stingColor);
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
 * The sting circle rendering class that fills the screen with sting circles
 * stored in a two-dimensional array.
 */
class StingCircleMatrix {
  /**
   * @param {number} rows
   * @param {number} columns
   * @param {number} offsetY
   */
  constructor(rows, columns, offsetY = 0) {
    this.rows = rows;
    this.columns = columns;
    this.gapX = windowWidth / (this.rows + 1);
    this.gapY = (windowHeight - offsetY) / (this.columns + 1);
    this.offsetY = offsetY;
    this.circleRadius = (this.gapX + this.gapY) / 5;
    this.circleDiameter = this.circleRadius * 2;
    this.matrix = [];
    this.angle = 0;
    this.freeze = false;
    this.initStingCircles();
    this.controls = new StingCircleMatrixControls(
      0,
      this.circleDiameter,
      this.circleRadius,
      0,
      100,
      50,
      color(15, 100, 100),
      toggleFreeze
    );
  }
  /**
   * Use getters so we can retrieve control values easily.
   */
  get distance() {
    return this.controls.stingLengthControl.control.value();
  }
  get speed() {
    return this.controls.stingSpeedControl.control.value();
  }
  get color() {
    return this.controls.stingColorControl.control.value();
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
        const baseX = this.gapX;
        const baseY = this.offsetY + this.gapY;
        this.matrix[row][col] = new StingCircle(
          colors.white,
          colors.white,
          baseX + row * this.gapX,
          baseY + col * this.gapY,
          this.circleRadius
        );
      }
    }
  }

  render() {
    // Not calculating distance in StingCircle for improving performance.
    // Only updates angle when freeze is false
    if (!freeze) {
      this.angle = frameCount * (this.speed / 4000) * TWO_PI;
    }
    const dist = this.distance * cos(this.angle);
    this.matrix.forEach(row =>
      row.forEach(col => col.render(dist, this.color))
    );
  }
}

/**
 * The UI component class that contains the required controls for this assignment.
 */
class StingCircleMatrixControls {
  constructor(
    minStingLength,
    maxStingLength,
    defaultStingLength,
    minStingSpeed,
    maxStingSpeed,
    defaultStingSpeed,
    stingColor,
    freezeStingsCallback
  ) {
    this.stingLengthControl = this.createSliderControl(
      "sting length",
      minStingLength,
      maxStingLength,
      defaultStingLength
    );
    this.stingSpeedControl = this.createSliderControl(
      "sting speed",
      minStingSpeed,
      maxStingSpeed,
      defaultStingSpeed
    );
    this.stingColorControl = this.createColorControl("sting color", stingColor);
    this.stingAnimateControl = this.createSwitchControl(
      "freeze stings",
      freezeStingsCallback
    );
    this.initControls();
  }
  /**
   * Creates a slider in a wrapper div.
   * @param {string} text
   * @param {number} min
   * @param {number} max
   * @param {number} defaultValue
   */
  createSliderControl(text, min, max, defaultValue) {
    const wrapper = createDiv();
    const label = this.createLabel(text);
    const control = createSlider(min, max, defaultValue);
    wrapper.child(label);
    wrapper.child(control);
    return { wrapper, label, control };
  }
  /**
   * Creates a color picker in a wrapper div.
   * @param {string} text
   * @param {color} stingColor
   */
  createColorControl(text, stingColor) {
    const wrapper = createDiv();
    const label = this.createLabel(text);
    const control = createColorPicker(stingColor);
    wrapper.child(label);
    wrapper.child(control);
    return { wrapper, label, control };
  }
  /**
   * Creates a checkbox in a wrapper div.
   * @param {string} text
   * @param {function} callback
   */
  createSwitchControl(text, callback) {
    const wrapper = createDiv();
    const label = this.createLabel(text);
    const control = createCheckbox("", false);
    control.changed(callback);
    wrapper.child(label);
    wrapper.child(control);
    return { wrapper, label, control };
  }
  /**
   * Creates a label to avoid duplicated code.
   * @param {string} text
   */
  createLabel(text) {
    return createP(text)
      .style("float", "left")
      .style("margin", "0")
      .style("width", "100px");
  }
  /**
   * Initializes controls for the assignment parameters
   */
  initControls() {
    const controlWrapper = createDiv()
      .child(this.stingLengthControl.wrapper)
      .child(this.stingSpeedControl.wrapper)
      .child(this.stingColorControl.wrapper)
      .child(this.stingAnimateControl.wrapper)
      .position(windowWidth / 100, windowHeight / 100);
  }
}

/**
 * P5 hooks -------------------------------------------------------------------
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  colors.white = "white";
  const rows = Math.floor(windowWidth / 120);
  const columns = Math.floor(windowHeight / 120);
  stingCircleMatrix = new StingCircleMatrix(rows, columns, 80);
}
function draw() {
  background(255);
  stingCircleMatrix.render();
}
