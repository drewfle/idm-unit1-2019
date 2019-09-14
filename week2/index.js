// Painterly Realism of a Football Player—Color Masses in the 4th Dimension
// Date: Summer/fall 1915
// Artist: Kazimir Malevich
// Image source: https://www.artic.edu/artworks/207293/painterly-realism-of-a-football-player-color-masses-in-the-4th-dimension
// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

// rect(x, y, w, h)
// quad(x1, y1, x2, y2, x3, y3, x4, y4)
// circle(x, y, d)
// rotate(angle, [axis])
// 8 colors
// 5-7 shapes
// 843 x 1350

const eighteenPercentGray = 124;
const malevichsPalette = {
  white: [242, 244, 239],
  purple: [67, 47, 75],
  yellow: [227, 174, 0],
  blue: [40, 28, 121],
  darkGray: [30],
  black: [24],
  red: [203, 35, 34],
  green: [52, 150, 96]
};
const paintingMetadata = {
  size: [], // [width, height]
  center: [], // [x, y]
  coordinates: [], // [x1, y1, x2, y2, x3, y3, x4, y4]
  origin: [] // [x, y]
};
const isPositioningShapes = false;
let viewportRatio;
let paintingRatio;
let isViewportTooNarrow;
let img;

function preload() {
  img = loadImage("./malevich-football-1915.jpg");
}

function setup() {
  viewportRatio = windowWidth / windowHeight;
  paintingRatio = 843 / 1350;
  isViewportTooNarrow = viewportRatio > paintingRatio;
  createCanvas(windowWidth, windowHeight);
  setupPaintingMetadata();
  background(eighteenPercentGray);
  if (isPositioningShapes) {
    loadImage("./malevich-football-1915.jpg", img => {
      const { size } = paintingMetadata;
      image(img, 0, 0, ...size);
    });
  }
}

function draw() {
  const { size, origin } = paintingMetadata;
  const {
    white,
    purple,
    yellow,
    blue,
    darkGray,
    black,
    red,
    green
  } = malevichsPalette;
  translate(...origin);
  if (!isPositioningShapes) {
    fill(white);
    rect(0, 0, ...size);
  }
  stroke(0);
  fill(...purple);
  drawQuad(38, 1.5, 31, 28, {
    skewXPercentage: 0,
    skewYPercentage: -18,
    angle: 28
  });
  fill(...yellow);
  drawQuad(47, 55.5, 17, 18.5, {
    distortXPercentage: 24,
    angle: 5
  });
  fill(...blue);
  drawQuad(15, 70.5, 66, 1.5, { angle: 6.5 });
  fill(...darkGray);
  drawQuad(22, 64.5, 18, 11, { angle: 0.5 });
  fill(...black);
  drawQuad(32.5, 79, 17, 4.5, { angle: -32 });
  fill(...red);
  drawQuad(46, 83, 10.5, 2.5, { angle: -8.5 });
  fill(...red);
  drawQuad(54, 86.5, 15, 0.75, { angle: 3 });
  fill(...green);
  drawCircleByWidth(59, 89.25, 5);
}

// Utility functions

function drawQuad(
  originXPercentage,
  originYPercentage,
  widthPercentage,
  heightPercentage,
  options = {
    distortXPercentage: 0,
    distortYPercentage: 0,
    skewXPercentage: 0,
    skewYPercentage: 0,
    angle: 0
  }
) {
  const {
    distortXPercentage,
    distortYPercentage,
    skewXPercentage,
    skewYPercentage,
    angle
  } = options;
  const [width, height] = calcSizeByPercentage(
    widthPercentage,
    heightPercentage
  );
  const [originX, originY] = calcOriginByPercentage(
    originXPercentage,
    originYPercentage
  );
  const centerX = originX + width / 2;
  const centerY = originY + height / 2;
  const coordinates = {
    x1: originX,
    y1: originY,
    x2: originX + width,
    y2: originY,
    x3: originX + width,
    y3: originY + height,
    x4: originX,
    y4: originY + height
  };
  if (distortXPercentage) {
    calcDistortion(coordinates, width, distortXPercentage, "x");
  }
  if (distortYPercentage) {
    calcDistortion(coordinates, width, distortYPercentage, "y");
  }
  if (skewXPercentage) {
    calcSkew(coordinates, width, skewXPercentage, "x");
  }
  if (skewYPercentage) {
    calcSkew(coordinates, height, skewYPercentage, "y");
  }
  if (angle) {
    calcAngle(coordinates, angle, centerX, centerY);
  }
  quad(...Object.values(coordinates));
  console.log(coordinates);
}

function drawCircleByWidth(
  originXPercentage,
  originYPercentage,
  widthPercentage
) {
  const [originX, originY] = calcOriginByPercentage(
    originXPercentage,
    originYPercentage
  );
  const [width] = calcSizeByPercentage(widthPercentage, 0);

  ellipse(originX, originY, width, width);
}

function setupPaintingMetadata() {
  const [width, height] = getPaintingSize();
  const originX = isViewportTooNarrow ? (windowWidth - width) / 2 : 0;
  const originY = isViewportTooNarrow ? 0 : (windowHeight - height) / 2;
  paintingMetadata.size.push(width, height);
  paintingMetadata.coordinates.push(0, 0, width, 0, height, 0, width, height);
  paintingMetadata.origin.push(originX, originY);
}

function getPaintingSize() {
  const width = isViewportTooNarrow
    ? windowHeight * paintingRatio
    : windowWidth;
  const height = isViewportTooNarrow
    ? windowHeight
    : (windowWidth * 1) / paintingRatio;
  return [width, height];
}

function calcSizeByPercentage(widthPercentage, heightPercentage) {
  const {
    size: [pmWidth, pmHeight]
  } = paintingMetadata;
  const width = pmWidth * (widthPercentage / 100);
  const height = pmHeight * (heightPercentage / 100);
  return [width, height];
}

function calcOriginByPercentage(originXPercentage, originYPercentage) {
  const {
    size: [pmWidth, pmHeight]
  } = paintingMetadata;
  const originX = pmWidth * (originXPercentage / 100);
  const originY = pmHeight * (originYPercentage / 100);
  return [originX, originY];
}

function calcDistortion(coordinates, length, distortPercentage, axis) {
  const delta = (length * (distortPercentage / 100)) / 2;
  coordinates[`${axis}1`] -= delta;
  coordinates[`${axis}2`] += delta;
  coordinates[`${axis}3`] -= delta;
  coordinates[`${axis}4`] += delta;
}

function calcSkew(coordinates, length, skewPercentage, axis) {
  const delta = (length * (skewPercentage / 100)) / 2;
  if (axis === "x") {
    coordinates.x1 -= delta;
    coordinates.x2 -= delta;
    coordinates.x3 += delta;
    coordinates.x4 += delta;
  }
  if (axis === "y") {
    coordinates.y1 -= delta;
    coordinates.y2 += delta;
    coordinates.y3 += delta;
    coordinates.y4 -= delta;
  }
}

/**
 * Wrote custom rotate function, because p5 rotate() doesn't work with quad.
 * Use the formula found at https://www.gamefromscratch.com/post/2012/11/24/GameDev-math-recipes-Rotating-one-point-around-another-point.aspx
 */
function calcAngle(coordinates, angle, centerX, centerY) {
  const { PI, cos, sin } = Math;
  const rad = (angle * PI) / 180;
  const { x1, y1, x2, y2, x3, y3, x4, y4 } = coordinates;
  coordinates.x1 =
    (x1 - centerX) * cos(rad) - (y1 - centerY) * sin(rad) + centerX;
  coordinates.x2 =
    (x2 - centerX) * cos(rad) - (y2 - centerY) * sin(rad) + centerX;
  coordinates.x3 =
    (x3 - centerX) * cos(rad) - (y3 - centerY) * sin(rad) + centerX;
  coordinates.x4 =
    (x4 - centerX) * cos(rad) - (y4 - centerY) * sin(rad) + centerX;
  coordinates.y1 =
    (y1 - centerY) * cos(rad) + (x1 - centerX) * sin(rad) + centerY;
  coordinates.y2 =
    (y2 - centerY) * cos(rad) + (x2 - centerX) * sin(rad) + centerY;
  coordinates.y3 =
    (y3 - centerY) * cos(rad) + (x3 - centerX) * sin(rad) + centerY;
  coordinates.y4 =
    (y4 - centerY) * cos(rad) + (x4 - centerX) * sin(rad) + centerY;
}
