const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8')
const lines = input.split('\n');

function step(map, x, y) {
  const newMap = JSON.parse(JSON.stringify(map));

  for (let i = 0; i < newMap.length; i++) {
    for (let j = 0; j < newMap[i].length; j++) {
      if (i + x < 0 || i + x >= newMap.length || j + y < 0 || j + y >= newMap[i].length) {
        continue;
      }

      if (newMap[i + x][j + y] !== '.') {
        continue;
      }

      if (newMap[i][j] === 'O') {
        newMap[i + x][j + y] = newMap[i][j];
        newMap[i][j] = '.';
      }
    }
  }

  return newMap;
}

function side(map, x, y) {
  let currentMap = JSON.parse(JSON.stringify(map));

  while (true) {
    const nextMap = step(currentMap, x, y);

    if (JSON.stringify(nextMap) === JSON.stringify(currentMap)) {
      break;
    }

    currentMap = nextMap;
  }

  return currentMap;
}

function cycle(map) {
  let newMap = JSON.parse(JSON.stringify(map));
  const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  for (const direction of directions) {
    newMap = side(newMap, direction[0], direction[1]);
  }

  return newMap;
}

let map = [];
for (const line of lines) {
  if (line === '') {
    continue;
  }

  const row = [];
  for (const char of line) {
    row.push(char);
  }

  map.push(row);
}

const cycles = {};
for (let i = 0; i < 1000000000; i++) {
  const key = JSON.stringify(map);
  if (cycles[key]) {
    const delta = i - cycles[key];
    const start = 1000000000 - cycles[key];
    
    if (start % delta === 0) {
      break;
    }
  }
  
  cycles[key] = i;
  map = cycle(map);
}

let count = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === 'O') {
      count += map.length - i;
    }
  }
}

console.log(count);
