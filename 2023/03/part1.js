const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8')

const grid = [];

const symbols = new Set();

input.split('\n').forEach((line) => {
  if (line === '') return;
  grid.push(line.split(''));
});

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] !== '.' && parseInt(grid[i][j]).toString() === 'NaN') {
      symbols.add(grid[i][j]);
    }
  }
}

let sum = 0;
for (let i = 0; i < grid.length; i++) {
  loop: for (let j = 0; j < grid[i].length; j++) {
    let number = '';
    let start = j;
    while (parseInt(grid[i][j]).toString() !== 'NaN') {
      number += grid[i][j];
      j++;
    }
    let end = j - 1;

    if (number !== '') {
      for (let k = i - 1; k <= i + 1; k++) {
        for (let l = start - 1; l <= end + 1; l++) {
          if (k === i && l >= start && l <= end) {
            continue;
          }

          if (grid[k] && grid[k][l] && symbols.has(grid[k][l])) {
            sum += parseInt(number);
            continue loop;
          }
        }
      }
    }
  }
}

console.log(sum);

