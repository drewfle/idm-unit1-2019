/**
 * Create a user interface for your canvas sketch using the DOM library. The
 * interface should control the following parameters in your sketch:
 *   size, color, animationSpeed, isAnimated.
 * Think about how you might trigger or
 * change these parameters with buttons, sliders, hover interaction, etc.
 */

var inputTextElement;
var inputText = "";

var elements = [];

var colorPalette = ["#EE964B", "#F4D35E", "#083D77", "#F95738", "#85C7F2"]; //an array containing colors for our palette
var x = 0;
var speed = 0.01;
var spacing = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  inputTextElement = createInput();
  inputTextElement.position(20, 20);
  inputTextElement.input(handleInput);
  for (var i = 0; i < 12; i++) {
    var h1 = createElement("h1", "I'm an h1");
    h1.position(
      cos(map(i + 10, 0, 12, 0, TWO_PI)) * 300 + windowWidth / 2,
      sin(map(i + 10, 0, 12, 0, TWO_PI)) * 300 + windowHeight / 2
    );
    elements.push(h1);
  }
}

function draw() {
  // background(255);
  var c = 0; //placeholder for our colorPalette array index
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      makeShape(
        x * ((width - spacing) / 10),
        y * ((height - spacing) / 10),
        colorPalette[c % colorPalette.length]
      );
      c++; //increment our color palette iterator
    }
  }
  for (var i = 0; i < elements.length; i++) {
    elements[i].html(i + 1);
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

function handleInput() {
  inputText = this.value();
}

function keyPressed() {
  if (key === "\r" || key === "Enter") {
    fill(0);
    inputTextElement.value("");
    text(inputText, random(windowWidth), random(windowHeight));
  }
}

function makeShape(posX, posY, colr) {
  fill(color(colr));
  noStroke();
  beginShape();
  curveVertex(posX - 10, posY + 125);
  curveVertex(posX + 10, posY + 125);
  curveVertex(posX + x, posY + 200);
  curveVertex(posX + 10 + x, posY + 275);
  curveVertex(posX + x, posY + 300);
  curveVertex(posX - 10 + x, posY + 275);
  curveVertex(posX - 20 + x, posY + 200);
  curveVertex(posX - 10 + x, posY + 125);
  endShape(CLOSE);
  if (x > 100 || x < 0) {
    speed = -speed;
  }
  x = x + speed;
}

// /**
//  * Default values for initializing class instances. Set to static to keep
//  * memory footprint small.
//  */
// static defaultValues = {
//   circleColor: colors.white,
//   stingColor: "white"
// };
