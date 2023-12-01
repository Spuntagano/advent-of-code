const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const games = input.split('\n');


const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

let count = 0;

gameLoop: for (let i = 0; i < games.length; i++) {
  if (games[i].length === 0) {
    continue;
  }

  const set = games[i].split(':')[1];
  const content = set.split(';');
  for (let j = 0; j < content.length; j++) {
    const map = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const color = content[j].split(',');
    for (let k = 0; k < color.length; k++) {
      const info = color[k].split(' ');
      map[info[2]] += parseInt(info[1]);
    }

    if (map.red > maxRed || map.green > maxGreen || map.blue > maxBlue) {
      continue gameLoop;
    }
  }

  count += i + 1;
}

console.log(count);

