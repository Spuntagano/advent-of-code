const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const blocks = input.split('\n\n');

const seeds = [];
const map = [];

function splitIntersections(seeds, ranges) {
  const values = [];

  for (const seed of seeds) {
    values.push({
      value: seed.start,
      type: 'seedStart',
      seed,
      isSeed: true,
    });

    values.push({
      value: seed.end,
      type: 'seedEnd',
      seed,
      isSeed: true,
    });
  }

  for (const range of ranges) {
    values.push({
      value: range.sourceStart,
      type: 'rangeStart',
      range,
      isSeed: false,
    });

    values.push({
      value: range.sourceEnd,
      type: 'rangeEnd',
      range,
      isSeed: false,
    });
  }

  values.sort((a, b) => a.value - b.value);

  let start;
  let range;
  const intersections = [];

  for (const value of values) {
    if (value.type === 'rangeStart') {
      if (start !== undefined) {
        if (start !== value.value) {
          intersections.push({start, end: value.value});
        }

        start = value.range.destinationStart;
      }

      range = value.range;
    }

    if (value.type === 'rangeEnd') {
      if (start !== undefined) {
        intersections.push({start, end: value.range.destinationEnd});
        start = value.value + 1;
      }

      range = undefined;
    }

    if (value.type === 'seedStart') {
      if (range !== undefined) {
        start = value.value - range.sourceStart + range.destinationStart;
      } else {
        start = value.value;
      }
    }

    if (value.type === 'seedEnd') {
      if (range !== undefined) {
        intersections.push({start, end: value.value - range.sourceStart + range.destinationStart});
      } else {
        intersections.push({start, end: value.value});
      }

      start = undefined;
    }
  }

  return intersections;
}

for (const block of blocks) {
  let [title, data] = block.split(':').map(x => x.trim());

  switch (title) {
    case 'seeds':
      const seedIds = data.split(' ').map(Number);
      for (let i = 0; i < seedIds.length; i += 2) {
        seeds.push({start: seedIds[i], end: seedIds[i] + seedIds[i + 1] - 1});
      }
      break;
    default:
      const ranges = [];
      const lines = data.split('\n');
      for (const line of lines) {
        const [destination, source, range] = line.split(' ').map(Number);
        ranges.push({
          sourceStart: source,
          sourceEnd: source + range - 1, 
          destinationStart: destination, 
          destinationEnd: destination + range - 1,
        });
      }

      ranges.sort((a, b) => a.sourceStart - b.sourceStart);

      map.push(ranges);
      break;
  }
}

seeds.sort((a, b) => a.start - b.start);

let current = seeds;
for (const ranges of map) {
  current = splitIntersections(current, ranges);
}

current.sort((a, b) => a.start - b.start);

console.log(current[0].start);

