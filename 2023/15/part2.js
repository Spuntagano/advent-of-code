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

const table = {};

const sequences = input.replace(/\n/g, '').split(',')

for (const sequence of sequences) {
  if (sequence.split('').includes('=')) {
    const [label, length] = sequence.split('=');
    const hashValue = hash(label);

    table[hashValue] = table[hashValue] || [];

    let index = -1;
    for (let i = 0; i < table[hashValue].length; i++) {
      if (table[hashValue][i].label === label) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      table[hashValue].push({
        label,
        length: parseInt(length)
      });
    } else {
      table[hashValue][index] = {
        label,
        length: parseInt(length),
      };
    }
  } else {
    const label = sequence.split('-')[0];
    const hashValue = hash(label);

    table[hashValue] = table[hashValue] || [];
    table[hashValue] = table[hashValue].filter((item) => item.label !== label);
  }
}

let result = 0;
const keys = Object.keys(table).map((key) => parseInt(key));
for (const key of keys) {
  for (let i = 0; i < table[key].length; i++) {
    result += (key + 1) * (i + 1) * table[key][i].length;
  }
}

console.log(result);
