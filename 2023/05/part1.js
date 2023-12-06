const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const blocks = input.split('\n\n');

const seeds = [];
const map = [];

for (const block of blocks) {
  let [title, data] = block.split(':').map(x => x.trim());

  switch (title) {
    case 'seeds':
      data.split(' ').map(Number).forEach(x => seeds.push(x));
      break;
    default:
      const ranges = [];
      const lines = data.split('\n');
      for (const line of lines) {
        const [destination, source, range] = line.split(' ').map(Number);
        ranges.push({
          destinationStart: destination, 
          destinationEnd: destination + range - 1,
          sourceStart: source,
          sourceEnd: source + range - 1,
        });
      }

      map.push(ranges);
      break;
  }
}

const results = [];
for (const seed of seeds) {
  let result = seed;
  for (const ranges of map) {
    for (const range of ranges) {
      if (result >= range.sourceStart && result <= range.sourceEnd) {
        result = range.destinationStart + (result - range.sourceStart);
        break;
      }
    }
  }

  results.push(result);
}

console.log(Math.min(...results));
