function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  drawSquares();
  console.log(mouseX, mouseY);
}

function drawSquares() {
  const w = width / 77;
  const h = height / 77;
  let x1 = width / 5;
  let y1 = height / 5;
  // let x2 = width * 3/ 4;
  // let y3 = height * 3/ 4;
  fill("red");
  rect(x1, y1, w, h);
  console.log(size);
  console.log(x1, y1, x2, y2);
}
