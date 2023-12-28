const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n');

function printMap(map) {
  let str = '';
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === null) {
        str += '.... ';
        continue;
      }

      str += String(map[i][j]).padStart(4, '0') + ' ';
    }

    str += '\n';
  }
  console.log(str);
}

let xLength = 0;
let yLength = 0;
let zLength = 0;

const blocks = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const bricks = lines[i].split('~');
  const [x1, y1, z1] = bricks[0].split(',').map(Number);
  const [x2, y2, z2] = bricks[1].split(',').map(Number);

  blocks.push({ x1, y1, z1, x2, y2, z2, index: i });

  xLength = Math.max(xLength, x1, x2);
  yLength = Math.max(yLength, y1, y2);
  zLength = Math.max(zLength, z1, z2);
}

const heightMap = new Array(xLength + 1).fill(0).map(() => new Array(yLength + 1).fill(0));
const supportMap = new Array(xLength + 1).fill(0).map(() => new Array(yLength + 1).fill(null));

blocks.sort((a, b) => { return a.z1 - b.z1 });

const supportsList = {};
for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  const { x1, y1, z1, x2, y2, z2 } = block;

  let max = 0;
  const supports = new Set();
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      max = Math.max(max, heightMap[x][y]);
    }
  }

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      if (heightMap[x][y] === max) {
        supports.add(supportMap[x][y]);
      }
    }
  }

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      heightMap[x][y] = max + z2 - z1 + 1;
      supportMap[x][y] = block.index;
    }
  }

  supports.forEach((support) => {
    if (support !== null) {
      supportsList[block.index] = supportsList[block.index] || [];
      supportsList[block.index].push(support);
    }
  });
}

function dfs(current, supportsList) {
  const keys = Object.keys(supportsList).map(Number);

  let total = 1;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (supportsList[key] === undefined) {
      continue;
    }

    const index = supportsList[key].indexOf(current);
    if (index !== -1) {
      supportsList[key].splice(index, 1);
    }

    if (supportsList[key].length === 0) {
      delete supportsList[key];
      total += dfs(key, supportsList);
    }
  }

  return total;
}

let total = 0;
for (let i = 0; i < blocks.length; i++) {
  total += dfs(blocks[i].index, JSON.parse(JSON.stringify(supportsList))) - 1;
}

console.log(total);

