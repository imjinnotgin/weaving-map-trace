let weavingDraft;
const canvasSize = 700;
const gridCount = 48;
const cellSize = canvasSize / gridCount;
let gpsPoints = [];

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  noLoop();

  weavingDraft = new WeavingDraft(gridCount, cellSize);
  initMap();
  updatePattern();
  createResetButton();
}

function draw() {
  background(255);
  weavingDraft.draw();
  drawGridOverlay();
}

function updatePattern() {
  weavingDraft.clear();
  for (let i = 0; i < gpsPoints.length; i++) {
    let strength = (i + 1) / gpsPoints.length;
    weavingDraft.applyFromLatLng(gpsPoints[i][0], gpsPoints[i][1], strength);
  }
  redraw();
}

function initMap() {
  const map = L.map('map').setView([37.5665, 126.9780], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  map.on('click', function (e) {
    if (gpsPoints.length >= 5) return;

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    gpsPoints.push([lat, lng]);
    updatePattern();
  });
}

function createResetButton() {
  const btn = createButton('좌표 초기화');
  btn.parent('controls');
  btn.mousePressed(() => {
    gpsPoints = [];
    updatePattern();
  });
}

function drawGridOverlay() {
  stroke(0, 40);
  strokeWeight(0.5);
  for (let i = 0; i <= gridCount; i++) {
    const pos = i * cellSize;
    line(pos, 0, pos, height);
    line(0, pos, width, pos);
  }
}

class WeavingDraft {
  constructor(gridCount, cellSize) {
    this.gridCount = gridCount;
    this.cellSize = cellSize;
    this.grid = Array.from({ length: gridCount }, () =>
      Array(gridCount).fill(0)
    );
  }

  clear() {
    for (let y = 0; y < this.gridCount; y++) {
      for (let x = 0; x < this.gridCount; x++) {
        this.grid[y][x] = 0;
      }
    }
  }

  applyFromLatLng(lat, lng, strength = 1) {
    const seed = Math.abs(Math.sin(lat * lng) * 10000);
    let randSeed = seed;
    const rand = () => {
      randSeed = (randSeed * 9301 + 49297) % 233280;
      return randSeed / 233280;
    };

    for (let y = 0; y < this.gridCount; y++) {
      for (let x = 0; x < this.gridCount; x++) {
        const pattern = rand() > 0.5 ? 1 : 0;
        this.grid[y][x] += pattern * strength;
      }
    }
  }

  draw() {
    for (let y = 0; y < this.gridCount; y++) {
      for (let x = 0; x < this.gridCount; x++) {
        const value = constrain(this.grid[y][x], 0, 1);
        fill(value > 0.5 ? color(0) : 255);
        noStroke();
        rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}


