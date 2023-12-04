const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  let current = 0;
  const card = lines[i].split(':')[1];
  const [winningNumbers, playingNumbers] = card.split('|');
  const winningNumbersArray = winningNumbers.split(' ').filter((n) => n !== '');
  const playingNumbersArray = playingNumbers.split(' ').filter((n) => n !== '');

  for (let j = 0; j < playingNumbersArray.length; j++) {
    if (winningNumbersArray.includes(playingNumbersArray[j])) {
      if (current === 0) {
        current = 1;
      } else {
        current *= 2;
      }
    }
 }

  sum += current;
}

console.log(sum);
