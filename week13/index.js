// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// http://localhost:8080/week13/

/**
 * Random images from wikimedia.
 * You should go to contemporary art museums to see some bad taste stuff and have fun.
 *
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

const bodyPartsVisuals = ["face.jpg", "run.jpg", "arm.jpg"].map(img => ({
  id: undefined,
  url: `${bodyPartsBaseUrl}/${img}`,
  isProcessing: false,
  bodyParts: undefined,
  img: undefined,
  canvas: undefined,
  width: 0,
  height: 0
}));
const bodyPartsSounds = {
  nose: { url: `${bodyPartsBaseUrl}/nose.m4a`, sound: undefined },
  leftEye: { url: `${bodyPartsBaseUrl}/leftEye.m4a`, sound: undefined },
  rightEye: { url: `${bodyPartsBaseUrl}/rightEye.m4a`, sound: undefined },
  leftEar: { url: `${bodyPartsBaseUrl}/leftEar.m4a`, sound: undefined },
  rightEar: { url: `${bodyPartsBaseUrl}/rightEar.m4a`, sound: undefined },
  leftShoulder: {
    url: `${bodyPartsBaseUrl}/leftShoulder.m4a`,
    sound: undefined
  },
  rightShoulder: {
    url: `${bodyPartsBaseUrl}/rightShoulder.m4a`,
    sound: undefined
  },
  leftElbow: { url: `${bodyPartsBaseUrl}/leftElbow.m4a`, sound: undefined },
  rightElbow: { url: `${bodyPartsBaseUrl}/rightElbow.m4a`, sound: undefined },
  leftWrist: { url: `${bodyPartsBaseUrl}/leftWrist.m4a`, sound: undefined },
  rightWrist: { url: `${bodyPartsBaseUrl}/rightWrist.m4a`, sound: undefined },
  leftHip: { url: `${bodyPartsBaseUrl}/leftHip.m4a`, sound: undefined },
  rightHip: { url: `${bodyPartsBaseUrl}/rightHip.m4a`, sound: undefined },
  leftKnee: { url: `${bodyPartsBaseUrl}/leftKnee.m4a`, sound: undefined },
  rightKnee: { url: `${bodyPartsBaseUrl}/rightKnee.m4a`, sound: undefined },
  leftAnkle: { url: `${bodyPartsBaseUrl}/leftAnkle.m4a`, sound: undefined },
  rightAnkle: { url: `${bodyPartsBaseUrl}/rightAnkle.m4a`, sound: undefined }
};
let clonedBodyParts = [];
let wrapThreshold = 3;
let start = new Date();
let notice;
let areExternalScriptsLoaded = false;
let bodyPartControls;

class BodyPartControls {
  constructor(posX = 15, posY = windowHeight - 90) {
    this.posX = posX;
    this.posY = posY;
    this.uploadBodyPartImageControl = this.createFileInputControl(
      "Body part image",
      function handleFile(file) {
        if (file.type !== "image") {
          return;
        }
        bodyPartsVisuals.push(createBodyPart({}, file.data));
      },
      "Please upload images that contain single body part"
    );
    this.bodyPartsPerColumnControl = this.createSliderControl(
      "Body parts per column",
      1,
      10,
      8,
      "If the value is less than the existing body parts, it'll trigger garbage collection"
    );
    this.initControls();
  }
  initControls() {
    const controlWrapper = createDiv()
      .child(this.uploadBodyPartImageControl.wrapper)
      .child(this.bodyPartsPerColumnControl.wrapper)
      .position(this.posX, this.posY);
  }
  createFileInputControl(text, handleFile, description) {
    const wrapper = createDiv();
    const label = this.createLabel(text);
    const control = createFileInput(handleFile)
      .style("float", "left")
      .style("width", "150px")
      .style("margin", "0 15px 0 0");
    wrapper.child(label);
    wrapper.child(control);
    if (description) {
      wrapper.child(this.createDescription(description));
    }
    return { wrapper, label, control };
  }
  createSliderControl(text, min, max, defaultValue, description) {
    const wrapper = createDiv();
    const label = this.createLabel(text);
    const control = createSlider(min, max, defaultValue)
      .style("float", "left")
      .style("margin", "0 15px 0 0");
    wrapper.child(label);
    wrapper.child(control);
    if (description) {
      wrapper.child(this.createDescription(description));
    }
    return { wrapper, label, control };
  }
  createLabel(text) {
    return createP(text)
      .style("float", "left")
      .style("margin", "0 15px 0 0");
  }
  createDescription(text) {
    return createP(`(${text})`)
      .style("float", "left")
      .style("clear", "left")
      .style("font-size", "0.75rem")
      .style("margin", "0 0 0 0");
  }
}

function preload() {
  soundFormats("m4a");
  Object.keys(bodyPartsSounds).forEach(key => {
    bodyPartsSounds[key].sound = loadSound(bodyPartsSounds[key].url);
  });
}

function setup() {
  noCanvas();
  hideBodyOverflow();
  renderNotice();
  initializeBodyParts(bodyPartsVisuals);
  bodyPartControls = new BodyPartControls();
  Object.values(bodyPartsSounds).forEach(({ sound }) => {
    sound.setVolume(0.2);
  });
}

function draw() {
  if (!areExternalScriptsLoaded) {
    loadExternalScripts();
    return;
  }
  const isWithinTenSeconds = new Date() - start < 10000;
  if (isWithinTenSeconds) {
    notice.show();
  } else {
    notice.hide();
  }
  // P5 draw() doesn't support async. So we create an IIFE here to embed
  // our own async code and to ensure the rest of functions can be invoked.
  (async () => {
    await loadAndPredict();
    wrapThreshold = bodyPartControls.bodyPartsPerColumnControl.control.value();
    const amplification = 1.5;
    const size = windowHeight / wrapThreshold;
    createMoreBodyParts(size, wrapThreshold);
    renderBodyParts(size, wrapThreshold, amplification);
    makeSound();
  })();
  // noLoop();
}

function createMoreBodyParts(size, wrapThreshold) {
  const maxCols = Math.floor(windowWidth / size);
  const maxBodyParts = wrapThreshold * maxCols;
  const bodyPartsDiff =
    maxBodyParts - bodyPartsVisuals.length - clonedBodyParts.length;
  const areAllBodyPartsRendered = bodyPartsVisuals.every(
    bp => bp.canvas.elt.width !== 0 && bp.canvas.elt.height !== 0
  );
  if (bodyPartsDiff > 0 && areAllBodyPartsRendered) {
    for (let i = 0; i < bodyPartsDiff; i++) {
      const oldBodyPart = bodyPartsVisuals[i % bodyPartsVisuals.length];
      const oldCanvas = oldBodyPart.canvas.elt;
      const oldCanvasContext = oldCanvas.getContext("2d");
      const oldCanvasImageData = oldCanvasContext.getImageData(
        0,
        0,
        oldCanvas.width,
        oldCanvas.height
      );
      const newBodyPart = { id: getUniqueId() };
      foo(newBodyPart, oldCanvas.width, oldCanvas.height);
      const newCanvas = newBodyPart.canvas.elt;
      const newCanvasContext = newCanvas.getContext("2d");
      newCanvasContext.putImageData(oldCanvasImageData, 0, 0);
      clonedBodyParts.push(newBodyPart);
    }
  } else if (bodyPartsDiff < 0) {
    if (
      bodyPartsVisuals.length > wrapThreshold &&
      bodyPartsVisuals.length > maxBodyParts
    ) {
      for (let i = 0; i < bodyPartsVisuals.length - maxBodyParts; i++) {
        if (bodyPartsVisuals[i].img) {
          bodyPartsVisuals[i].img.remove();
        }
        if (bodyPartsVisuals[i].canvas) {
          bodyPartsVisuals[i].canvas.remove();
        }
      }
      bodyPartsVisuals.splice(0, bodyPartsVisuals.length - maxBodyParts);
    }
    for (let i = 0; i < clonedBodyParts.length; i++) {
      if (clonedBodyParts[i].canvas) {
        clonedBodyParts[i].canvas.remove();
      }
    }
    clonedBodyParts.splice(0);
  }
}

function renderBodyParts(size, wrapThreshold, amplification) {
  const allBodyParts = [...bodyPartsVisuals, ...clonedBodyParts];
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
}

function makeSound() {
  bodyPartsVisuals.forEach(({ bodyParts }) => {
    if (!bodyParts) {
      return;
    }
    bodyParts.forEach(bodyPart => {
      bodyPartsSounds[bodyPart].sound.play();
      console.log(bodyPart);
    });
  });
}

function getBodyParts(segmentation) {
  return segmentation.allPoses.map(
    ({ keypoints }) => keypoints.sort((a, b) => b.score - a.score)[0].part
  );
}

async function loadAndPredict() {
  const net = await bodyPix.load();
  await Promise.all(
    bodyPartsVisuals.map(
      async ({ isProcessing, bodyPart, url, img, canvas }, i) => {
        // Only calls this expensive classification subroutine once.
        if (isProcessing && bodyPart) {
          return;
        }
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
        bodyPartsVisuals[i].isProcessing = true;
        if (segmentation.allPoses.length) {
          bodyPartsVisuals[i].bodyParts = getBodyParts(segmentation);
        }
      }
    )
  );
}

function initializeBodyParts(bodyPartsArray) {
  bodyPartsArray.forEach(bodyPart => {
    createBodyPart(bodyPart);
  });
}

function createBodyPart(bodyPart, fileData = undefined) {
  const uniqueId = getUniqueId();
  bodyPart.id = uniqueId;
  // console.log(bodyPart.url);
  bodyPart.img = createImg(
    fileData ? fileData : `${bodyPart.url}?${uniqueId}`,
    ""
  )
    // attribute() must be called before id(), see:
    // https://github.com/ml5js/ml5-library/issues/217
    .attribute("crossorigin", "anonymous")
    // We need an unique id for each image, otherwise p5.js will keep
    // using the existing one
    .id(uniqueId)
    .hide();
  foo(bodyPart, bodyPart.img.width, bodyPart.img.height);
  return bodyPart;
}

function foo(bodyPart, bodyPartWidth, bodyPartHeight) {
  bodyPart.canvas = createGraphics(0, 0)
    .id(`canvas-${bodyPart.id}`)
    .position(0, 0)
    // render canvases behind the controls.
    .style("z-index", "-1")
    .style("opacity", "0.7")
    // Code below resets P5 default values to avoid canvas not shown:
    .show()
    .style("width", "")
    .style("height", "");
  bodyPart.canvas.elt.width = bodyPartWidth;
  bodyPart.canvas.elt.height = bodyPartHeight;
}

/**
 * Creates a unique id string like '5519497453702618' for P5 graphics, without this on
 * the second browser load and onwards the console will output:
 *   Uncaught (in promise) DOMException: Failed to execute 'texImage2D' on
 *   'WebGL2RenderingContext': Tainted canvases may not be loaded.
 */
function getUniqueId() {
  return `${Math.random()}`.slice(2);
}

// Hide overflown canvases because some are rendered outside of the window size.
function hideBodyOverflow() {
  const [body] = document.getElementsByTagName("body");
  body.setAttribute("style", "overflow: hidden;");
}

function renderNotice() {
  notice = createP(
    "Click or touch around the screen to allow your browser to play sound!"
  );
  notice
    .position(20, windowWidth / 2)
    .hide()
    .style("font-size", "3rem")
    .style("color", "red");
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
