/*
From Joseph Albers' Interaction of color:

3 colors appear as 2
[...] the center squares look like the grounds exchanged. But they are of the same color,
precisely alike, and at the same time refer to the neighboring grounds. 
The true color of the two central squares therefore becomes unrecognizable, as it loses its identity.

What color relatedness makes 3 colors look like 2?

Your assignment:
Study this visual example. 
Write your observations in a notepad while looking at the colors. 

- What is the perceived "brightness" relationship between the two rectangular backgrounds?
The lefthand background has less perceived brightness then its righthand counterpart.

- Are the small squares brighter or darker than their respective grounds?
As deceiptive as human perception could be, the lefthand small square is much brighter than both of its background and its small square counterpart. And the righthand small square is much darker than both of its background and the righthand counterpart.
 
- Are they more or less "saturated" than their respective grounds?
Perhaps saturation is also a relative attribute in color perception. Both of the small squares have same amount of saturation comparing with their respective backgrounds.

Now, fork this example and copy your observations into a comment at the top of your code like I'm
doing here.

Replace the color1, color2, and color3 values on lines 42-44 with your own variation.
You must use HSB numbers as color values, and you must use three colors that "appear" as 2 perceptual colors.


Tips: 
Use built-in variables, mouseX, and mouseY as temporary replacements for your hard
coded numbers, and console.log(mouseX, mouseY); to record those numbers for later replacement

Remember that the color argument with the most impact on its position in the color wheel is the first one (hue).
Are the colors in this example analogous or complementary? 
If you answered "analogous", try re-creating the effect with complementary colors/
If you answered "complementary", tr re-creating the effect with analogous colors.
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(0, 0, 100);
  noStroke();
}

function draw() {
  const {
    drawLeftBackground,
    drawRightBackground,
    drawLeftSmallSquare,
    drawRightSmallSquare
  } = squares;
  var color1 = color(121, 72, 55);
  var color2 = color(120, 90, 80);
  var color3 = color(120, 91, 68);

  drawLeftBackground(color1);
  drawRightBackground(color3);
  drawLeftSmallSquare(color2);
  drawRightSmallSquare(color3);
}

/**
 * Instead of using comments, I am trying to use explicit
 * function names to denote the "action and behavior" of the
 * code in the draw function.
 *
 * color global
 */
const squares = {
  drawLeftBackground(colorValue) {
    fill(colorValue);
    rect(0, 0, width / 2, height);
  },
  drawRightBackground(colorValue) {
    fill(colorValue);
    rect(width / 4, height / 4, width / 16, width / 16);
  },
  drawLeftSmallSquare(colorValue) {
    fill(colorValue);
    rect(width / 2, 0, width / 2, height);
  },
  drawRightSmallSquare(colorValue) {
    fill(colorValue);
    rect(width * 0.75, height / 4, width / 16, width / 16);
  }
};
