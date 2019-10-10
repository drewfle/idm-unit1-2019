/**
 * Student: Andrew Liu
 */

function setup() {
  createCanvas(windowWidth, windowHeight);
  ColorMix.setup();
}

function draw() {
  const mix = new ColorMix(
    9,
    9,
    width / 50,
    height / 50,
    color(240, 100, 100, 0.1),
    color(330, 100, 100, 0.05)
  );
  mix.draw();
}

class ColorMix {
  /**
   * Initializes necessary parameters for the shape
   * @param {number} colSize
   * @param {number} rowSize
   * @param {number} rectWidth
   * @param {number} rectHeight
   * @param {object} fromColor p5.js color
   * @param {object} toColor p5.js color
   */
  constructor(colSize, rowSize, rectWidth, rectHeight, fromColor, toColor) {
    this.colSize = colSize;
    this.rowSize = rowSize;
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;
    this.fromColor = fromColor;
    this.toColor = toColor;
  }

  /**
   * Static method to encapsulate the setup requirements that
   * are specific to ColorMix
   */
  static setup() {
    frameRate(120);
    colorMode(HSB);
    noStroke();
  }

  /**
   * Draws the color mix shape.
   */
  draw() {
    this._rotateGrid();
    this._drawGrid();
  }

  _rotateGrid() {
    translate(width / 2, height / 2);
    rotate(((frameCount - 1) * 100) % (2 * PI));
  }

  _drawGrid() {
    const total = this.colSize + this.rowSize;
    // Add 1 onto col/row size so the grid stays in center
    const x = width / (this.colSize + 1);
    const y = height / (this.rowSize + 1);
    for (let i = 0; i < this.colSize; i++) {
      push();
      translate(x * i, 0);
      this._drawRect(x, y, i / total);
      for (let j = 0; j < this.rowSize; j++) {
        push();
        translate(0, y * j);
        this._drawRect(x, y, i + j / total);
        pop();
      }
      pop();
    }
  }

  _drawRect(x, y, lerpValue) {
    const interColor = lerpColor(this.fromColor, this.toColor, lerpValue);
    fill(interColor);
    rect(x - width / 2, y - height / 2, this.rectWidth, this.rectHeight);
  }
}
