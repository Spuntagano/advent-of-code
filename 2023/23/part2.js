const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.split('\n');

const graph = {};
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

const visited = new Set();
const graphQueue = [{graphI: 1, graphJ: 1, startI: 0, startJ: 1}];

while (graphQueue.length > 0) {
  const {graphI, graphJ, startI, startJ} = graphQueue.shift();
  const queue = [{i: graphI, j: graphJ, current: 1, lastI: startI, lastJ: startJ}];
  while (queue.length > 0) {
    const {i, j, current, lastI, lastJ} = queue.shift();

    const allowedDirections = [];
    allowedDirections.push({i: i - 1, j});
    allowedDirections.push({i: i + 1, j});
    allowedDirections.push({i, j: j - 1});
    allowedDirections.push({i, j: j + 1});

    const subQueue = [];
    for (let k = 0; k < allowedDirections.length; k++) {
      if (allowedDirections[k].i < 0 || allowedDirections[k].i >= map.length || allowedDirections[k].j < 0 || allowedDirections[k].j >= map[i].length) {
        continue;
      }

      if (map[allowedDirections[k].i][allowedDirections[k].j] === '#') {
        continue;
      }

      if (allowedDirections[k].i === lastI && allowedDirections[k].j === lastJ) {
        continue;
      }

      subQueue.push({i: allowedDirections[k].i, j: allowedDirections[k].j });
    }

    if (subQueue.length === 1) {
      queue.push({i: subQueue[0].i, j: subQueue[0].j, current: current + 1, lastI: i, lastJ: j});
    } else {
      graph[`${i},${j}`] = graph[`${i},${j}`] || [];

      if (graph[`${i},${j}`].findIndex((el) => el.coord === `${startI},${startJ}`) === -1) {
        graph[`${i},${j}`].push({coord: `${startI},${startJ}`, length: current});
      }

      graph[`${startI},${startJ}`] = graph[`${startI},${startJ}`] || [];

      if (graph[`${startI},${startJ}`].findIndex((el) => el.coord === `${i},${j}`) === -1) {
        graph[`${startI},${startJ}`].push({coord: `${i},${j}`, length: current});
      }
      if (!visited.has(`${i},${j}`)) {
        visited.add(`${i},${j}`);
        for (let k = 0; k < subQueue.length; k++) {
          graphQueue.push({graphI: subQueue[k].i, graphJ: subQueue[k].j, startI: i, startJ: j});
        }
      }
    }
  }
}

let max = 0;
function dfs(graph, coord, steps, visited) {
  if (coord === `${map.length - 1},${map[map.length - 1].length - 2}`) {
    if (steps > max) {
      max = steps;
    }
  }

  for (let i = 0; i < graph[coord].length; i++) {
    if (!visited.has(graph[coord][i].coord)) {
      visited.add(graph[coord][i].coord);
      dfs(graph, graph[coord][i].coord, steps + graph[coord][i].length, visited);
      visited.delete(graph[coord][i].coord);
    }
  }
}

dfs(graph, '0,1', 0, new Set(['0,1']));

console.log(max);
