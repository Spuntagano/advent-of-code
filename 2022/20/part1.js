const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const values = input.trimEnd().split('\n').map((value, index) => ({ index, value: eval(value) }));

const calculateTarget = (index, toMove, shift) => {
    let target = index + toMove;

    if (toMove > 0 && shift) {
        target++;
    }

    if (target >= values.length) {
        target -= values.length;
    }

    if (target <= 0) {
        target = values.length + target;
    }

    return target;
}

for (i = 0; i < values.length; i++) {
    const index = values.findIndex((value) => value.index === i);

    const toMove = values[index].value % (values.length - 1);
    let target = calculateTarget(index, toMove, true);

    const clone = values[index];
    values[index] = null;
    values.splice(target, 0, clone);
    const toRemove = values.findIndex((value) => value === null);
    values.splice(toRemove, 1);
}

const zeroIndex = values.findIndex((value) => value.value === 0);

const results = [];
results.push(values[calculateTarget(zeroIndex, 1000 % values.length, false)]);
results.push(values[calculateTarget(zeroIndex, 2000 % values.length, false)]);
results.push(values[calculateTarget(zeroIndex, 3000 % values.length, false)]);
console.log(results.reduce((acc, value) => {
    return acc + value.value;
}, 0));

