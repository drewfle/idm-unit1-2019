let 

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}
function draw() {
  stroke('red')
  point(mouseX, mouseY)
  line(0,0,100,100)
  // console.log(mouseX)
  if (touches.length)
    console.log(touches.length)
}

function drawCharacters(
  positionX,
  positionY,
  characterWidth,
  characterHeight,
  characterColor 
) {

}

function drawCharacter(
  positionX,
  positionY,
  blockWidth,
  blockHeight,
  characterColor,
  direction
) {
  const rand = 0.42;
  const posX = positionX + rand * blockWidth;
  const posY = positionY + direction * blockHeight;
  rect(posX, posY, blockWidth, blockHeight);
}

/**
 * Checks if user mouse cursor or 
 */
function hasUserClickedOrTouched() {
  
}

function mouseClicked() {
  console.log('clicked')
  line(200,200,100,100)
}