const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

const copies = {};

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  copies[i + 1] = 1;
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }
  
  const card = lines[i].split(':')[1];
  const [winningNumbers, playingNumbers] = card.split('|');
  const winningNumbersArray = winningNumbers.split(' ').filter((n) => n !== '');
  const playingNumbersArray = playingNumbers.split(' ').filter((n) => n !== '');

  let count = 0;
  for (let j = 0; j < playingNumbersArray.length; j++) {
    if (winningNumbersArray.includes(playingNumbersArray[j])) {
      copies[i + 1 + ++count] += copies[i + 1];
    }
 }
}

console.log(Object.values(copies).reduce((acc, curr) => acc + curr, 0));
