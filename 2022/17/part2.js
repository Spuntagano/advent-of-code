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
        str += (MAX_HEIGHT - y);
        str += '\n'
    }

    console.log(str);
}

const MAX_HEIGHT = 1000000;
const BLOCK_NUMBER = 1000000000000;

const winds = input.trimEnd().split('');
const shapes = [
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 0, x: 3}],
    [{y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}, {y: 2, x: 1}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
    [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}, {y: 3, x: 0}],
    [{y: 0, x: 0}, {y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}],
];

const BLOCK_STEP_COUNT = shapes.length;

const run = (grid, startHeight, blockStepCount, target, initWindIndex) => {
    let currentHeight = startHeight;
    let currentShapeIndex = 0;
    let currentWindIndex = initWindIndex || 0;
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

const grid = [];
for (let i = 0; i <= MAX_HEIGHT; i++) {
    let row = [false, false, false, false, false, false, false];
    grid.push(row);
}

// 1233
// 544
// 491
// 438
// 385
// 332
// 279
// 226
// 173
// 120
// 67

// 53

// 5 * 22 = 172
// 5 * 15 = 119
// 5 * 8 = 66

// 5 * 8 66

// 5 * 7 53
if (FILE_NAME === 'test.txt') {
    let currentHeight = MAX_HEIGHT;
    currentHeight = run(grid, currentHeight, BLOCK_STEP_COUNT * 8 );

    let initHeight = 66;
    let initBlock = 40;
    let step = 53;
    let blockStep = 35

    let blockCount = (Math.floor((BLOCK_NUMBER- initBlock) / blockStep) * blockStep);
    let height = (blockCount / blockStep * step) + initHeight;
    blockCount += initBlock;

    let initialHeight = currentHeight;
    currentHeight = run(grid, currentHeight, 100000, BLOCK_NUMBER - blockCount, 21);
    console.log(height + initialHeight - currentHeight - 1);
} else {

    // 5962 - 760
    // 3260 - 415
    // 558 - 70

    // 2702
    // 345

    let currentHeight = MAX_HEIGHT;
    currentHeight = run(grid, currentHeight, BLOCK_STEP_COUNT * 70 );

    let initHeight = 558;
    let initBlock = 350;
    let step = 2702;
    let blockStep = 1725;

    let blockCount = (Math.floor((BLOCK_NUMBER- initBlock) / blockStep) * blockStep);
    let height = (blockCount / blockStep * step) + initHeight;
    blockCount += initBlock;

    let initialHeight = currentHeight;
    currentHeight = run(grid, currentHeight, 100000, BLOCK_NUMBER - blockCount, 2035);
    console.log(height + initialHeight - currentHeight - 1);
}

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
