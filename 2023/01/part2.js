const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

function addToTrie(trie, word, value) {
  if (word.length === 0) {
    trie.value = value;
    return;
  }

  if (!trie[word[0]]) {
    trie[word[0]] = {};
  }

  addToTrie(trie[word[0]], word.slice(1), value);
}

const table = {
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
};

const tableReverse = {
  'orez': '0',
  'eno': '1',
  'owt': '2',
  'eerht': '3',
  'ruof': '4',
  'evif': '5',
  'xis': '6',
  'neves': '7',
  'thgie': '8',
  'enin': '9',
};

const trie = {};
const trieReverse = {};

for (let key in table) {
  addToTrie(trie, key, table[key]);
}

for (let key in tableReverse) {
  addToTrie(trieReverse, key, tableReverse[key]);
}

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].length === 0) {
    continue;
  }

  let currentLine = '';
  loop: for (let j = 0; j < lines[i].length; j++) {
    if (parseInt(lines[i][j]).toString() !== 'NaN') {
      currentLine += lines[i][j];
      break;
    }

    let current = trie;
    const start = j;
    while (current[lines[i][j]]) {
      current = current[lines[i][j]];
      j++;

      if (current.value !== undefined) {
        currentLine += current.value;
        break loop;
      }
    }

    j = start;
  }

  loop: for (let j = lines[i].length - 1; j >= 0; j--) {
    if (parseInt(lines[i][j]).toString() !== 'NaN') {
      currentLine += lines[i][j];
      break;
    }

    let current = trieReverse;
    const start = j;
    while (current[lines[i][j]]) {
      current = current[lines[i][j]];
      j--;

      if (current.value !== undefined) {
        currentLine += current.value;
        break loop;
      }
    }

    j = start;
  }

  sum += parseInt(currentLine);
}

console.log(sum);
