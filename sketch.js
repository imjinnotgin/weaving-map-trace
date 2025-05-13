let weavingDraft;
const canvasSize = 700;
const gridCount = 48;
const cellSize = canvasSize / gridCount;
let gpsTrace = [];

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  noLoop();

  weavingDraft = new WeavingDraft(gridCount, cellSize);
  weavingDraft.generateFromTrace(gpsTrace);
  weavingDraft.draw();

  initMap();

  document.getElementById('reset-btn').addEventListener('click', () => {
    gpsTrace = [];
    weavingDraft.generateFromTrace(gpsTrace);
    redraw();
  });
}

function draw() {}

function initMap() {
  const map = L.map('map').setView([37.5665, 126.9780], 12); // Seoul
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    gpsTrace.push([lat, lng]);

    weavingDraft.generateFromTrace(gpsTrace);
    redraw();
  });
}

// 위빙 드래프트 객체 정의
class WeavingDraft {
  constructor(gridCount, cellSize) {
    this.gridCount = gridCount;
    this.cellSize = cellSize;
    this.grid = [];
    this.reset();
  }

  reset() {
    this.grid = Array(this.gridCount)
      .fill()
      .map(() => Array(this.gridCount).fill(0));
  }

  generateFromTrace(trace) {
    this.reset();

    if (trace.length === 0) return;

    for (let i = 0; i < trace.length; i++) {
      const [lat, lng] = trace[i];

      const seed = floor(map(lat + lng, 0, 360, 0, 100000));
      randomSeed(seed);

      for (let y = 0; y < this.gridCount; y++) {
        for (let x = 0; x < this.gridCount; x++) {
          this.grid[y][x] ^= floor(random(2)); // XOR로 점진적 변화
        }
      }
    }
  }

  draw() {
    background(255);
    stroke(0, 50); // 얇은 검은색 실선
    strokeWeight(0.5);

    for (let y = 0; y < this.gridCount; y++) {
      for (let x = 0; x < this.gridCount; x++) {
        fill(this.grid[y][x] ? randomColor(x, y) : 255);
        rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    // 격자 그리드
    stroke(0, 80);
    noFill();
    for (let i = 0; i <= this.gridCount; i++) {
      let pos = i * this.cellSize;
      line(0, pos, width, pos);
      line(pos, 0, pos, height);
    }
  }
}

function randomColor(x, y) {
  // 패턴에 약간의 다채로움
  const base = (x * y) % 255;
  return color((base + 100) % 255, (base + 50) % 255, (base + 150) % 255);
}

