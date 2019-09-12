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
  // rectMode(CENTER);
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
  fill(white);
  translate(...origin);
  rect(0, 0, ...size);
  // const pos1 = drawQuad({ width: 30, height: 50, centerX: -100, centerY: 0 });
  // fill(purple);
  // translate(100, 100);
  // quad(...pos1);
}

// Utility functions

function drawQuad(
  originX,
  originY,
  widthPercentage,
  heightPercentage,
  centerX = 0,
  centerY = 0,
  distortX = 0,
  distortY = 0,
  skewX = 0,
  skewY = 0,
  angle = 0
) {
  const {
    size: [pmWidth, pmHeight],
    coordinates: pmCoordinates,
    origin: pmOrigin
  } = paintingMetadata;

  const coordinates = {
    x1: (pmWidth * width) / 100,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0
  };
}

// change to percentage
function xdrawQuad({
  width,
  height,
  centerX = 0,
  centerY = 0,
  distortX = 0,
  distortY = 0,
  skewX = 0,
  skewY = 0,
  angle = 0
}) {
  const midW = windowWidth / 2;
  const midH = windowHeight / 2;
  const centerXOnTheCanvas = centerX + midW;
  const centerYOnTheCanvas = centerY + midH;
  let x1, y1, x2, y2, x3, y3, x4, y4;
  x1 = x4 = centerXOnTheCanvas - width / 2;
  x2 = x3 = centerXOnTheCanvas + width / 2;
  y1 = y2 = centerYOnTheCanvas - height / 2;
  y3 = y4 = centerYOnTheCanvas + height / 2;
  if (distortX) {
    const delta = distortX / 2;
    x1 = x3 -= delta;
    x2 = x4 += delta;
  }
  if (distortY) {
    const delta = distortY / 2;
    y1 = y3 -= delta;
    y4 = y2 += delta;
  }
  console.log([x1, y1, x2, y2, x3, y3, x4, y4]);
  return [x1, y1, x2, y2, x3, y3, x4, y4];
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
