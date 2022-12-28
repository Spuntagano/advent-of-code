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

const visitedGrid = JSON.parse(JSON.stringify(grid));

const input = fs.readFileSync(FILE_NAME, 'utf8').trimEnd();
const parsed = input.split('\n').map(line => line.split(',').map(number => parseInt(number) + 1));

parsed.forEach((point) => {
    grid[point[0]][point[1]][point[2]] = true;
});

const set = new Set();
set.add([0, 0, 0].join(','));
while (set.size > 0) {
    const value = set.values().next().value;
    set.delete(value);
    const [x, y, z] = value.split(',').map(number => parseInt(number));
    visitedGrid[x][y][z] = true;
    for (const [dx, dy, dz] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        const newZ = z + dz;
        if (newX >= 0 && newX < MAX_SIZE && newY >= 0 && newY < MAX_SIZE && newZ >= 0 && newZ < MAX_SIZE) {
            if (!visitedGrid[newX][newY][newZ]) {
                if (!grid[newX][newY][newZ]) {
                    set.add([newX, newY, newZ].join(','));
                }
            }
        }
    }
}

for (i = 0; i < MAX_SIZE; i++) {
    for (j = 0; j < MAX_SIZE; j++) {
        for (k = 0; k < MAX_SIZE; k++) {
            if (!visitedGrid[i][j][k] && !grid[i][j][k]) {
                grid[i][j][k] = true;
                parsed.push([i, j, k]);
            }
        }
    }
}

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

const totalSurface = parsed.length * 6 - sharedSides;
console.log(totalSurface);
