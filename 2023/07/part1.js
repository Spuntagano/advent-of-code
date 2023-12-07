const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

const mapping = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  'T': 8,
  'J': 9,
  'Q': 10,
  'K': 11,
  'A': 12
}

const hands = [];

for (const line of lines) {
  if (line === '') {
    continue;
  }

  const splitLine = line.split(' ');
  const hand = splitLine[0];
  const bid = splitLine[1];

  const map = {};
  for (const card of hand) {
    map[[mapping[card]]] = map[[mapping[card]]] || 0;
    map[[mapping[card]]]++;
  }

  const mappedHand = hand.split('')
    .map(card => mapping[card])
    .map(card => parseInt(card))

  const topRepeatingCardCount = Math.max(...Object.values(map));
  const countOfDifferentCards = Object.keys(map);

  let rank;
  if (topRepeatingCardCount === 5) {
    rank = 6
  } else if (topRepeatingCardCount === 4) {
    rank = 5
  } else if (topRepeatingCardCount === 3) {
    if (countOfDifferentCards.length === 2) {
      rank = 4;
    } else {
      rank = 3;
    }
  } else if (topRepeatingCardCount === 2) {
    if (countOfDifferentCards.length === 3) {
      rank = 2;
    } else {
      rank = 1;
    }
  } else if (topRepeatingCardCount === 1) {
    rank = 0;
  }

  hands.push({
    rank,
    mappedHand,
    bid
  });
}

hands.sort((a, b) => a.mappedHand[4] - b.mappedHand[4]);
hands.sort((a, b) => a.mappedHand[3] - b.mappedHand[3]);
hands.sort((a, b) => a.mappedHand[2] - b.mappedHand[2]);
hands.sort((a, b) => a.mappedHand[1] - b.mappedHand[1]);
hands.sort((a, b) => a.mappedHand[0] - b.mappedHand[0]);
hands.sort((a, b) => a.rank - b.rank);

const totalWinnings = Object.values(hands).reduce((acc, hand, index) => {
    acc += hand.bid * (index + 1);
    return acc;
}, 0);

console.log(totalWinnings);
