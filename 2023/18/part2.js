const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

let verticalEdges = {};
let horizontalEdges = {};

let currentW = 0;
let currentH = 0;

const directionsMapping = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U'
}

let perifery = 0;
const instructions = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const infos = lines[i].split(' ');
  const rgbCode = infos[2].slice(2, infos[2].length - 1);
  const direction = directionsMapping[rgbCode[5]];
  const length = parseInt(rgbCode.slice(0, 5), 16);

  instructions.push({
    direction,
    length,
    rgbCode
  });

  switch (direction) {
    case 'U':
      verticalEdges[currentW] = verticalEdges[currentW] || [];
      verticalEdges[currentW].push([currentH - length, currentH]);

      currentH -= length
      break;
    case 'D':
      verticalEdges[currentW] = verticalEdges[currentW] || [];
      verticalEdges[currentW].push([currentH, currentH + length]);

      currentH += length;
      perifery += length;
      break;
    case 'L':
      horizontalEdges[currentH] = horizontalEdges[currentH] || [];
      horizontalEdges[currentH].push([currentW - length, currentW]);

      currentW -= length;
      break;
    case 'R':
      horizontalEdges[currentH] = horizontalEdges[currentH] || [];
      horizontalEdges[currentH].push([currentW, currentW + length]);

      currentW += length;
      perifery += length;
      break;
  }
}

let verticals = Object.keys(verticalEdges).map(v => parseInt(v));
let horizontals = Object.keys(horizontalEdges).map(h => parseInt(h));

const map = [];
for (let i = 0; i < verticals.length; i++) {
  map[i] = [];
  for (let j = 0; j < horizontals.length; j++) {
    map[i][j] = false;
  }
}

const minVertical = Math.min(...verticals);
const minHorizontal = Math.min(...horizontals);

const newHorizontalEdges = {};
const newVerticalEdges = {};

for (let i = 0; i < verticals.length; i++) {
  newVerticalEdges[verticals[i] - minVertical] = verticalEdges[verticals[i]].map(edge => [edge[0] - minHorizontal, edge[1] - minHorizontal]);
}

for (let i = 0; i < horizontals.length; i++) {
  newHorizontalEdges[horizontals[i] - minHorizontal] = horizontalEdges[horizontals[i]].map(edge => [edge[0] - minVertical, edge[1] - minVertical]);
}

verticalEdges = newVerticalEdges;
horizontalEdges = newHorizontalEdges;

verticals = Object.keys(verticalEdges).map(v => parseInt(v));
horizontals = Object.keys(horizontalEdges).map(h => parseInt(h));

let total = 0;
for (let v = 0; v < verticals.length - 1; v++) {
  let isIn = false;

  for (let h = 0; h < horizontals.length - 1; h++) {
    const edges = horizontalEdges[horizontals[h]];
    for (const edge of edges) {
      if (edge[0] <= verticals[v] && verticals[v] < edge[1]) {
        isIn = !isIn;
      }
    }

    if (isIn) {
      total += (verticals[v + 1] - verticals[v]) * (horizontals[h + 1] - horizontals[h]);

      map[h][v] = true;
    }
  }
}

total += perifery;
total += 1;

console.log(total);
