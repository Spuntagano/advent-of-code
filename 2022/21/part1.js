const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const state = {};

const lines = input.trimEnd().split('\n').forEach((line) => {
    const [key, value] = line.split(': ');
    const parsedValue = parseInt(value);

    if (!isNaN(parsedValue)) {
        state[key] = parsedValue;
    } else {
        const [var1, operator, var2] = value.split(' ');
        state[key] = {
            var1,
            var2,
            operator
        };
    }
});

while (isNaN(state.root)) {
    Object.keys(state).forEach((key) => {
        if (!isNaN(state[key])) {
            return;
        }

        const var1 = state[key].var1;
        const var2 = state[key].var2;
        const operator = state[key].operator;

        if (isNaN(state[var1]) || isNaN(state[var2])) {
            return;
        }

        switch (operator) {
            case '+':
                state[key] = state[var1] + state[var2];
                break;
            case '-':
                state[key] = state[var1] - state[var2];
                break;
            case '*':
                state[key] = state[var1] * state[var2];
                break;
            case '/':
                state[key] = state[var1] / state[var2];
                break;
            default:
                panic();
        }
    });
}

console.log(state.root);
