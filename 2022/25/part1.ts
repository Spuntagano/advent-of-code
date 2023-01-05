const FILE_NAME = Deno.args[0] || 'input.txt';

const input = await Deno.readTextFile(FILE_NAME);

const lines = input.trimEnd().split('\n');


const snafuToBase10Map = {
    '2': 2,
    '1': 1,
    '0': 0,
    '-': -1,
    '=': -2,
}

const base10ToSnafuMap = {
    2: '2',
    1: '1',
    0: '0',
    [-1]: '-',
    [-2]: '=',
}

let sum = 0;
for (let line of lines) {
    sum += snafuToBase10(line);
}

console.log(base10ToSnafu(sum));

function snafuToBase10(snafu: String) {
    let sum = 0;
    for (let i = 0; i < snafu.length; i++) {
        sum += snafuToBase10Map[snafu[i]] * Math.pow(5, snafu.length - i - 1);
    }
    return sum;
}

function base10ToSnafu(num: number) {
    let str = '';
    const base = 5;
    const pow = 100;
    for (let i = pow; i >= 0; i--) {
        if (num === 0) {
            str += '0';
            continue;
        }

        const step = base**i;
        const steps: Array<number> = [];
        for (let j = -2; j <= 2; j++) {
            steps.push(step * j);
        }

        const stepValues = steps.map((value, index) => {
            return {
                index: index,
                value: value,
                absoluteDistancetoZero: Math.abs(Math.abs(num) - Math.abs(value)),
                distancetoZero: Math.abs(num + value),
            };
        });

        stepValues.sort((a, b) => {
            return a.distancetoZero - b.distancetoZero;
        });

        stepValues.sort((a, b) => {
            return a.absoluteDistancetoZero - b.absoluteDistancetoZero;
        });

        str += base10ToSnafuMap[2 - stepValues[0].index];
        num += stepValues[0].value;
    }

    return str.replace(/^0+/, '');
}

