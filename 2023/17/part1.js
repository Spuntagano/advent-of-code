const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

const map = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const row = [];
  for (let j = 0; j < lines[i].length; j++) {
    row.push(parseInt(lines[i][j]));
  }

  map.push(row);
}

const directions = {
  'up': [-1, 0],
  'down': [1, 0],
  'left': [0, -1],
  'right': [0, 1]
};

const possibleDirections = {
  'up': ['left', 'up', 'right'],
  'down': ['right', 'down', 'left'],
  'left': ['down', 'left', 'up'],
  'right': ['up', 'right', 'down']
};

const visited = new Set();
const queue = [
  {heat: map[0][1], i: 0, j: 1, direction: 'right', consecutiveCount: 1},
  {heat: map[1][0], i: 1, j: 0, direction: 'down', consecutiveCount: 1}
];

while (queue.length > 0) {
  const {heat, i, j, direction, consecutiveCount} = queue.shift();

  if (consecutiveCount === 3) {
    continue;
  }

  if (i === map.length - 1 && j === map[0].length - 1) {
    console.log(heat);
    break;
  }

  if (visited.has(`${i},${j},${direction},${consecutiveCount}`)) {
    continue;
  }

  visited.add(`${i},${j},${direction},${consecutiveCount}`);

  for (let k = 0; k < possibleDirections[direction].length; k++) {
    const newDirection = possibleDirections[direction][k];
    const [newI, newJ] = directions[newDirection];

    if (i + newI < 0 || i + newI >= map.length || j + newJ < 0 || j + newJ >= map[0].length) {
      continue;
    }

    const newHeat = heat + map[i + newI][j + newJ];

    queue.push({
      heat: newHeat,
      i: i + newI,
      j: j + newJ,
      direction: newDirection,
      consecutiveCount: newDirection === direction ? consecutiveCount + 1 : 0
    });
  }

  queue.sort((a, b) => a.heat - b.heat);
}

