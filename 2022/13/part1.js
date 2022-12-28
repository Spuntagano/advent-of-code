const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const pairs = input.split('\n\n').map((block) => {
    const line = block.split('\n');
    return [eval(line[0]), eval(line[1])];
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

let sum = 0;
pairs.forEach((pair, index) => {
    const valid = parse(pair[0], pair[1]);
    if (valid === true) {
        sum += index + 1;
    }
})

console.log(sum);

