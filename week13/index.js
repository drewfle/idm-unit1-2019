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
  "leg.jpg"
  // ...new Array(20).fill("arm.jpg"),
  // ...new Array(20).fill("leg.jpg")
].map(img => ({
  id: undefined,
  url: `${bodyPartsBaseUrl}/${img}`,
  isProcessing: false,
  bodyPart: undefined,
  img: undefined,
  canvas: undefined,
  width: 0,
  height: 0
}));

const clonedBodyParts = [];

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
  initializeBodyParts(bodyPartsVisuals);
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
    // TODO: input to change threshold
    const wrapThreshold = 6;
    const amplification = 1.33;
    const size = windowHeight / wrapThreshold;
    const extendedWidth = windowWidth + size;
    // TODO: algo to fill all screen
    (function fillWindowWithMoreBodyParts() {
      const maxCols = Math.floor(windowWidth / size);
      const maxBodyParts = wrapThreshold * maxCols;
      const { length: currentBodyParts } = bodyPartsVisuals;
      const { length: currentClonedBodyParts } = clonedBodyParts;
      const bodyPartsDiff =
        maxBodyParts - currentBodyParts - currentClonedBodyParts;
      console.log("maxBodyParts", maxBodyParts);
      console.log(bodyPartsDiff);
      if (bodyPartsDiff > 0) {
        for (let i = 0; i < bodyPartsDiff; i++) {
          const oldBodyPart = bodyPartsVisuals[i % currentBodyParts];
          const newBodyPart = {};
          const oldCanvas = oldBodyPart.canvas.elt;
          const uuid = `${Math.random()}`.slice(2);
          foo(newBodyPart, oldBodyPart.width, oldBodyPart.height);
          const oldCanvasContext = oldCanvas.getContext("2d");
          const newCanvasContext = newBodyPart.canvas.elt.getContext("2d");
          const oldCanvasImageData = oldCanvasContext.getImageData(
            0,
            0,
            oldBodyPart.width,
            oldBodyPart.height
          );
          newCanvasContext.putImageData(oldCanvasImageData, 0, 0);
          clonedBodyParts.push(newBodyPart);
        }
      }
    })();
    const allBodyParts = [...bodyPartsVisuals, ...clonedBodyParts];
    console.log(allBodyParts);
    allBodyParts.forEach(({ canvas }, i) => {
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
  noLoop();
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

function initializeBodyParts(bodyPartsArray) {
  bodyPartsArray.forEach(bodyPart => {
    createBodyPart(bodyPart);
  });
}

function createBodyPart(bodyPart, fileData = undefined) {
  const uuid = `${Math.random()}`.slice(2);
  bodyPart.id = uuid;
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
  // TODO: use remove() to gc if too many images
  foo(bodyPart, bodyPart.img.width, bodyPart.img.height);
  return bodyPart;
}

function foo(bodyPart, bodyPartWidth, bodyPartHeight) {
  bodyPart.canvas = createGraphics(bodyPartWidth, bodyPartHeight)
    .id(`canvas-${bodyPart.id}`)
    .position(0, 0)
    .show() // resets P5 default values to avoid canvas not shown
    .style("width", "") // resets P5 default values to avoid canvas not shown
    .style("height", "") // resets P5 default values to avoid canvas not shown
    .style("opacity", "0.75");
  bodyPart.width = bodyPartWidth;
  bodyPart.height = bodyPartHeight;
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
