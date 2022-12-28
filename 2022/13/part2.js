const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

let lines = input.split('\n').map((line) => {
    return eval(line);
});

lines = lines.filter((line) => {
    return !!line
});

const parse = (pair1, pair2) => {
    const longest = pair1.length > pair2.length ? pair1.length : pair2.length;
    for (let i = 0; i < longest; i++) {
        if (typeof pair1[i] === 'undefined') {
            return true;
        }

        if (typeof pair2[i] === 'undefined') {
            return false;
        }

        if (typeof pair1[i] === 'number' && typeof pair2[i] === 'number') {
            if (pair1[i] > pair2[i]) {
                return false;
            } else if (pair1[i] < pair2[i]) {
                return true;
            }
        }

        if (typeof pair1[i] === 'number' && pair2[i] instanceof Array) {
            const res = parse([pair1[i]], pair2[i]);
            if (res !== undefined) {
                return res;
            }
        }

        if (pair1[i] instanceof Array && typeof pair2[i] === 'number') {
            const res = parse(pair1[i], [pair2[i]]);
            if (res !== undefined) {
                return res;
            }
        }

        if (pair1[i] instanceof Array && pair2[i] instanceof Array) {
            const res = parse(pair1[i], pair2[i]);
            if (res !== undefined) {
                return res;
            }
        }
    }

    return undefined;
}

lines.push([[2]]);
lines.push([[6]]);

lines.sort((line1, line2) => {
    const valid = parse(line1, line2);
    if (valid === true) {
        return -1;
    } else if (valid === false) {
        return 1;
    } else {
        return 0;
    }
});

lines = lines.map((line) => {
    return JSON.stringify(line);
});

console.log((lines.indexOf(JSON.stringify([[2]])) + 1) * (lines.indexOf(JSON.stringify([[6]])) + 1));

