const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8')
const lines = input.split('\n');

function step(map) {
  const newMap = JSON.parse(JSON.stringify(map));

  for (let i = 0; i < newMap.length; i++) {
    for (let j = 0; j < newMap[i].length; j++) {
      if (i - 1 < 0) {
        continue;
      }

      if (newMap[i - 1][j] !== '.') {
        continue;
      }

      if (newMap[i][j] === 'O') {
        newMap[i - 1][j] = newMap[i][j];
        newMap[i][j] = '.';
      }
    }
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

while (true) {
  const nextMap = step(map);

  if (nextMap.map(x => x.join('')).join('') === map.map(x => x.join('')).join('')) {
    break;
  }

  map = nextMap;
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
