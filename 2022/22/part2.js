const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const blocks = input.split('\n\n');

const map = [];
blocks[0].split('\n').forEach((line, y) => {
    map.push([]);
    line.split('').forEach((char) => {
        map[y].push(char);
    });
});

const pathLengths = blocks[1].trimEnd().split(/[A-Z]/g).map((x) => parseInt(x));
const pathRotation = blocks[1].trimEnd().split(/[0-9]/g).filter((x) => x);

const directions = {
    'N': { x: 0, y: -1, L: 'W', R: 'E', O: 'S', value: 3, char: '^' },
    'E': { x: 1, y: 0, L: 'N', R: 'S', O: 'W', value: 0, char: '>' },
    'S': { x: 0, y: 1, L: 'E', R: 'W', O: 'N', value: 1, char: 'v' },
    'W': { x: -1, y: 0, L: 'S', R: 'N', O: 'E', value: 2, char: '<' },
}

const printMap = (map) => {
    map.forEach((row) => {
        console.log(row.join(''));
    });
}

const getNextPosition = (x, y, direction, disableWarp) => {
    const diff = directions[direction];
    let newY = y + diff.y;
    let newX = x + diff.x;

    let char;
    if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[newY].length) {
        char = ' ';
    } else {
        char = map[newY][newX];
    }

    if (char === ' ') {
        if (!disableWarp) {
            const pos = warp(newX, newY, direction, true);
            newY = pos.y;
            newX = pos.x;
        } else {
            return char;
        }
    }

    return { x: newX, y: newY };
}

const warp = (x, y, direction) => {
    const diff = directions[directions[direction].O];
    let newY = y;
    let newX = x;

    while (getNextPosition(newX, newY, directions[direction].O, true) !== ' ') {
        newY = newY + diff.y;
        newX = newX + diff.x;
    }

    return { x: newX, y: newY };
}

let lengthIndex = 0;
let rotationIndex = 0;

let position = { x: 0, y: 0, direction: 'E' };
while (map[position.y][position.x] !== '.') {
    position.x++;
}

while (lengthIndex < pathLengths.length) {
    const length = pathLengths[lengthIndex];
    const rotation = pathRotation[rotationIndex];

    for (let i = 0; i < length; i++) {
        map[position.y][position.x] = directions[position.direction].char;
        const {x, y} = getNextPosition(position.x, position.y, position.direction);
        if (map[y][x] === '#') {
            break;
        } else if (map[y][x] === ' ') {
            const pos = warp(x, y, position.direction);
            position.x = pos.x;
            position.y = pos.y;
        } else {
            position.x = x;
            position.y = y;
        }
    }

    if (rotation) {
        position.direction = directions[position.direction][rotation];
    }

    lengthIndex++;
    rotationIndex++;
}

// printMap(map);
console.log((position.y + 1) * 1000 + (position.x + 1) * 4 + directions[position.direction].value);
