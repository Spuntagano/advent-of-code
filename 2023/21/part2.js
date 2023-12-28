const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.split('\n');
const MAX_STEPS = 26501365;
const SIZE = lines.length - 1;
const START_POS = 65;

function calculate(maxSteps, i, j) {
  const start = [];
  const map = [];
  const visited = [];
  const endings = new Set();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '') {
      continue;
    }

    const row = [];
    const visitedRow = [];
    for (let j = 0; j < lines[i].length; j++) {
      row.push(lines[i][j]);
      visitedRow.push(false);

      if (lines[i][j] === 'S') {
        start.push(i, j);
      }
    }

    visited.push(visitedRow);
    map.push(row);
  }

  const queue = [{i: i === undefined ? start[0] : i, j: j === undefined ? start[1] : j, steps: 0}];

  while (queue.length > 0) {
    const {i, j, steps} = queue.shift();

    if (i < 0 || i >= map.length || j < 0 || j >= map[0].length) {
      continue;
    }

    if (map[i][j] === '#') {
      continue;
    }

    if (visited[i][j]) {
      continue
    }

    if (steps > (maxSteps || Infinity)) {
      continue;
    }

    if (steps % 2 === maxSteps % 2) {
      endings.add(`${i},${j}`);
    }

    visited[i][j] = true;

    queue.push({i: i - 1, j, steps: steps + 1});
    queue.push({i: i + 1, j, steps: steps + 1});
    queue.push({i, j: j - 1, steps: steps + 1});
    queue.push({i, j: j + 1, steps: steps + 1});
  }

  const result = endings.size;

  return result;
}

const gridWidth = Math.floor(MAX_STEPS / SIZE) - 1;

const odd = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
const even = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;

const oddPoints = calculate((SIZE * 2) + 1, START_POS, START_POS);
const evenPoints = calculate(SIZE * 2, START_POS, START_POS);

const topCorner = calculate(SIZE - 1, START_POS, SIZE - 1);
const rightCorner = calculate(SIZE - 1, 0, START_POS);
const bottomCorner = calculate(SIZE - 1, START_POS, 0);
const leftCorner = calculate(SIZE - 1, SIZE - 1, START_POS);

const smallTopRight = calculate(Math.floor(SIZE / 2) - 1, 0, SIZE - 1);
const smallTopLeft = calculate(Math.floor(SIZE / 2) - 1, SIZE - 1, SIZE - 1);
const smallBottomRight = calculate(Math.floor(SIZE / 2) - 1, 0, 0);
const smallBottomLeft = calculate(Math.floor(SIZE / 2) - 1, SIZE - 1, 0);

const largeTopRight = calculate(Math.floor((SIZE * 3) / 2) - 1, 0, SIZE - 1);
const largeTopLeft = calculate(Math.floor((SIZE * 3) / 2) - 1, SIZE - 1, SIZE - 1);
const largeBottomRight = calculate(Math.floor(SIZE * 3 / 2) - 1, 0, 0);
const largeBottomLeft = calculate(Math.floor((SIZE * 3) / 2) - 1, SIZE - 1, 0);

console.log(
  odd * oddPoints +
  even * evenPoints +
  topCorner + rightCorner + bottomCorner + leftCorner +
  (gridWidth + 1) * (smallTopRight + smallTopLeft + smallBottomRight + smallBottomLeft) +
  gridWidth * (largeTopRight + largeTopLeft + largeBottomRight + largeBottomLeft)
);
