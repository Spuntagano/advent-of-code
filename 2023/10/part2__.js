const fs = require('fs');
const input = fs.readFileSync('./test4.txt', 'utf8');
const lines = input.split('\n');

const topVerticalParallels = ['-', 'L', 'J'];
const bottomVerticalParallels = ['-', '7', 'F'];
const leftHorizontalParallels = ['|', 'J', '7'];
const rightHorizontalParallels = ['|', 'F', 'L'];

const parallelMap = [];

const graph = {};

let start = null;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length; j++) {
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
}

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
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

lines[start[0]][start[1]] = 'F';

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length; j++) {
    if (!graph[`${i}-${j}`]) {
      lines[i][j] = '.';
    }
  }
}
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
    if (parallelMap[i][j].vertical && !parallelMap[i][j].horizontal) {
      str += '>';
    } else if (!parallelMap[i][j].vertical && parallelMap[i][j].horizontal) {
      str += '^';
    } else {
      str += '0';
    }
    
    // str += lines[i][j];
  }

  str += '\n';
}

console.log(str);

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === '.') {
      parallelMap[i][j].vertical = true;
      parallelMap[i][j].horizontal = true;
    }
  }
}

function dfs(ii, jj, visited, count, isOutside) {
  if (visited[`${ii}-${jj}`]) {
    return;
  }

  visited[`${ii}-${jj}`] = true;

  console.log(ii, jj, lines[ii][jj]);

  if (lines[ii][jj] === '.') {
    count.value++;
  }

  for (let i = 0; i < directions.length; i++) {
    const [x, y] = directions[i];

    if (ii + x < 0 || ii + x >= lines.length || jj + y < 0 || jj + y >= lines[ii + x].length) {
      isOutside.value = true;
      continue;
    }

    // vertical
    if (i === 2 || i === 3) {
      if (!parallelMap[ii][jj].horizontal || !parallelMap[ii + x][jj + y].horizontal) {
        continue;
      }
    }

    // horizontal
    if (i === 0 || i === 1) {
      if (!parallelMap[ii][jj].vertical || !parallelMap[ii + x][jj + y].vertical) {
        continue;
      }
    }

    if (lines[ii][jj] !== '.' && lines[ii + x][jj + y] !== '.' && !graph[`${ii}-${jj}`].map(([i, j]) => lines[i][j]).includes(`${ii + x}-${ii + y}`)) {
      continue;
    }
  
    dfs(ii + x, jj + y, visited, count, isOutside);
  }
}

const visited = {};
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
      console.log('----' + isOutside.value);
      if (!isOutside.value) {
        total += count.value;
      }
    }
  }
}

console.log(total);
