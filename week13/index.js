// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// http://localhost:8080/week13/

const tensorflowUrl = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2";
const bodyPixUrl =
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0";

let areExternalScriptsLoaded = false;

function setup() {
  createImg("assets/arm.jpeg").id("arm");
}

function draw() {
  if (!areExternalScriptsLoaded) {
    loadExternalScripts();
    return;
  }

  loadAndPredict();
  noLoop();
}
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

async function loadAndPredict() {
  const img = document.getElementById("arm");
  const net = await bodyPix.load();
  const segmentation = await net.segmentPerson(img);
  console.log(segmentation);
}

/**
 * Load external script helpers
 */

function once(fn, ...args) {
  let isCalled = false;
  return function() {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
    }
  };
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
