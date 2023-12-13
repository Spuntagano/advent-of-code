const fs = require('fs');
const input = fs.readFileSync('./test3.txt', 'utf8');
const lines = input.split('\n');

const graph = {};

const topVerticalParallels = ['-', 'L', 'J'];
const bottomVerticalParallels = ['-', '7', 'F'];
const leftHorizontalParallels = ['|', 'J', '7'];
const rightHorizontalParallels = ['|', 'F', 'L'];

const parallelMap = [];

let start = null;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const parallelRow = [];
  for (let j = 0; j < lines[i].length; j++) {
    parallelRow.push({
      vertical: false,
      horizontal: false,
    });

    switch (lines[i][j]) {
      case 'F':
        graph[`${i}-${j}`] = [[i, j + 1], [i + 1, j]]
        break;
      case '7':
        graph[`${i}-${j}`] = [[i, j - 1], [i + 1, j]]
        break;
      case 'J':
        graph[`${i}-${j}`] = [[i, j - 1], [i - 1, j]]
        break;
      case 'L':
        graph[`${i}-${j}`] = [[i, j + 1], [i - 1, j]]
        break;
      case '-':
        graph[`${i}-${j}`] = [[i, j + 1], [i, j - 1]]
        break;
      case '|':
        graph[`${i}-${j}`] = [[i - 1, j], [i + 1, j]]
        break;
      case 'S':
        start = [i, j];
        break;
    }
  }

  parallelMap.push(parallelRow);
}

for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length; j++) {
    if (topVerticalParallels.includes(lines[i][j]) && bottomVerticalParallels.includes(lines[i + 1][j])) {
      parallelMap[i][j].vertical = true;
      parallelMap[i + 1][j].vertical = true;
    }
  }
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length - 1; j++) {
    if (leftHorizontalParallels.includes(lines[i][j]) && rightHorizontalParallels.includes(lines[i][j + 1])) {
      parallelMap[i][j].horizontal = true;
      parallelMap[i][j + 1].horizontal = true;
    }
  }
}

let str = '';
for (let i = 0; i < parallelMap.length; i++) {
  for (let j = 0; j < parallelMap[i].length; j++) {
    str += parallelMap[i][j].horizontal ? 'X' : '.';
  }

  str += '\n';
}

console.log(str);


const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const adjacents = [
  [[-1, 0], [1, 0]], 
  [[1, 0], [-1, 0]],
  [[0, -1], [0, 1]],
  [[0, 1], [0, -1]]
];
for (const direction of directions) {
  const [x, y] = direction;
  const [i, j] = start;
  if (graph[`${i + x}-${j + y}`]) {
    graph[`${i + x}-${j + y}`].forEach(position => {
      if (position[0] === i && position[1] === j) {
        graph[`${i}-${j}`] = graph[`${i}-${j}`] || [];
        graph[`${i}-${j}`].push([i + x, j + y]);
      }
    });
  }
}

function dfs(ii, jj, visited, count, isOutside) {
  if (lines[ii][jj] === '.') {
    count.value++;
  }

  for (let i = 0; i < directions.length; i++) {
    if (graph[`${ii}-${jj}`]) {
      if (parallelMap[ii][jj].vertical && !parallelMap[ii][jj].horizontal) {
        if (i === 2 || i === 3) {
          continue;
        }
      }

      if (parallelMap[ii][jj].horizontal && !parallelMap[ii][jj].vertical) {
        if (i === 0 || i === 1) {
          continue;
        }
      }
    }

    const [x, y] = directions[i];
    const adjacent = adjacents[i];
    const [ax, ay] = adjacent[0];
    const [bx, by] = adjacent[1];

    if (ii + x < 0 || ii + x >= lines.length || jj + y < 0 || jj + y >= lines[ii + x].length) {
      isOutside.value = true;
      continue;
    }

    if (visited[`${ii + x}-${jj + y}`]) {
      continue;
    }

    const walls = graph[`${ii + x}-${jj + y}`]?.map(x => x.join('-'));
    if (walls && walls.includes(`${ii + x + ax}-${jj + y + ay}`) && walls.includes(`${ii + x + bx}-${jj + y + by}`)) {
      continue;
    }
  
    visited[`${ii + x}-${jj + y}`] = true;
    dfs(ii + x, jj + y, visited, count, isOutside);
  }
}

const visited = {[`0-0`]: true};
let total = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === '.' && !visited[`${i}-${j}`]) {
      let count = { value: 0 };
      let isOutside = { value: false };
      dfs(i, j, visited, count, isOutside);
      console.log('----');
      if (!isOutside.value) {
        total += count.value;
      }
    }
  }
}

console.log(total);
