/**
 * STUDENT: Andrew Liu
 * ^: just like when I was in art college, we knew each other and talk about
 * our work as real people.
 *
 * FOREWORDS: Instead of drawing multiple shapes alone the lissajous curves, I
 * decided to only draw a circle at each side of the trajectory. The reason was
 * I found the dark lines and circles were pleasant enough. If it were multiple
 * shapes (even by just making different ovals using sin/cos values), it would
 * give me a very busy feeling.
 */

/**
 * ### Global variables ###
 *
 * Trying to reduce the number of global variables.
 */
let lissajousLines;
let lissajousSatellites;

/**
 * ### p5.js hooks ###
 */
function setup() {
  // Global configurations
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB); // Default to HSBA 360, 100, 100, 1
  background(color(0, 0, 85));

  // Shape-specific configurations
  lissajousLines.setup({
    strokeColor: color(0, 0, 0, 0.01),
    waveLengthX: 100.0,
    waveLengthY: 1000.0
  });
  lissajousSatellites.setup({ circleDiameterBase: 80 });
}
function draw() {
  translate(width / 2, height / 2);
  lissajousLines.draw();
  const { x1, y1, x2, y2, pointCount } = lissajousLines;
  lissajousSatellites.draw({ x1, y1, x2, y2, pointCount });
  // stopLoop hss to be at the end of each drawing cycle to prevent
  // an extra drawing loop that draws one more circle at each side.
  lissajousLines.stopLoop();
}

/**
 * ### Shape drawing objects ###
 *
 * In this section, I was trying to experiment with a pattern that stores
 * shape-specific configurations (i.e. setup) and actions (i.e. draw) into
 * each shape drawing object. I also tried to encapsulates the variables and
 * functions that are only needed for the shape drawing objects.
 */

/**
 * Lissajous line drawing object
 */

lissajousLines = {
  // Explicitly layouts object variables we need here
  strokeColor: undefined,
  amplitudeX: undefined,
  amplitudeY: undefined,
  waveLengthX: undefined,
  waveLengthY: undefined,
  pointCount: 0,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  /**
   * Shape drawing specific setup function
   */
  setup({ strokeColor, waveLengthX, waveLengthY }) {
    // Initializes object variables
    this.strokeColor = strokeColor;
    this.waveLengthX = waveLengthX;
    this.waveLengthY = waveLengthY;
    // Sets to viewport size to fill in for any screen ratio.
    this.amplitudeX = windowWidth / 2.333;
    this.amplitudeY = windowHeight / 2.333;
    // Styling
    strokeWeight(1);
  },
  /**
   * Draws lines that connect both ends of the Lissajous curve trajectory.
   */
  draw() {
    beginShape();
    for (var i = 0; i < this.pointCount; i++) {
      const angleX = (i / this.waveLengthX) * TWO_PI;
      const angleY = (i / this.waveLengthY) * TWO_PI;
      this.x1 = sin(angleX) * this.amplitudeX;
      this.y1 = sin(angleY) * this.amplitudeY;
      this.x2 = -this.x1;
      this.y2 = -this.y1;
      // TODO: callbacks
      stroke(this.strokeColor);
      noFill();
      vertex(this.x1, this.y1);
      vertex(this.x2, this.y2);
    }
    endShape();
    this.pointCount++;
  },
  /**
   * Stops the curves when two circles overlap. Only need
   * pointCount to be larger than a threshold. In current
   * calculation, larger than 3 works, but it is fine to pick
   * slightly larger number.
   */
  stopLoop() {
    if (
      this.pointCount > 42 &&
      Math.round(this.x1) === Math.round(this.x2) &&
      Math.round(this.y1) === Math.round(this.y2)
    ) {
      noLoop();
    }
  }
};

/**
 * Lissajous circle satellite drawing object
 */
lissajousSatellites = {
  circleDiameter: undefined,
  /**
   * Shape drawing specific setup function
   */
  setup({ circleDiameterBase }) {
    this.circleDiameter =
      windowWidth > windowHeight
        ? windowWidth / circleDiameterBase
        : windowHeight / circleDiameterBase;
  },
  /**
   * Draws circles at each end of the Lissajous lines. The circles are filled
   * with colors that compensate each other.
   */
  draw({ x1, y1, x2, y2, pointCount }) {
    const angle = (pointCount / 3000) * TWO_PI;
    fill(color(cos(angle) * 360, 25, 75));
    ellipse(x1, y1, this.circleDiameter);
    fill(color(sin(angle) * 360, 25, 75));
    ellipse(x2, y2, this.circleDiameter);
  }
};
