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

const cycle = {};
const cycleLengths = {};
let current = Object.keys(map).filter(key => key.endsWith('A'));
let directionIndex = 0;
let count = 0;

while (Object.keys(cycleLengths).length < current.length) {
  count++;
  for (let i = 0; i < current.length; i++) {
    const next = map[current[i]][directions[directionIndex]];
    current[i] = next;

    if (next.endsWith('Z')) {
      if (cycle[i] !== undefined && cycleLengths[i] === undefined) {
        cycleLengths[i] = count - cycle[i];
      } else if (cycle[i] === undefined) {
        cycle[i] = count;
      }
    }
  }

  directionIndex++;
  directionIndex = directionIndex % directions.length;
}

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
}

const result = lcm(...Object.values(cycleLengths));

console.log(result);
