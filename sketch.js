let coordinates = [];
const canvasSize = 700;
const gridCount = 48;
const cellSize = canvasSize / gridCount;

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  noLoop();

  background(255);
  drawGrid();
  initMap();
}

function draw() {
  background(255);
  drawGrid();
  drawPatternFromCoordinates(coordinates);
}

function drawGrid() {
  stroke(0, 30);
  for (let i = 0; i <= gridCount; i++) {
    line(i * cellSize, 0, i * cellSize, canvasSize);
    line(0, i * cellSize, canvasSize, i * cellSize);
  }
}

function drawPatternFromCoordinates(coords) {
  const latRange = [37.55, 37.58];
  const lngRange = [126.97, 126.99];

  fill(0);
  noStroke();
  for (let i = 0; i < coords.length; i++) {
    let lat = coords[i][0];
    let lng = coords[i][1];
    let x = int(map(lng, lngRange[0], lngRange[1], 0, gridCount));
    let y = int(map(lat, latRange[0], latRange[1], 0, gridCount));

    rect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}

function initMap() {
  const map = L.map('map').setView([37.5665, 126.9780], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    coordinates.push([lat, lng]);
    redraw();
  });
}

function clearCoordinates() {
  coordinates = [];
  redraw();
}
