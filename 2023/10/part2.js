const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

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
outer: for (const direction of directions) {
  const [x, y] = direction;
  const [i, j] = start;
  if (graph[`${i + x}-${j + y}`]) {
    for (const position of graph[`${i + x}-${j + y}`]) {
      if (position[0] === i && position[1] === j) {
        graph[`${i}-${j}`] = graph[`${i}-${j}`] || [];
        graph[`${i}-${j}`].push([i + x, j + y]);
        break outer;
      }
    };
  }
}

const q = [];
const s = {[`${start[0]}-${start[1]}`]: 0};
q.push(...graph[`${start[0]}-${start[1]}`]);

while (q.length > 0) {
  const [i, j] = q.shift();
  for (const [x, y] of graph[`${i}-${j}`]) {
    if (s[`${x}-${y}`] === undefined) {
      q.push([x, y]);

      s[`${i}-${j}`] = s[`${i}-${j}`] || 1;
      s[`${x}-${y}`] = s[`${i}-${j}`] + 1;
    }
  }
}

function bfs(i, j, visited, isOutside, count, qq) {
  if (i < 0 || i > lines.length - 1 || j < 0 || j > lines[i].length - 1) {
    isOutside.value = true;
    return;
  }

  if (visited[`${i}-${j}`]) {
    return;
  }

  if (s[`${i}-${j}`] !== undefined) {
    return;
  }

  visited[`${i}-${j}`] = true;
  count.value++;

  for (const [x, y] of directions) {
    qq.push([i + x, j + y]);
  }
}

const queue = [];
const steps = {[`${start[0]}-${start[1]}`]: 0};
queue.push(...graph[`${start[0]}-${start[1]}`]);

const adjacentsLeft = {
  '1_0': [0, -1],
  '-1_0': [0, 1],
  '0_1': [1, 0],
  '0_-1': [-1, 0],
};

const adjacentsRight = {
  '1_0': [0, 1],
  '-1_0': [0, -1],
  '0_1': [-1, 0],
  '0_-1': [1, 0],
};

const leftVisited = {};
const rightVisited = {};
const isLeftOutside = { value: false };
const isRightOutside = { value: false };
const leftCount = { value: 0 };
const rightCount = { value: 0 };
const qr = [];
const ql = [];
while (queue.length > 0) {
  const [i, j] = queue.shift();
  for (const [x, y] of graph[`${i}-${j}`]) {
    if (steps[`${x}-${y}`] === undefined) {

      const diff = `${i - x}_${j - y}`;
      const left = adjacentsLeft[diff];
      const right = adjacentsRight[diff];

      queue.push([x, y]);

      ql.push([i + left[0], j + left[1]]);
      ql.push([x + left[0], y + left[1]]);
      while (ql.length > 0) {
        const [ii, jj] = ql.shift();
        bfs(ii, jj, leftVisited, isLeftOutside, leftCount, ql);
      }

      qr.push([i + right[0], j + right[1]]);
      ql.push([x + left[0], y + left[1]]);
      while (qr.length > 0) {
        const [ii, jj] = qr.shift();
        bfs(ii, jj, rightVisited, isRightOutside, rightCount, qr);
      }

      steps[`${i}-${j}`] = steps[`${i}-${j}`] || 1;
      steps[`${x}-${y}`] = steps[`${i}-${j}`] + 1;
    }
  }
}

if (!isLeftOutside.value) {
  console.log(leftCount.value);
}

if (!isRightOutside.value) {
  console.log(rightCount.value);
}

