const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

const time = parseInt(lines[0].split(':')[1].replace(/ /g, ''));
const distance = parseInt(lines[1].split(':')[1].replace(/ /g, ''));

let start;
let end;
for (let i = 0; i < time; i++) {
  if ((time - i) * i > distance) {
    start = i;
    break;
  }
}

for (let i = time; i >= 0; i--) {
  if ((time - i) * i > distance) {
    end = i;
    break;
  }
}

total = end - start + 1;

console.log(total);
