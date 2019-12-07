// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// http://localhost:8080/week13/

/**
 * References:
 *   ES6 async/await: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
 *   Using async/await with a loop: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
 *   IIFE: https://en.wikipedia.org/wiki/Immediately_invoked_function_expression
 * TODO:
 * cache by image name
 * url.match(/([^\/]+)(?=\.\w+$)/)[0]
 */

// TODO: change back to cloud url
const bodyPartsBaseUrl = "assets";
// const bodyPartsBaseUrl =
//   "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual803548/h7742c0df291332632e44a2cdbca0541d";

const bodyPartsVisuals = [
  "arm.jpg",
  "leg.jpg",
  "arm.jpg",
  "leg.jpg",
  "arm.jpg",
  "leg.jpg",
  "arm.jpg",
  "leg.jpg",
  "arm.jpg",
  "arm.jpg",
  "leg.jpg",
  "arm.jpg",
  "leg.jpg",
  "leg.jpg",
  "arm.jpg"
  // "leg.jpg"
].map(img => ({
  url: `${bodyPartsBaseUrl}/${img}`,
  isProcessing: false,
  bodyPart: undefined,
  img: undefined,
  canvas: undefined
}));

const bodyPartsSounds = {
  nose: "nose",
  leftEye: "leftEye",
  rightEye: "rightEye",
  leftEar: "leftEar",
  rightEar: "rightEar",
  leftShoulder: "leftShoulder",
  rightShoulder: "rightShoulder",
  leftElbow: "leftElbow",
  rightElbow: "rightElbow",
  leftWrist: "leftWrist",
  rightWrist: "rightWrist",
  leftHip: "leftHip",
  rightHip: "rightHip",
  leftKnee: "leftKnee",
  rightKnee: "rightKnee",
  leftAnkle: "leftAnkle",
  rightAnkle: "rightAnkle"
};
let areExternalScriptsLoaded = false;
let input;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  noCanvas();
  initializeBodyParts();
  // TODO: move the file input into a banner on the bottom
  input = createFileInput(handleFile);
  input.position(0, 0);
  // frameRate(1);
}

async function draw() {
  if (!areExternalScriptsLoaded) {
    loadExternalScripts();
    return;
  }
  // P5 draw() doesn't support async. So we create an IIFE here to embed
  // our own async code and to ensure the rest of functions can be invoked.
  (async () => {
    await loadAndPredict();
    // makeSound();
    const wrapThreshold = 5;
    const amplification = 1.33;
    const size = windowHeight / wrapThreshold;
    const extendedWidth = windowWidth + size;
    bodyPartsVisuals.forEach(({ canvas }, i) => {
      const move =
        (frameCount + size * Math.floor(i / wrapThreshold)) % windowWidth;
      const posX = windowWidth - move - size;

      const posY = (i * size) % windowHeight;
      canvas
        .position(posX, posY)
        .style("width", `${size * amplification}px`)
        .style("height", `${size * amplification}px`);
    });
  })();
  // noLoop();
}

function makeSound() {}

function getBodyPart(segmentation) {
  const { part: bodyPart } = segmentation.allPoses[0].keypoints.sort(
    (a, b) => b.score - a.score
  )[0];
  return bodyPart;
}

async function loadAndPredict() {
  await Promise.all(
    bodyPartsVisuals.map(async ({ isProcessing, url, img, canvas }, i) => {
      // Only calls this expensive classification subroutine once.
      if (isProcessing) {
        return;
      }
      bodyPartsVisuals[i].isProcessing = true;

      const net = await bodyPix.load();
      const segmentation = await net.segmentPerson(img.elt);
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
      bodyPartsVisuals[i].bodyPart = getBodyPart(segmentation);
    })
  );
}

function handleFile(file) {
  if (file.type !== "image") {
    return;
  }
  const bodyPart = {};
  createBodyPart(bodyPart, file.data);
  bodyPartsVisuals.push(bodyPart);
}

function initializeBodyParts() {
  bodyPartsVisuals.forEach(bodyPart => {
    createBodyPart(bodyPart);
  });
}

function createBodyPart(bodyPart, fileData = undefined) {
  const uuid = `${Math.random()}`.slice(2);
  // Creates a unique id string like 5519497453702618, without this from
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
    .style("height", "")
    .style("opacity", "0.75");
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
