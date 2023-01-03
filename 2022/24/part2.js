const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const lines = input.trimEnd().split('\n');

const windDirections = {
    '^': { dx: 0, dy: -1 },
    'v': { dx: 0, dy: 1 },
    '>': { dx: 1, dy: 0 },
    '<': { dx: -1, dy: 0 },
}

let grid = [];
for (let y = 0; y < lines.length; y++) {
    const line = [];
    for (let x = 0; x < lines[y].length; x++) {
        const winds = {};
        let wall = false;
        if (lines[y][x] === '.') {
            // nothing
        } else if (lines[y][x] === '#') {
            wall = true;
        } else {
            winds[lines[y][x]] = true;
        }
        line.push({ winds, wall });
    }
    grid.push(line);
}

const startPosition = {x: 1, y: 0};
const endPosition = {x: grid[0].length - 2, y: grid.length - 1};
const loopStep = (grid.length - 2) * (grid[0].length - 2);

const adjustPosition = (x, y) => {
    let newX = (x - 1) % (grid[0].length - 2);
    let newY = (y - 1) % (grid.length - 2);

    if (newX < 0) {
        newX = grid[0].length - 2 + newX;
    }

    if (newY < 0) {
        newY = grid.length - 2  + newY;
    }

    return {newX: newX + 1, newY: newY + 1};
}

const gridToString = (grid) => {
    let str = '';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let symbol = '.';
            const winds = grid[y][x].winds;
            const wall = grid[y][x].wall;
            const count = Object.keys(winds).reduce((acc, key) => {
                if (winds[key]) {
                    symbol = key;
                    return acc + winds[key];
                }

                return acc;
            }, 0);

            if (wall) {
                str += '#';
            } else if (count <= 1) {
                str += symbol;
            } else {
                str += count;
            }
        }
        str += '\n';
    }

    return str;
}

const countWinds = (grid, x, y) => {
    const winds = grid[y][x].winds;
    return Object.keys(winds).reduce((acc, key) => {
        if (winds[key]) {
            return acc + winds[key];
        }
    }, 0);
}

const cache = {};
const calculateNewGrid = (grid, stepCount) => {
    if (cache[stepCount % loopStep]) {
        return cache[stepCount % loopStep];
    }

    const newGrid = JSON.parse(JSON.stringify(grid));
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            newGrid[y][x].winds = {};
        }
    }

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const winds = grid[y][x].winds;
            for (const key of Object.keys(winds)) {
                if (winds[key]) {
                    const {dx, dy} = windDirections[key];
                    const {newX, newY} = adjustPosition(x + dx, y + dy);
                    newGrid[newY][newX].winds[key] = true;
                }
            }
        }
    }

    cache[stepCount % loopStep] = newGrid;

    return newGrid;
}

const euclidianDistance = (x1, y1, x2, y2) => {
    return {x: Math.abs(x1 - x2), y: Math.abs(y1 - y2)};
}

for (let i = 0; i < loopStep; i++) {
    grid = calculateNewGrid(grid, i);
}

const bestGrid = [];
for (let y = 0; y < grid.length; y++) {
    bestGrid[y] = [];
    for (let x = 0; x < grid[y].length; x++) {
        bestGrid[y][x] = {};
        for (let i = 0; i < loopStep; i++) {
            bestGrid[y][x][i] = Infinity;
        }
    }
}

const queue = [{
    x: startPosition.x,
    y: startPosition.y,
    stepCount: 0,
}];

let bestStepCount = Infinity;
while (queue.length > 0) {
    const state = queue.shift();
    if (state.x === endPosition.x && state.y === endPosition.y) {
        if (state.stepCount < bestStepCount) {
            bestStepCount = state.stepCount;
        }
        continue;
    }

    grid = calculateNewGrid(null, state.stepCount);

    for ({dx, dy} of Object.values(windDirections)) {
        if (state.x + dx > 0 &&
            state.x + dx < grid[0].length &&
            state.y + dy > 0 &&
            state.y + dy < grid.length &&
            !grid[state.y + dy][state.x + dx].wall &&
            countWinds(grid, state.x + dx, state.y + dy) === 0)
        {
            if (bestGrid[state.y + dy][state.x + dx][state.stepCount % loopStep] > state.stepCount) {
                bestGrid[state.y + dy][state.x + dx][state.stepCount % loopStep] = state.stepCount
                queue.push({
                    x: state.x + dx,
                    y: state.y + dy,
                    stepCount: state.stepCount + 1,
                });
            }
        }
    }

    if (countWinds(grid, state.x, state.y) === 0) {
        if (bestGrid[state.y][state.x][state.stepCount % loopStep] > state.stepCount) {
            bestGrid[state.y][state.x][state.stepCount % loopStep] = state.stepCount
            queue.push({
                x: state.x,
                y: state.y,
                stepCount: state.stepCount + 1,
            });
        }
    }
}

console.log(bestStepCount);

