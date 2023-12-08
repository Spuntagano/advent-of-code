const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const blocks = input.split('\n\n');

const directions = blocks[0].split('');
const lines = blocks[1].split('\n');

const map = {};

for (let line of lines) {
  if (line === '') {
    continue;
  }

  const [current, next] = line.split(' = ');
  const coords = next.split(', ');
  const left = coords[0].replace(/\(/g, '');
  const right = coords[1].replace(/\)/g, '');

  map[current] = {
    'L': left,
    'R': right,
  };
}

let current = 'AAA';
let directionIndex = 0;
let count = 0;

while (current !== 'ZZZ') {
  current = map[current][directions[directionIndex]];
  directionIndex++;
  directionIndex = directionIndex % directions.length;
  count++;
}

console.log(count);
