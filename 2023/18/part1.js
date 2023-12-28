const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

let maxH = 0;
let minH = 0;
let maxW = 0;
let minW = 0;

let currentW = 0;
let currentH = 0;

const directions = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1]
};

const instructions = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const infos = lines[i].split(' ');
  const direction = infos[0];
  const length = parseInt(infos[1]);
  const rgbCode = infos[2].slice(2, infos[2].length - 1);

  instructions.push({
    direction,
    length,
    rgbCode
  });

  switch (direction) {
    case 'U':
      currentH -= length

      if (currentH < minH) {
        minH = currentH;
      }

      break;
    case 'D':
      currentH += length;
      
      if (currentH > maxH) {
        maxH = currentH;
      }

      break;
    case 'L':
      currentW -= length;

      if (currentW < minW) {
        minW = currentW;
      }

      break;
    case 'R':
      currentW += length;

      if (currentW > maxW) {
        maxW = currentW;
      }

      break;
  }
}

const width = maxW - minW;
const height = maxH - minH;

const map = [];
for (let i = 0; i <= height; i++) {

  const row = [];
  for (let j = 0; j <= width; j++) {
    row.push(false);
  }

  map.push(row);
}

let currentX = Math.abs(minW);
let currentY = Math.abs(minH);

let result = 0;
for (let i = 0; i < instructions.length; i++) {
  for (let j = 0; j < instructions[i].length; j++) {
    switch (instructions[i].direction) {
      case 'U':
        currentY -= 1;
        break;
      case 'D':
        currentY += 1;
        break;
      case 'L':
        currentX -= 1;
        break;
      case 'R':
        currentX += 1;
        break;
    }

    result += 1;
    map[currentY][currentX] = true;
  }
}

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (!map[i][j]) {
      const count = { value: 0 };
      const isOutside = { value: false };
      const queue = [];
      queue.push({ x: j, y: i });

      while (queue.length > 0) {
        const { x, y } = queue.shift();

        if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
          isOutside.value = true;
          continue;
        }

        if (map[y][x]) {
          continue;
        }

        map[y][x] = true;
        count.value += 1;

        queue.push({ x: x - 1, y });
        queue.push({ x: x + 1, y });
        queue.push({ x, y: y - 1 });
        queue.push({ x, y: y + 1 });
      }

      if (!isOutside.value) {
        result += count.value;
      }
    }
  }
}

console.log(result);

