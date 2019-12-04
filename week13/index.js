// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// http://localhost:8080/week13/

/**
 * TODO:
 * cache by image name
 * url.match(/([^\/]+)(?=\.\w+$)/)[0]
 */
const bodyPartsBaseUrl = "assets";
// const bodyPartsBaseUrl =
//   "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual803548/h7742c0df291332632e44a2cdbca0541d";

// Creates unique id string like 5519497453702618, without this from
// the second browser load and onwards the console will output:
// Uncaught (in promise) DOMException: Failed to execute 'texImage2D' on 'WebGL2RenderingContext': Tainted canvases may not be loaded.
const uuid = `${Math.random()}`.slice(2);
const bodyParts = [
  { url: `${bodyPartsBaseUrl}/arm.jpg?${uuid}`, id: "arm" },
  { url: `${bodyPartsBaseUrl}/leg.jpg?${uuid}`, id: "leg" }
];
// let bodyPartsHtmlImgs;
let areExternalScriptsLoaded = false;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  bodyParts.forEach(bodyPart => {
    // attribute() must be called before id(), see:
    // https://github.com/ml5js/ml5-library/issues/217
    bodyPart.img = createImg(bodyPart.url)
      .attribute("crossorigin", "anonymous")
      .id(bodyPart.id)
      .position(0, windowHeight / 2);
    console.log(bodyPart.img);
    // display: none; width: 0px; height: 0px; position: absolute; left: 0px; top: 0px;
    bodyPart.canvas = createGraphics(bodyPart.img.width, bodyPart.img.height)
      // .attribute("width", bodyPart.img.width)
      // .attribute("height", bodyPart.img.height)
      // .style("display", null)
      // .style("width", null)
      // .style("height", null)
      // .style("position", null)
      // .style("left", null)
      // .style("top", null)
      .id(`canvas-${bodyPart.id}`)
      .position(0, 0);
    const x = document.getElementById(`canvas-${bodyPart.id}`);
    x.style.removeProperty("display");
    x.style.removeProperty("width");
    x.style.removeProperty("height");
    x.style.removeProperty("position");
    x.style.removeProperty("left");
    x.style.removeProperty("top");
  });
}

function draw() {
  if (!areExternalScriptsLoaded) {
    loadExternalScripts();
    return;
  }
  loadAndPredict();
  noLoop();
}

async function loadAndPredict() {
  bodyParts.forEach(async ({ id }) => {
    const img = document.getElementById(id);
    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(img);
    console.log(segmentation);
    const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const pixelCellWidth = 10.0;
    const canvas = document.getElementById(`canvas-${id}`);
    bodyPix.drawPixelatedMask(
      canvas,
      img,
      coloredPartImage,
      opacity,
      maskBlurAmount,
      flipHorizontal,
      pixelCellWidth
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
