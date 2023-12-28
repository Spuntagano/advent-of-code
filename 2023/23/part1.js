const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.split('\n');

const map = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const row = [];
  for (let j = 0; j < lines[i].length; j++) {
    row.push(lines[i][j]);
  }

  map.push(row);
}

const queue = [{i: 0, j: 1, current: 0, set: new Set()}];

let max = 0;
while (queue.length > 0) {
  const {i, j, current, set} = queue.shift();

  if (i === map.length - 1 && j === map[i].length - 2) {
    max = Math.max(max, current);
  }

  const allowedDirections = [];
  if (map[i][j] === '.') {
    allowedDirections.push({i: i - 1, j});
    allowedDirections.push({i: i + 1, j});
    allowedDirections.push({i, j: j - 1});
    allowedDirections.push({i, j: j + 1});
  }

  if (map[i][j] === '>') {
    allowedDirections.push({i, j: j + 1});
  }

  if (map[i][j] === '<') {
    allowedDirections.push({i, j: j - 1});
  }

  if (map[i][j] === '^') {
    allowedDirections.push({i: i - 1, j});
  }

  if (map[i][j] === 'v') {
    allowedDirections.push({i: i + 1, j});
  }

  const subQueue = [];
  for (let k = 0; k < allowedDirections.length; k++) {
    if (allowedDirections[k].i < 0 || allowedDirections[k].i >= map.length || allowedDirections[k].j < 0 || allowedDirections[k].j >= map[i].length) {
      continue;
    }

    if (map[allowedDirections[k].i][allowedDirections[k].j] === '#') {
      continue;
    }

    if (set.has(`${allowedDirections[k].i},${allowedDirections[k].j}`)) {
      continue;
    }

    subQueue.push({i: allowedDirections[k].i, j: allowedDirections[k].j });
  }


  let newSet = set;
  for (let k = 0; k < subQueue.length; k++) {
    if (subQueue.length > 1) {
      newSet = new Set([...set]);
    }

    newSet.add(`${subQueue[k].i},${subQueue[k].j}`);
    queue.push({i: subQueue[k].i, j: subQueue[k].j, current: current + 1, set: newSet});
  }
}

console.log(max);
