/**
 * Student: Andrew Liu
 */

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(0, 0, 100);
  noStroke();
}

function draw() {
  // Found the HSB value of international Klein blue here: https://www.colorhexa.com/002fa7
  const kleinBlueHue = 223.1;
  const kleinBlue = color(kleinBlueHue, 100, 65.5);

  // Setup colors
  const smallSq = color(kleinBlueHue, 100, 60);
  const leftBkdg = color(kleinBlueHue, 80, 35);
  const rightBkdg = kleinBlue;

  // Define shapes
  const upperLeft = new JosephShapes(smallSq, leftBkdg);
  const upperRight = new JosephShapes(smallSq, rightBkdg, width / 2);
  const lowerLeft = new JosephShapes(smallSq, rightBkdg, 0, height / 2);
  const lowerRight = new JosephShapes(smallSq, leftBkdg, width / 2, height / 2);

  // Draw shapes
  upperLeft.draw();
  upperRight.draw();
  lowerLeft.draw();
  lowerRight.draw();
}

/**
 * Designed a class to draw Joseph's color shape example
 * at different locations on screen with different sizes.
 * Prefixing '_' on class variables and methods to denote
 * them as private properties. Other options include using
 * Symbol and even more contrived workaround.
 */
class JosephShapes {
  constructor(
    smallSquareColor,
    backgroundColor,
    originX = 0,
    originY = 0,
    shapeWidth = width / 2,
    shapeHeight = height / 2
  ) {
    this._smallSquareColor = smallSquareColor;
    this._backgroundColor = backgroundColor;
    this._originX = originX;
    this._originY = originY;
    this._shapeWidth = shapeWidth;
    this._shapeHeight = shapeHeight;
  }
  draw() {
    this._drawBackground();
    this._drawSmallSquare();
  }
  _drawSmallSquare() {
    fill(this._smallSquareColor);
    rect(
      this._originX + this._shapeWidth / 2,
      this._originY + this._shapeHeight / 4,
      this._shapeWidth / 8,
      this._shapeWidth / 8
    );
  }
  _drawBackground() {
    fill(this._backgroundColor);
    rect(this._originX, this._originY, this._shapeWidth, this._shapeHeight);
  }
}
