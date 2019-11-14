const table = [
  { "day/event": "left home", mon: "8:32", tues: "8:37", weds: "8:27" },
  { "day/event": "arrived office", mon: "9:03", tues: "9:12", weds: "8:50" },
  { "day/event": "left office", mon: "18:15", tues: "18:47", weds: "18:56" },
  { "day/event": "arrived home", mon: "20:26", tues: "19:41", weds: "19:20" }
];
function preload() {
  // table = loadTable(
  //   " https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual792285/hac3886fd314ca8dd0e916378e39b4851/commute.csv",
  //   "csv",
  //   "header"
  // );
}
function setup() {
  // const margin = 30;
  createCanvas(windowWidth, windowHeight);
  const canvas = document.getElementById("defaultCanvas0");
  const canvas2d = canvas.getContext("2d");
  // translate(margin, margin);

  setInterval(() => {}, interval);
}
// function draw() {}

const d3xScale = d3
  .scaleLinear()
  .domain([0, 0.5, 1])
  .range(["aa", "bb", "cc"]);

console.log(d3xScale(0.1));
console.log(d3xScale(0.5));
console.log(d3xScale(0.9));
