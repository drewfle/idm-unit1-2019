/**
 * Usage:
 * - Press any key to stop both sprite animations.
 * - Click mouse or tap screen to revert small sprite moving direction.
 * Idea: I've been working in the financial district in Manhattan for nearly 7 years. Not a life style I could imagine when I was still an artist, although back in the coolest days I used to see the financial district of London from my art studio. And to me personally it was a distant and timeless urban landscape. For this assignment, I picked some pictures that had the buildings I've worked at during these years. However, with the idea of using found images, I also picked some images for the sprite foreground that could potentially show an opposite quality to Wall street/financial district atmosphere.
 */

const financialDistrictImages = [
  "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual799889/h5c51ab33f1c29b792594c32ab854d5b1/1.png",
  "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual799889/h5c51ab33f1c29b792594c32ab854d5b1/2.png",
  "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual799889/h5c51ab33f1c29b792594c32ab854d5b1/3.png"
];
const artistMindsetImages = [
  "https://upload.wikimedia.org/wikipedia/commons/4/41/Rule142rand.png",
  "https://upload.wikimedia.org/wikipedia/commons/0/0f/Rule1rand.png"
  // ^: Directly using images from wikimedia. Fetching images from this
  // openprocessing files threw `Warning undefined frame 0`. No errors when
  // only fetching one image and both urls are correct.
  // "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual799889/h5c51ab33f1c29b792594c32ab854d5b1/4.png"
  // "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual799889/h5c51ab33f1c29b792594c32ab854d5b1/5.png"
];
const financialDistrictSpriteImageSize = 800;
const artistMindsetImageSize = 100;
let colors;
let drawingAreaSize;
let financialDistrictSprite;
let artistMindsetSprite;
let artistMindsetVelocity = 5;

function setup() {
  // Make the sprite to fill the whole screen
  drawingAreaSize = Math.max(windowWidth, windowHeight);
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  createCanvas(drawingAreaSize, drawingAreaSize);
  frameRate(15);
  colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255]
  ];
  financialDistrictSprite = createSprite(
    centerX,
    centerY,
    drawingAreaSize,
    drawingAreaSize
  );
  artistMindsetSprite = createSprite(centerX, centerY, 100, 100);
  financialDistrictSprite.scale =
    drawingAreaSize / financialDistrictSpriteImageSize;
  financialDistrictSprite.addAnimation("normal", ...financialDistrictImages);
  artistMindsetSprite.addAnimation("normal", ...artistMindsetImages);
  artistMindsetSprite.velocity.x = artistMindsetVelocity;
}

function draw() {
  background(255, 255, 255);
  // Press any key to stop both sprite animations
  if (keyIsPressed) {
    financialDistrictSprite.animation.stop();
    artistMindsetSprite.animation.stop();
    artistMindsetSprite.velocity.x = 0;
  } else {
    financialDistrictSprite.animation.play();
    artistMindsetSprite.animation.play();
    artistMindsetSprite.velocity.x = artistMindsetVelocity;
  }
  // Resets the moving direction of artistMindsetSprite
  if (artistMindsetSprite.position.x > drawingAreaSize) {
    artistMindsetSprite.position.x = 0;
  }
  if (artistMindsetSprite.position.x < 0) {
    artistMindsetSprite.position.x = drawingAreaSize;
  }
  // Changes to a different sprite frame at each draw() execution. Because
  // by default p5.play changes at every 4th call to draw() which isn't
  // fast enough to create the effect I would like to have.
  const frame = frameCount % 3;
  drawSpriteWithTint(financialDistrictSprite, colors, frame);
  drawSprite(artistMindsetSprite);
}

/**
 * Draws sprite with tint per frame
 * @param {object} spriteObject
 * @param {color[]} rgbColors
 * @param {number} frame
 */
function drawSpriteWithTint(spriteObject, rgbColors, frame) {
  if (spriteObject.animation.playing) {
    tint(rgbColors[frame]);
    spriteObject.animation.changeFrame(frame);
  }
  drawSprite(spriteObject);
  noTint();
}

function mouseClicked() {
  artistMindsetVelocity *= -1;
  artistMindsetSprite.velocity.x = artistMindsetVelocity;
}
