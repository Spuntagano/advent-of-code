const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

const times = lines[0].split(' ')
  .filter((time, index) => time !== '' && index !== 0)
  .map((time) => parseInt(time));

const distances = lines[1].split(' ')
  .filter((distance, index) => distance !== '' && index !== 0)
  .map((distance) => parseInt(distance));

let total = 1;
for (let i = 0; i < times.length; i++) {
  let start;
  let end;
  for (let j = 0; j < times[i]; j++) {
    if ((times[i] - j) * j > distances[i]) {
      start = j;
      break;
    }
  }

  for (let j = times[i]; j >= 0; j--) {
    if ((times[i] - j) * j > distances[i]) {
      end = j;
      break;
    }
  }

  total *= end - start + 1;
}

console.log(total);
