const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

const directions = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const reflections = {
  '/': {
    up: ['right'],
    down: ['left'],
    left: ['down'],
    right: ['up'],
  },

  '\\': {
    up: ['left'],
    down: ['right'],
    left: ['up'],
    right: ['down'],
  },

  '|': {
    up: ['up'],
    down: ['down'],
    left: ['up', 'down'],
    right: ['up', 'down'],
  },

  '-': {
    up: ['left', 'right'],
    down: ['left', 'right'],
    left: ['left'],
    right: ['right'],
  },

  '.': {
    up: ['up'],
    down: ['down'],
    left: ['left'],
    right: ['right'],
  }
}

const map = [];
const energizedMap = [];
const cache = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const row = [];
  const energizedRow = [];
  const cacheRow = [];
  for (let j = 0; j < lines[i].length; j++) {
    row.push(lines[i][j]);
    energizedRow.push(false);
    cacheRow.push({
      up: false,
      down: false,
      left: false,
      right: false,
    });
  }

  map.push(row);
  energizedMap.push(energizedRow);
  cache.push(cacheRow);
}

const queue = [{
  position: [0, 0],
  direction: 'right',
}];

let count = 0;
while (queue.length > 0) {
  const { position, direction } = queue.shift();

  const [i, j] = position;

  if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
    continue;
  }

  if (cache[i][j][direction]) {
    continue;
  }

  if (!energizedMap[i][j]) {
    count++;
    energizedMap[i][j] = true;
  }

  cache[i][j][direction] = true;

  const symbol = map[i][j];
  const nextDirections = reflections[symbol][direction];

  for (let k = 0; k < nextDirections.length; k++) {
    const nextDirection = nextDirections[k];
    const [di, dj] = directions[nextDirection];
    const nextPosition = [i + di, j + dj];

    queue.push({
      position: nextPosition,
      direction: nextDirection,
    });
  }
}

console.log(count);
