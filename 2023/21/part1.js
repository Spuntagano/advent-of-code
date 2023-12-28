const fs = require('fs');
const inputFileName = 'input.txt';
const input = fs.readFileSync(inputFileName, 'utf8');

const MAX_STEPS = inputFileName === 'input.txt' ? 64 : 6;
const lines = input.split('\n');

const start = [];
const map = [];
const visited = [];
const endings = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const row = [];
  const visitedRow = [];
  const endingRow = [];
  for (let j = 0; j < lines[i].length; j++) {
    row.push(lines[i][j]);
    visitedRow.push({});
    endingRow.push(false);

    if (lines[i][j] === 'S') {
      start.push(i, j);
    }
  }

  visited.push(visitedRow);
  map.push(row);
  endings.push(endingRow);
}

function dfs(map, i, j, endings, steps, visited) {
  if (i < 0 || i >= map.length || j < 0 || j >= map[0].length) {
    return;
  }

  if (map[i][j] === '#') {
    return;
  }

  if (visited[i][j][steps]) {
    return;
  }

  if (steps === MAX_STEPS) {
    endings[i][j] = true;
    return;
  }

  visited[i][j][steps] = true;

  dfs(map, i - 1, j, endings, steps + 1, visited);
  dfs(map, i + 1, j, endings, steps + 1, visited);
  dfs(map, i, j - 1, endings, steps + 1, visited);
  dfs(map, i, j + 1, endings, steps + 1, visited);
}

dfs(map, start[0], start[1], endings, 0, visited);

const result = endings.reduce((acc, row) => {
  return acc + row.filter((v) => v).length;
}, 0);

console.log(result);
