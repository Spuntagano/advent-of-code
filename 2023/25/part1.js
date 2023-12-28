const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

class Edge {
  constructor(s, d) {
    this.src = s;
    this.dest = d;
  }
}

class Graph {
  constructor(v, e) {
    this.V = v;
    this.E = e;
    this.edge = [];
  }
}

class subset {
  constructor(p, r) {
    this.parent = p;
    this.rank = r;
  }
}

function kargerMinCut(graph) {
  let V = graph.V;
  let E = graph.E;
  let edge = graph.edge;

  let subsets = [];
  let cut = [];

  for (let v = 0; v < V; v++) {
    subsets[v] = new subset(v, 0);
  }

  let vertices = V;

  while (vertices > 2) {
    let i = Math.floor(Math.random() * E);

    let subset1 = find(subsets, edge[i].src);
    let subset2 = find(subsets, edge[i].dest);

    if (subset1 === subset2) {
      continue;
    } else {
      vertices--;
      Union(subsets, subset1, subset2);
    }
  }

  let cutedges = 0;
  for (let i = 0; i < E; i++) {
    let subset1 = find(subsets, edge[i].src);
    let subset2 = find(subsets, edge[i].dest);
    if (subset1 !== subset2) {
      cut.push({src: edge[i].src, dest: edge[i].dest});
      cutedges++;
    }
  }
  return {
    cutedges,
    cut,
  };
}
 
function find(subsets, i) {
    if (subsets[i].parent !== i) {
        subsets[i].parent = find(subsets, subsets[i].parent);
    }
    return subsets[i].parent;
}
 
function Union(subsets, x, y) {
    let xroot = find(subsets, x);
    let yroot = find(subsets, y);
 
    if (subsets[xroot].rank < subsets[yroot].rank) {
        subsets[xroot].parent = yroot;
    } else if (subsets[xroot].rank > subsets[yroot].rank) {
        subsets[yroot].parent = xroot;
    } else {
        subsets[yroot].parent = xroot;
        subsets[xroot].rank++;
    }
}

let E = 0;
const set = new Set();
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const split = lines[i].split(': ');
  const source = split[0];
  const destinations = split[1].split(' ');

  set.add(source);

  for (let j = 0; j < destinations.length; j++) {
    set.add(destinations[j]);
    E++;
  }
}

let mapping = {};
const array = Array.from(set);
for (let i = 0; i < array.length; i++) {
  mapping[array[i]] = i;
}

const g = {};

let V = Object.keys(mapping).length;

let graph = new Graph(V, E);
let k = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const split = lines[i].split(': ');
  const source = split[0];
  const destinations = split[1].split(' ');

  g[mapping[source]] = g[mapping[source]] || [];

  for (let j = 0; j < destinations.length; j++) {
    graph.edge[k++] = new Edge(mapping[source], mapping[destinations[j]]);
    g[mapping[source]].push(mapping[destinations[j]]);

    g[mapping[destinations[j]]] = g[mapping[destinations[j]]] || [];
    g[mapping[destinations[j]]].push(mapping[source]);
  }
}

let minCutResult = kargerMinCut(graph);
while (minCutResult.cutedges !== 3) {
  minCutResult = kargerMinCut(graph);
}

for (let i = 0; i < minCutResult.cut.length; i++) {
  const src = minCutResult.cut[i].src;
  const dest = minCutResult.cut[i].dest;

  const index = g[src].indexOf(dest);
  if (index > -1) {
    g[src].splice(index, 1);

    if (g[src].length === 0) {
      delete g[src];
    }
  }

  const index2 = g[dest].indexOf(src);
  if (index2 > -1) {
    g[dest].splice(index2, 1);

    if (g[dest].length === 0) {
      delete g[dest];
    }
  }
}

const visited = {};

function dfs(g, v, visited) {
  let count = 1;
  visited[v] = true;

  for (let i = 0; i < g[v].length; i++) {
    if (!visited[g[v][i]]) {
      count += dfs(g, g[v][i], visited);
    }
  }

  return count;
}

let result = 1;
const keys = Object.keys(g);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];

  if (visited[key]) {
    continue;
  }

  result *= dfs(g, key, visited);
}

console.log(result);

