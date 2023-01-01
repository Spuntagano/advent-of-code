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
    for (let x = 0; x < grid[0].length; x++) {
        let count = 0;
        for (let y = currentHeight; y < grid.length; y++) {
            if (grid[y][x]) {
                break;
            }

            count++;
        }

        topology.push(count + 1);
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

const run = (grid, startHeight, blockStepCount, blockHeight, initialTotalHeight) => {
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

                    if (BLOCK_NUMBER === blockHeight) {
                        console.log(initialTotalHeight + currentHeight - startHeight);
                    }

                    grid[newY][newX] = true;
                }

                break;
            }

            y += 1;
        }

        blockHeight += 1;
    }

    return currentHeight;
}

const resetGrid = (grid, topology, currentHeight) => {
    for (let y = currentHeight; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            grid[y][x] = false;
        }
    }

    const newHeight = Math.max(...topology);

    topology.map((value) => newHeight - value).forEach((value, x) => {
        for (let y = MAX_HEIGHT; y > 0; y--) {
            if (MAX_HEIGHT - y >= value) {
                break;
            }

            grid[y][x] = true;
        }
    });

    return MAX_HEIGHT - newHeight;
}

const cache = {};
const grid = [];
for (let i = 0; i <= MAX_HEIGHT; i++) {
    let row = [false, false, false, false, false, false, false];
    grid.push(row);
}

let init = 152812;
let sum = 147039;

const a = Math.floor(1000000000000 / (BLOCK_STEP_COUNT * 2));
const blockHeight = a * (BLOCK_STEP_COUNT * 2);
const totalHeight = ((a - 2) * sum) + init

console.log(blockHeight);
console.log(totalHeight);

let initialHeight = MAX_HEIGHT;
let currentHeight = MAX_HEIGHT;
let cacheKey = [2,6,4,6,7,7,7].join('-');
for (let i = 0; i < BLOCK_NUMBER; i += BLOCK_STEP_COUNT) {
    currentHeight = run(grid, initialHeight, BLOCK_STEP_COUNT, i, totalHeight);
    if (!cache[cacheKey]) {
        currentHeight = run(grid, initialHeight, BLOCK_STEP_COUNT, blockHeight, totalHeight);
        cache[cacheKey] = {
            height: initialHeight - currentHeight,
            topology: getTopology(grid, currentHeight),
        };
    }

    console.log(cacheKey, cache[cacheKey].topology.join('-'));

    // total += cache[cacheKey].height;
    cacheKey = cache[cacheKey].topology.join('-');
    initialHeight = resetGrid(grid, cacheKey.split('-').map((value) => parseInt(value)), currentHeight);
}

// init 152812
// 2-6-4-6-7-7-7 70636
// 10-10-6-6-2-2 76403
// sum 147039
