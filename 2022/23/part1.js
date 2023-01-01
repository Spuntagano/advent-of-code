const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const OFFSET = 100;

let positions = new Map();
let proposedPositionsCount = new Map();

const directions = {
    N: [{x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}],
    S: [{x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}],
    W: [{x: -1, y: 1}, {x: -1, y: 0}, {x: -1, y: -1}],
    E: [{x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}],
}

input.trimEnd().split('\n').forEach((line, y) => {
    line.split('').forEach((char, x) => {
        if (char === '#') {
            positions.set(`${x + OFFSET}-${y + OFFSET}`, {
                currentPosition: {x: x + OFFSET, y: y + OFFSET},
                proposedPosition: null,
            });
        }
    });
});

const printGrid = (positions) => {
    const grid = new Array(200).fill(0).map(() => new Array(200).fill('.'));
    for (let position of positions.values()) {
        grid[position.currentPosition.y][position.currentPosition.x] = '#';
    }

    for (let row of grid) {
        console.log(row.join(''));
    }
}

for (let i = 0; i < 10; i++) {
    let directionIndex = i % 4;
    for (let position of [...positions.values()]) {
        let isAllClear = true;
        let newDirection = null;
        for (let j = directionIndex; j < directionIndex + 4; j++) {
            const direction = Object.values(directions)[j % 4];
            let isSideClear = true;
            for (let checkDirection of direction) {
                const {x, y} = checkDirection;
                const checkPositionKey = `${position.currentPosition.x + x}-${position.currentPosition.y + y}`;
                if (positions.has(checkPositionKey)) {
                    isAllClear = false;
                    isSideClear = false;
                    break;
                }
            };

            if (isSideClear && !newDirection) {
                newDirection = direction;
            }
        };

        if (isAllClear || !newDirection) {
            continue;
        }

        const proposedPositionKey = `${position.currentPosition.x + newDirection[1].x}-${position.currentPosition.y + newDirection[1].y}`;
        if (!proposedPositionsCount.has(proposedPositionKey)) {
            proposedPositionsCount.set(proposedPositionKey, 0);
        }

        proposedPositionsCount.set(proposedPositionKey, proposedPositionsCount.get(proposedPositionKey) + 1);
        position.proposedPosition = {x: position.currentPosition.x + newDirection[1].x, y: position.currentPosition.y + newDirection[1].y};
    }

    const newProposedPositionsCount = new Map();
    const newPositions = new Map();
    for (let position of [...positions.values()]) {
        const currentPositionKey = `${position.currentPosition.x}-${position.currentPosition.y}`;
        if (position.proposedPosition) {
            const proposedPositionKey = `${position.proposedPosition.x}-${position.proposedPosition.y}`;
            if (proposedPositionsCount.get(proposedPositionKey) === 1) {
                newPositions.set(proposedPositionKey, {
                    currentPosition: position.proposedPosition,
                    proposedPosition: null,
                });
            } else {
                newPositions.set(currentPositionKey, {
                    currentPosition: position.currentPosition,
                    proposedPosition: null,
                });
            }
        } else {
            newPositions.set(currentPositionKey, {
                currentPosition: position.currentPosition,
                proposedPosition: null,
            });
        }
    }

    positions = newPositions;
    proposedPositionsCount = newProposedPositionsCount
}

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
for (let position of positions.values()) {
    if (position.currentPosition.x < minX) {
        minX = position.currentPosition.x;
    }

    if (position.currentPosition.x > maxX) {
        maxX = position.currentPosition.x;
    }

    if (position.currentPosition.y < minY) {
        minY = position.currentPosition.y;
    }

    if (position.currentPosition.y > maxY) {
        maxY = position.currentPosition.y;
    }
}

console.log((maxX - minX + 1) * (maxY - minY + 1) - positions.size);
