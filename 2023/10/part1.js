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

const queue = [];
const steps = {[`${start[0]}-${start[1]}`]: 0};
queue.push(...graph[`${start[0]}-${start[1]}`]);

while (queue.length > 0) {
  const [i, j] = queue.shift();
  for (const [x, y] of graph[`${i}-${j}`]) {
    if (steps[`${x}-${y}`] === undefined) {
      queue.push([x, y]);
      steps[`${i}-${j}`] = steps[`${i}-${j}`] || 1;
      steps[`${x}-${y}`] = steps[`${i}-${j}`] + 1;
    }
  }
}

const result = Math.max(...Object.values(steps));
console.log(result);
