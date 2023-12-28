const fs = require('fs');
const fileName = 'input.txt';
const input = fs.readFileSync(fileName, 'utf8');
const lines = input.split('\n');

const LOW_BOUND = fileName === 'input.txt' ? 200000000000000 : 7;
const HIGH_BOUND = fileName === 'input.txt' ? 400000000000000 : 27;

const hails = [];

function getDir(sx, sy) {
  if (sx > 0) {
    if (sy > 0) {
      return 'upright';
    }

    if (sy < 0) {
      return 'downright';
    }
  }

  if (sx < 0) {
    if (sy > 0) {
      return 'upleft';
    }

    if (sy < 0) {
      return 'downleft';
    }
  }

  throw new Error('Invalid dir');
}

function getDirection(sx, sy, dx, dy) {
  if (sx > dx) {
    if (sy > dy) {
      return 'downleft';
    }

    if (sy < dy) {
      return 'upleft';
    }
  }

  if (sx < dx) {
    if (sy > dy) {
      return 'downright';
    }

    if (sy < dy) {
      return 'upright';
    }
  }

  throw new Error('Invalid direction');
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const hail = lines[i].split(' @ ');
  const [px, py, pz] = hail[0].split(', ').map(Number);
  const [vx, vy, vz] = hail[1].split(', ').map(Number);

  const dydx = vy / vx;
  const y = py - dydx * px;

  hails.push({px, py, pz, vx, vy, vz, y, dydx});
}

let total = 0;
for (let i = 0; i < hails.length; i++) {
  for (let j = i + 1; j < hails.length; j++) {
    const h1 = hails[i];
    const h2 = hails[j];

    if (h1.dydx === h2.dydx) {
      continue;
    }

    const x = (h1.y - h2.y) / (h2.dydx - h1.dydx);
    const y = h1.y + (h1.dydx * x);

    if (x >= LOW_BOUND && x <= HIGH_BOUND && y >= LOW_BOUND && y <= HIGH_BOUND) {
      if (getDirection(h1.px, h1.py, x, y) === getDir(h1.vx, h1.vy) && getDirection(h2.px, h2.py, x, y) === getDir(h2.vx, h2.vy)) {
        total++;
      }
    }
  }
}

console.log(total);
