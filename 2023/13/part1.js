const fs = require('fs');
const { abort } = require('process');

const input = fs.readFileSync('./input.txt', 'utf8');
const blocks = input.split('\n\n');

function checkHorizontalMirror(map, index, length) {
  const distance = Math.min(length - index, index);

  for (let i = 1; i <= distance; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[index - i][j] !== map[index + i - 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function checkVerticalMirror(map, index, length) {
  const distance = Math.min(length - index, index);

  for (let i = 0; i < map.length; i++) {
    for (let j = 1; j <= distance; j++) {
      if (map[i][index - j] !== map[i][index + j - 1]) {
        return false;
      }
    }
  }

  return true;
}

const maps = [];
for (const block of blocks) {
  const map = [];
  const lines = block.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      map[i] = map[i] || [];
      map[i][j] = lines[i][j];
    }
  }

  maps.push(map);
}

let result = 0;
for (const map of maps) {
  for (let i = 1; i < map.length; i++) {
    if (checkHorizontalMirror(map, i, map.length)) {
      result += i * 100;
    }
  }

  for (let i = 1; i < map[0].length; i++) {
    if (checkVerticalMirror(map, i, map[0].length)) {
      result += i;
    }
  }
}

console.log(result);
