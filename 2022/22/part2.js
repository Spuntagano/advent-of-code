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

const HEIGHT = map.length;
const WIDTH = map.reduce((acc, row) => Math.max(acc, row.length), 0);

const SQUARE_PER_LINE = HEIGHT > WIDTH ? 3 : 4;
const SQUARE_PER_COLUMN = HEIGHT > WIDTH ? 4 : 3;

const getZone = (x, y) => {
    const xZone = Math.floor(x / ((WIDTH / SQUARE_PER_LINE)));
    const yZone = Math.floor(y / ((HEIGHT / SQUARE_PER_COLUMN)));

    return { x: xZone, y: yZone };
}

const getZoneZeroCoordinates = (xZone, yZone) => {
    const x = xZone * (Math.floor(WIDTH / SQUARE_PER_LINE));
    const y = yZone * (Math.floor(HEIGHT / SQUARE_PER_COLUMN));

    return { x, y };
}

const invertXY = (x, y) => {
    return { x: y, y: x };
}

const invertSideX = (x, y) => {
    return { x: Math.floor(WIDTH / SQUARE_PER_LINE) - x - 1, y };
}

const invertSideY = (x, y) => {
    return { x, y: Math.floor(HEIGHT / SQUARE_PER_COLUMN) - y - 1 };
}

let mapping = {
    0: {
        2: {
            N: { newDirection: 'E', transformations: [invertXY], newZone: { x: 1, y: 1 } },
            W: { newDirection: 'E', transformations: [invertSideY], newZone: { x: 1, y: 0 } },
        },
        3: {
            S: { newDirection: 'S', transformations: [invertSideY], newZone: { x: 2, y: 0 } },
            E: { newDirection: 'N', transformations: [invertXY], newZone: { x: 1, y: 2 } },
            W: { newDirection: 'S', transformations: [invertXY], newZone: { x: 1, y: 0 } },
        }
    },
    1: {
        0: {
            W: { newDirection: 'E', transformations: [invertSideY], newZone: { x: 0, y: 2 } },
            N: { newDirection: 'E', transformations: [invertXY], newZone: { x: 0, y: 3 } },
        },
        1: {
            E: { newDirection: 'N', transformations: [invertXY], newZone: { x: 2, y: 0 } },
            W: { newDirection: 'S', transformations: [invertXY], newZone: { x: 0, y: 2 } },
        },
        2: {
            S: { newDirection: 'W', transformations: [invertXY], newZone: { x: 0, y: 3 } },
            E: { newDirection: 'W', transformations: [invertSideY], newZone: { x: 2, y: 0 } },
        },
    },
    2: {
        0: {
            S: { newDirection: 'W', transformations: [invertXY], newZone: { x: 1, y: 1 } },
            N: { newDirection: 'N', transformations: [invertSideY], newZone: { x: 0, y: 3 } },
            E: { newDirection: 'W', transformations: [invertSideY], newZone: { x: 1, y: 2 } },
        }
    },
}

if (FILE_NAME === 'test.txt') {
    mapping = {
        0: {
            1: {
                N: { newDirection: 'S', transformations: [invertSideX], newZone: { x: 2, y: 0 } },
                S: { newDirection: 'N', transformations: [invertSideX], newZone: { x: 2, y: 2 } },
                W: { newDirection: 'N', transformations: [invertXY, invertSideY, invertSideX], newZone: { x: 3, y: 2 } },
            }
        },
        1: {
            1: {
                N: { newDirection: 'E', transformations: [invertXY], newZone: { x: 2, y: 0 } },
                S: { newDirection: 'E', transformations: [invertXY, invertSideY, invertSideX], newZone: { x: 2, y: 2 } },
            }
        },
        2: {
            0: {
                N: { newDirection: 'S', transformations: [invertSideX], newZone: { x: 0, y: 1 } },
                E: { newDirection: 'W', transformations: [invertSideY], newZone: { x: 3, y: 2 } },
                W: { newDirection: 'N', transformations: [invertXY], newZone: { x: 1, y: 1 } },
            },
            1: {
                E: { newZone: { x: 3, y: 2 }, newDirection: 'S',transformations: [invertXY, invertSideX, invertSideY] }
            },
            2: {
                S: { newZone: { x: 0, y: 1 }, newDirection: 'N', transformations: [invertSideX] },
                W: { newZone: { x: 1, y: 1 }, newDirection: 'N', transformations: [invertXY, invertSideX, invertSideY] }
            }
        },
        3: {
            2: {
                N: { newDirection: 'W', transformations: [invertXY, invertSideX, invertSideY], newZone: { x: 2, y: 1 } },
                E: { newDirection: 'W', transformations: [invertSideY], newZone: { x: 2, y: 0 } },
                S: { newDirection: 'E', transformations: [invertXY, invertSideX, invertSideY], newZone: { x: 0, y: 1 } },
            }
        }
    }
}

const printMap = (map) => {
    map.forEach((row) => {
        console.log(row.join(''));
    });
}

const getNextPosition = (x, y, direction) => {
    const diff = directions[direction];
    let newY = y + diff.y;
    let newX = x + diff.x;
    let newDirection = direction;

    let char;
    if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[newY].length) {
        char = ' ';
    } else {
        char = map[newY][newX];
    }

    if (char === ' ') {
        const pos = warp(x, y, direction);
        newY = pos.y;
        newX = pos.x;
        newDirection = pos.direction;
    }

    return { x: newX, y: newY, direction: newDirection };
}

const warp = (x, y, direction) => {
    const zone = getZone(x, y);
    const zoneZeroCoordinates = getZoneZeroCoordinates(zone.x, zone.y);
    let dx = x - zoneZeroCoordinates.x;
    let dy = y - zoneZeroCoordinates.y;

    const { newDirection, transformations, newZone } = mapping[zone.x][zone.y][direction];
    const newZoneZeroCoordinates = getZoneZeroCoordinates(newZone.x, newZone.y);
    for (let transformation of transformations) {
        const { x: newDx, y: newDy } = transformation(dx, dy);
        dx = newDx;
        dy = newDy;
    }

    const newX = newZoneZeroCoordinates.x + dx;
    const newY = newZoneZeroCoordinates.y + dy;

    return { x: newX, y: newY, direction: newDirection };
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
        const {x, y, direction} = getNextPosition(position.x, position.y, position.direction);
        if (map[y][x] === '#') {
            break;
        }

        position.x = x;
        position.y = y;
        position.direction = direction;
    }

    if (rotation) {
        position.direction = directions[position.direction][rotation];
    }

    lengthIndex++;
    rotationIndex++;
}

// printMap(map);
console.log((position.y + 1) * 1000 + (position.x + 1) * 4 + directions[position.direction].value);
