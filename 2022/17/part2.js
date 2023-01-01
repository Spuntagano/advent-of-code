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

const getTopology = (grid, currentHeight) => {
    const topology = [];
    for (let y = 0; y < 50; y++) {
        topology.push([]);
        for (x = 0; x < grid[0].length; x++) {
            topology[y].push(false);
        }
    }

    for (let x = 0; x < grid[0].length; x++) {
        for (let y = currentHeight; y < currentHeight + topology.length; y++) {
            topology[50 - (y - currentHeight) - 1][x] = grid[y][x];
        }
    }

    return topology;
}

const printGrid = (grid, currentHeight, length) => {
    let str = '';
    for (let y = 0; y < grid.length; y++) {

        if (y < currentHeight || y > currentHeight + length) {
            continue;
        }

        for (let x = 0; x < grid[y].length; x++) {
            if (pixel = grid[y][x]) {
                str += '#';
            } else {
                str += '.';
            }
        }
        str += '\n'
    }

    console.log(str);
}

const SHAPES_COUNT = 5;
const WIND_COUNT = 10091;

const MAX_HEIGHT = 1000000;
const BLOCK_NUMBER = 1000000000000;

const BLOCK_STEP_COUNT = SHAPES_COUNT * WIND_COUNT;

const winds = input.trimEnd().split('');
const shapes = [
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 0, x: 3}],
    [{y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}, {y: 2, x: 1}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
    [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}, {y: 3, x: 0}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}],
];

const run = (grid, startHeight, blockStepCount, target) => {
    let currentHeight = startHeight;
    let currentShapeIndex = 0;
    let currentWindIndex = 0;
    for (let i = 0; i < blockStepCount; i++) {
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

                    if (i === target) {
                        return currentHeight;
                    }

                    grid[newY][newX] = true;
                }

                break;
            }

            y += 1;
        }
    }

    return currentHeight;
}

const resetGrid = (grid, topology, currentHeight) => {
    for (let y = currentHeight; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            grid[y][x] = false;
        }
    }

    for (let y = 0; y < topology.length; y++) {
        for (let x = 0; x < topology[y].length; x++) {
            grid[MAX_HEIGHT - y][x] = topology[y][x];
        }
    }

    return MAX_HEIGHT - topology.length;
}

const cache = {};
const grid = [];
for (let i = 0; i <= MAX_HEIGHT; i++) {
    let row = [false, false, false, false, false, false, false];
    grid.push(row);
}

let topology = null;
let currentHeight = MAX_HEIGHT;
for (let i = 0; i < 10; i++) {
    currentHeight = run(grid, currentHeight, BLOCK_STEP_COUNT);
    topology = getTopology(grid, currentHeight);
    currentHeight = resetGrid(grid, topology, currentHeight);
}

const target = Math.floor(1000000000000 / BLOCK_STEP_COUNT) * BLOCK_STEP_COUNT;
console.log(target);
const height = Math.floor(1000000000000 / BLOCK_STEP_COUNT) * 70637;
console.log(height);

const a = height + run(grid, currentHeight, BLOCK_STEP_COUNT, 1000000000000 - target);
console.log(a);

// let initialHeight = MAX_HEIGHT;
// let currentHeight = MAX_HEIGHT;
// let cacheKey = [0,0,0,0,0,0,0].join('-');
// let total = 0;
// for (let i = 0; i < BLOCK_STEP_COUNT * 10; i += BLOCK_STEP_COUNT) {
//     if (!cache[cacheKey]) {
//         currentHeight = run(grid, initialHeight, BLOCK_STEP_COUNT);
//         cache[cacheKey] = {
//             height: initialHeight - currentHeight,
//             topology: getTopology(grid, currentHeight),
//         };
//     }
//
//     console.log(cacheKey, cache[cacheKey].topology.join('-'), total);
//
//     total += cache[cacheKey].height;
//     cacheKey = getTopology(grid, currentHeight).join('-');
//     initialHeight = resetGrid(grid, cacheKey.split('-').map((value) => parseInt(value)), currentHeight);
//     printGrid(grid, initialHeight, 20);
// }

// const init = 152812;
// const a  = 70636;
// const b = 76403;
// const ab = a + b;
//
// const target = 1000000000000;
//
// const blockCount = Math.floor(target / (BLOCK_STEP_COUNT * 2)) * BLOCK_STEP_COUNT * 2;
// const blockHeight = init + ((blockCount / (BLOCK_STEP_COUNT * 2)) - (BLOCK_STEP_COUNT * 2)) * ab;
// console.log(blockCount);
// console.log(blockHeight);

// 1514285714288
// 1442292470302


