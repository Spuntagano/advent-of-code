const fs = require('fs');

const MAX_SIZE = 25;
const FILE_NAME = process.argv[2] || 'input.txt';

const directions = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
]

const grid = [];
for (i = 0; i < MAX_SIZE; i++) {
    grid.push([]);
    for (j = 0; j < MAX_SIZE; j++) {
        grid[i].push([]);
        for (k = 0; k < MAX_SIZE; k++) {
            grid[i][j].push(false);
        }
    }
}

const input = fs.readFileSync(FILE_NAME, 'utf8').trimEnd();
const parsed = input.split('\n').map(line => line.split(',').map(number => parseInt(number) + 1));

parsed.forEach((point) => {
    grid[point[0]][point[1]][point[2]] = true;
});

let sharedSides = 0;
parsed.forEach((point) => {
    directions.forEach((direction) => {
        let x = point[0] + direction[0];
        let y = point[1] + direction[1];
        let z = point[2] + direction[2];
        if (grid[x][y][z]) {
            sharedSides++;
        }
    });
});

console.log(parsed.length * 6 - sharedSides);
