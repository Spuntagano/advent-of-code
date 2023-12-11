const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

const horizontals = [];
const verticals = [];
const coordinates = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  if (lines[i].split('').every((char) => char === '.')) {
    horizontals.push(i);
  }
}

for (let j = 0; j < lines[0].length; j++) {
  const acc = [];
  for (let i = 0; i < lines[i].length; i++) {
    acc.push(lines[i][j]);

    if (lines[i][j] === '#') {
      coordinates.push([i, j]);
    }
  }

  if (acc.every((char) => char === '.')) {
    verticals.push(j);
  }
}

let total = 0;
for (let i = 0; i < coordinates.length; i++) {
  for (let j = i + 1; j < coordinates.length; j++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[j];

    let length = Math.abs(x1 - x2) + Math.abs(y1 - y2);

    const sortedX = [x1, x2].sort((a, b) => a - b);
    const sortedY = [y1, y2].sort((a, b) => a - b);

    for (const horizontal of horizontals) {
      if (sortedX[0] <= horizontal && horizontal <= sortedX[1]) {
        length += 1000000 - 1;
      }
    }

    for (const vertical of verticals) {
      if (sortedY[0] <= vertical && vertical <= sortedY[1]) {
        length += 1000000 - 1;
      }
    }

    total += length;
  }
}

console.log(total);
