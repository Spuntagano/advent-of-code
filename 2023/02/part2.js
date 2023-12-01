const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const games = input.split('\n');

let count = 0;

for (let i = 0; i < games.length; i++) {
  if (games[i].length === 0) {
    continue;
  }

  const set = games[i].split(':')[1];
  const content = set.split(';');

  const minMap = {
    red: 0,
    green: 0,
    blue: 0,
  }

  for (let j = 0; j < content.length; j++) {
    const color = content[j].split(',');
    const map = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (let k = 0; k < color.length; k++) {
      const info = color[k].split(' ');
      map[info[2]] += parseInt(info[1]);
    }

    if (map.red > minMap.red) {
      minMap.red = map.red;
    }

    if (map.green > minMap.green) {
      minMap.green = map.green;
    }

    if (map.blue > minMap.blue) {
      minMap.blue = map.blue;
    }
  }

  count += minMap.red * minMap.green * minMap.blue;
}

console.log(count);

