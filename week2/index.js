// Painterly Realism of a Football Player—Color Masses in the 4th Dimension
// Date: Summer/fall 1915
// Artist: Kazimir Malevich
// Image source: https://www.artic.edu/artworks/207293/painterly-realism-of-a-football-player-color-masses-in-the-4th-dimension

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
let viewportRatio;
let paintingRatio;
let isViewportTooNarrow;

function setup() {
  viewportRatio = windowWidth / windowHeight;
  paintingRatio = 843 / 1350;
  isViewportTooNarrow = viewportRatio > paintingRatio;
  createCanvas(windowWidth, windowHeight);
  setupPaintingMetadata();
  background(eighteenPercentGray);
}

function draw() {
  const { size, coordinates, origin } = paintingMetadata;
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
  fill(white);
  rect(0, 0, ...size);
  fill(purple);
  drawQuad(0, 0, 10, 10);
  drawQuad(10, 10, 10, 10, undefined, undefined, undefined, undefined, 10);
  drawQuad(10, 10, 10, 10);
  drawQuad(20, 20, 10, 10);
}

// Utility functions

function drawQuad(
  originXPercentage,
  originYPercentage,
  widthPercentage,
  heightPercentage,
  distortXPercentage, // optional
  distortYPercentage, // optional
  skewXPercentage, // optional
  skewYPercentage, // optional
  angle // optional
) {
  const {
    size: [pmWidth, pmHeight],
    // center: [pmCenterX, pmCenterY],
    coordinates: [pmX1, pmY1, pmX2, pmY2, pmX3, pmY3, pmX4, pmY4],
    origin: [pmOriginX, pmOriginY]
  } = paintingMetadata;
  const width = pmWidth * (widthPercentage / 100);
  const height = pmHeight * (heightPercentage / 100);
  const originX = pmWidth * (originXPercentage / 100);
  const originY = pmHeight * (originYPercentage / 100);
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
  if (distortXPercentage !== undefined) {
    calcDistortion(coordinates, width, distortXPercentage, "x");
  }
  if (distortYPercentage !== undefined) {
    calcDistortion(coordinates, length, distortYPercentage, "y");
  }
  if (skewXPercentage !== undefined) {
    calcSkew(coordinates, width, skewXPercentage, "x");
  }
  if (skewYPercentage !== undefined) {
    calcSkew(coordinates, height, skewYPercentage, "y");
  }
  if (angle) {
    calcAngle(coordinates, angle, centerX, centerY);
  }
  quad(...Object.values(coordinates));
}

function setupPaintingMetadata() {
  const [width, height] = getPaintingSize();
  const originX = isViewportTooNarrow ? (windowWidth - width) / 2 : 0;
  const originY = isViewportTooNarrow ? 0 : (windowHeight - height) / 2;
  paintingMetadata.size.push(width, height);
  // paintingMetadata.center.push(width / 2, height / 2);
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

function calcDistortion(coordinates, length, distortPercentage, axis) {
  const delta = (length * (distortPercentage / 100)) / 2;
  coordinates[`${axis}1`] -= delta;
  coordinates[`${axis}2`] += delta;
  coordinates[`${axis}3`] -= delta;
  coordinates[`${axis}4`] += delta;
}

function calcSkew(coordinates, length, skewPercentage, axis) {
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
