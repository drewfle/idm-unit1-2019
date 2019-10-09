function setup() {
  createCanvas(windowWidth, windowHeight);
  drawSquares();
}

function draw() {
  // drawSquares();
  rotate( frameCount % PI)
  console.log(mouseX, mouseY);
}

function drawSquares() {
  const w = width / 77;
  const h = height / 77;
  let x = width / 6;
  let y = height / 6;
  fill("red");
  for (let i = 0; i < 5; i++) {
    push();
    translate(x * i, 0);
    rect(x, y, w, h);
    for (let j = 0; j < 5; j++) {
      push();
      translate(0, y * j);
      rect(x, y, w, h);
      pop();
    }
    pop()
  }
}

