/**
 * Global variables ----------------------------------
 */
let lissajousCurves;
let lissajousSatellite;

/**
 * p5.js hooks ----------------------------------
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(222);
  lissajousCurves.setup();
}
function draw() {
  lissajousCurves.draw();
  const { x, y } = lissajousCurves;
  lissajousSatellite.draw(x, y);
}

// Encapsulates the variables and functions needed for drawing
// lissajous curves
lissajousCurves = {
  amplitudeX: 0,
  amplitudeY: 0,
  waveLengthX: 100.0,
  waveLengthY: 1000.0,
  pointCount: 0,
  x: 0,
  y: 0,
  /**
   * Initializes the variables and setups specifically required for
   * drawing lissajous
   */
  setup() {
    // Sets to viewport size to fill in for any screen ratio.
    this.amplitudeX = windowWidth / 2.333;
    this.amplitudeY = windowHeight / 2.333;
    // Styling
    noFill();
    strokeWeight(1);
    stroke(100);
  },
  draw() {
    translate(width / 2, height / 2);
    if (this.pointCount > 1000) {
      noLoop();
    }
    this.drawCurve();
  },
  drawCurve() {
    // let x, y;
    beginShape();
    for (var i = 0; i < this.pointCount; i++) {
      const angleX = (i / this.waveLengthX) * TWO_PI;
      const angleY = (i / this.waveLengthY) * TWO_PI;
      this.x = sin(angleX) * this.amplitudeX;
      this.y = sin(angleY) * this.amplitudeY;
      vertex(this.x, this.y);
    }
    endShape();
    this.pointCount++;
  }
};

lissajousSatellite = {
  draw(_x, _y) {
    this.amplitude = 10;
    this.waveLength = 10;
    // const angle = radians(frameCount);
    // const x = sin(angle) * this.amplitude + _x;
    // const y = cos(angle) * this.amplitude + _y;
    ellipse(_x, _y, this.waveLength);
    // beginShape();
    // for (var i = 0; i < 10; i++) {
    //   const angle = (i / this.waveLength) * TWO_PI;
    //   const x = sin(angle) * this.amplitude + _x;
    //   const y = cos(angle) * this.amplitude + _y;
    //   vertex(x, y);
    // }
    // endShape();
  }
};
