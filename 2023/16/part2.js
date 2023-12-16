const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

function initMap() {
  map = [];
  energizedMap = [];
  cache = [];

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

  return [map, energizedMap, cache];
}

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

let max = 0;

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    for (const direction of Object.keys(directions)) {
      if (!(i === 0 || i === map.length - 1 || j === 0 || j === map[i].length - 1)) {
        continue;
      }

      [map, energizedMap, cache] = initMap();
      const queue = [];

      if (i === 0 && direction === 'down') {
        queue.push({
          position: [i, j],
          direction: 'down',
        });
      }

      if (i === map.length - 1 && direction === 'up') {
        queue.push({
          position: [i, j],
          direction: 'up',
        });
      }

      if (j === 0 && direction === 'right') {
        queue.push({
          position: [i, j],
          direction: 'right',
        });
      }

      if (j === map[i].length - 1 && direction === 'left') {
        queue.push({
          position: [i, j],
          direction: 'left',
        });
      }

      let count = 0;
      while (queue.length > 0) {
        const { position, direction } = queue.shift();

        const [y, x] = position;

        if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) {
          continue;
        }

        if (cache[y][x][direction]) {
          continue;
        }

        if (!energizedMap[y][x]) {
          count++;
          energizedMap[y][x] = true;
        }

        cache[y][x][direction] = true;

        const symbol = map[y][x];
        const nextDirections = reflections[symbol][direction];

        for (let k = 0; k < nextDirections.length; k++) {
          const nextDirection = nextDirections[k];
          const [di, dj] = directions[nextDirection];
          const nextPosition = [y + di, x + dj];

          queue.push({
            position: nextPosition,
            direction: nextDirection,
          });
        }
      }

      max = Math.max(max, count);
    }
  }
}

console.log(max);
