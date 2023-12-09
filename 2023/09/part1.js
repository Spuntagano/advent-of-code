const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

let count = 0;
for (const line of lines) {
  if (line === '') {
    continue;
  }

  const tree = [line.split(' ').map((x) => parseInt(x))];

  while (!tree[tree.length - 1].every((x) => x === 0)) {
    const next = [];
    for (let i = 0; i < tree[tree.length - 1].length - 1; i++) {
      next.push(tree[tree.length - 1][i + 1] - tree[tree.length - 1][i]);
    }

    tree.push(next);
  }

  tree[tree.length - 1].push(0);
  tree[tree.length - 2].push(tree[tree.length - 2][tree[tree.length - 2].length - 1]);
  for (let i = tree.length - 3; i >= 0; i--) {
    const next = tree[i][tree[i].length - 1] + tree[i + 1][tree[i].length - 1];
    tree[i].push(next);
  }

  count += tree[0][tree[0].length - 1];
}

console.log(count);
