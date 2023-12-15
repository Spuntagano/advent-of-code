const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

function hash(str) {
  let current = 0;
  for (let i = 0; i < str.length; i++) {
    current += str.charCodeAt(i);
    current *= 17;
    current %= 256;
  }

  return current;
}

const sequences = input.replace(/\n/g, '').split(',')

let sum = 0;
for (const sequence of sequences) {
  sum += hash(sequence);
}

console.log(sum);
