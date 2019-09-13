function setup() {}

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
  drawQuad(10, 10, 10, 10, undefined, undefined, undefined, undefined, 30);
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
    const delta = (width * (distortXPercentage / 100)) / 2;
    coordinates.x1 -= delta;
    coordinates.x2 += delta;
    coordinates.x3 -= delta;
    coordinates.x4 += delta;
  }
  if (distortYPercentage !== undefined) {
    const delta = (height * (distortYPercentage / 100)) / 2;
    coordinates.y1 -= delta;
    coordinates.y2 += delta;
    coordinates.y3 -= delta;
    coordinates.y4 += delta;
  }
  if (skewXPercentage !== undefined) {
    const delta = (width * (skewXPercentage / 100)) / 2;
    coordinates.x1 -= delta;
    coordinates.x2 -= delta;
    coordinates.x3 += delta;
    coordinates.x4 += delta;
  }
  if (skewYPercentage !== undefined) {
    const delta = (height * (skewYPercentage / 100)) / 2;
    coordinates.y1 -= delta;
    coordinates.y2 += delta;
    coordinates.y3 += delta;
    coordinates.y4 -= delta;
  }

  if (angle != undefined) {
    // pushMatrix();
    // translate(originX - width);
    rotate(radians(angle));
  }

  quad(...Object.values(coordinates));
  if (angle != undefined) {
    rotate(radians(-angle));
    // popMatrix();
  }
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
