let halfW;
let slope;

function setup() {
  halfW = windowWidth / 2;
  slope = halfW / windowHeight;
  createCanvas(windowWidth, windowHeight);
  background(124);
  console.log('foo');
}
function draw() {
  drawTriangle();
}

function drawTriangle() {
  const interval = 5;
  const loX = halfW;
  const hiY = 0;
  beginShape(LINES);
  for (let loY = interval; loY <= windowHeight ; loY += interval) {
   // const delta = 
    const hiRightX = loX + slope * loY;
    const hiLeftX = loX - slope * loY;
    //vertex(loX, loY);
    vertex(hiRightX, hiY);
    //vertex(loX, loY);

    vertex(hiLeftX, hiY);
    vertex(loX, loY);
  }
  endShape();
}