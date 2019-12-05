// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// http://localhost:8080/week13/

/**
 * TODO:
 * cache by image name
 * url.match(/([^\/]+)(?=\.\w+$)/)[0]
 */

// TODO: change back to cloud url
const bodyPartsBaseUrl = "assets";
// const bodyPartsBaseUrl =
//   "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual803548/h7742c0df291332632e44a2cdbca0541d";

const bodyParts = [
  { url: `${bodyPartsBaseUrl}/arm.jpg` },
  { url: `${bodyPartsBaseUrl}/leg.jpg` }
  // { url: `${bodyPartsBaseUrl}/body.jpg` }
];
let areExternalScriptsLoaded = false;
let input;

function setup() {
  noCanvas();
  initializeBodyParts();
  // TODO: move the file input into a banner on the bottom
  input = createFileInput(handleFile);
  input.position(0, 0);
  frameRate(1);
}

function draw() {
  if (!areExternalScriptsLoaded) {
    loadExternalScripts();
    return;
  }
  loadAndPredict();
  // noLoop();
}

function handleFile(file) {
  if (file.type !== "image") {
    return;
  }
  const bodyPart = {};
  createBodyPart(bodyPart, file.data);
  bodyParts.push(bodyPart);
}

function initializeBodyParts() {
  bodyParts.forEach(bodyPart => {
    createBodyPart(bodyPart);
  });
}

function createBodyPart(bodyPart, fileData = undefined) {
  const uuid = `${Math.random()}`.slice(2);
  // Creates unique id string like 5519497453702618, without this from
  // the second browser load and onwards the console will output:
  // Uncaught (in promise) DOMException: Failed to execute 'texImage2D' on 'WebGL2RenderingContext': Tainted canvases may not be loaded.
  bodyPart.img = createImg(fileData ? fileData : `${bodyPart.url}?${uuid}`)
    // attribute() must be called before id(), see:
    // https://github.com/ml5js/ml5-library/issues/217
    .attribute("crossorigin", "anonymous")
    // We need an unique id for each image, otherwise p5.js will keep
    // using the existing one
    .id(uuid)
    .hide();
  // display: none; width: 0px; height: 0px; position: absolute; left: 0px; top: 0px;
  // TODO: use remove() to gc
  bodyPart.canvas = createGraphics(bodyPart.img.width, bodyPart.img.height)
    .id(`canvas-${uuid}`)
    .position(0, 0)
    .show()
    .style("width", "")
    .style("height", "");
}

async function loadAndPredict() {
  bodyParts.forEach(async ({ id, img, canvas }) => {
    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(img.elt);
    console.log(segmentation);
    const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const coloredPartImage = bodyPix.toMask(
      segmentation,
      foregroundColor,
      backgroundColor,
      true
    );
    const opacity = 1;
    const maskBlurAmount = 0;
    const flipHorizontal = false;
    bodyPix.drawMask(
      canvas.elt,
      img.elt,
      coloredPartImage,
      opacity,
      maskBlurAmount,
      flipHorizontal
    );
  });
}

/**
 * Load external script helpers
 */

const tensorflowUrl = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2";
const bodyPixUrl =
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0.3";
const loadTensorflowOnce = once(loadJs, tensorflowUrl);
const loadBodyPixOnce = once(loadJs, bodyPixUrl);

function loadExternalScripts() {
  if (!isTensorflowLoaded() && !isBodyPixLoaded()) {
    loadTensorflowOnce();
  }
  if (isTensorflowLoaded() && !isBodyPixLoaded()) {
    loadBodyPixOnce();
  }
  if (isTensorflowLoaded() && isBodyPixLoaded()) {
    console.log("all external scripts are loaded");
    areExternalScriptsLoaded = true;
  }
}

function isTensorflowLoaded() {
  try {
    return tf !== undefined;
  } catch (error) {
    return false;
  }
}

function isBodyPixLoaded() {
  try {
    return bodyPix !== undefined;
  } catch (error) {
    return false;
  }
}

function loadJs(filename) {
  const script = document.createElement("script");
  script.setAttribute("src", filename);
  document.getElementsByTagName("head")[0].appendChild(script);
}

function once(fn, ...args) {
  let isCalled = false;
  return () => {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
    }
  };
}
