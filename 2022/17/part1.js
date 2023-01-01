const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const isShapeInbound = (grid, shape, x, y) => {
    for (pixel of shape) {
        const newX = x + pixel.x;
        const newY = y - pixel.y;

        if (newX < 0 || newY < 0 || newX >= grid[0].length || newY >= grid.length) {
            return false;
        }
    }

    return true;
}

const isShapeOverlap = (grid, shape, x, y) => {
    for (pixel of shape) {
        const newX = x + pixel.x;
        const newY = y - pixel.y;

        if (grid[newY][newX]) {
            return true;
        }
    }

    return false;
}

const printGrid = (grid) => {
    let str = '';
    for (row of grid) {
        for (pixel of row) {
            if (pixel) {
                str += '#';
            } else {
                str += '.';
            }
        }
        str += '\n'
    }

    console.log(str);
}

const MAX_HEIGHT = 10000;
const BLOCK_NUMBER = 2022;
let currentHeight = MAX_HEIGHT;
const winds = input.trimEnd().split('');
const shapes = [
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 0, x: 3}],
    [{y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}, {y: 2, x: 1}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
    [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}, {y: 3, x: 0}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}],
];

const grid = [];
for (let i = 0; i <= MAX_HEIGHT; i++) {
    let row = [false, false, false, false, false, false, false];
    grid.push(row);
}

let currentShapeIndex = 0;
let currentWindIndex = 0;
for (let i = 0; i < BLOCK_NUMBER; i++) {
    let x = 2;
    let y = currentHeight - 3;

    let currentShape = shapes[currentShapeIndex];
    currentShapeIndex += 1;
    if (currentShapeIndex >= shapes.length) {
        currentShapeIndex = 0;
    }

    while(true) {
        const currentWind = winds[currentWindIndex] === '<' ? -1 : 1;

        currentWindIndex += 1;
        if (currentWindIndex >= winds.length) {
            currentWindIndex = 0;
        }

        if (isShapeInbound(grid, currentShape, x + currentWind, y) && !isShapeOverlap(grid, currentShape, x + currentWind, y)) {
            x += currentWind;
        }

        if (!isShapeInbound(grid, currentShape, x, y + 1) || isShapeOverlap(grid, currentShape, x, y + 1)) {
            for (pixel of currentShape) {
                const newY = y - pixel.y;
                const newX = x + pixel.x;

                if (newY - 1 < currentHeight) {
                    currentHeight = newY - 1;
                }

                grid[newY][newX] = true;
            }

            break;
        }

        y += 1;
    }
}

// printGrid(grid);

console.log(MAX_HEIGHT - currentHeight);
