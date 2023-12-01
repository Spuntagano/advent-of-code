const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].length === 0) {
    continue;
  }

  let currentLine = '';
  for (let j = 0; j < lines[i].length; j++) {
    if (parseInt(lines[i][j]).toString() !== 'NaN') {
      currentLine += lines[i][j];
      break;
    }
  }

  for (let j = lines[i].length - 1; j >= 0; j--) {
    if (parseInt(lines[i][j]).toString() !== 'NaN') {
      currentLine += lines[i][j];
      break;
    }
  }

  sum += parseInt(currentLine);
}

console.log(sum);
