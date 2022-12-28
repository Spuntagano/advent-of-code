const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const initialState = {};

input.trimEnd().split('\n').forEach((line) => {
    const [key, value] = line.split(': ');
    const parsedValue = parseInt(value);

    if (!isNaN(parsedValue)) {
        initialState[key] = {
            value: parsedValue,
            equations: [],
        };
    } else {
        const [var1, operator, var2] = value.split(' ');
        initialState[key] = {
            value: null,
            equations: [{
                var1,
                var2,
                operator
            }]
        };
    }
});

Object.keys(initialState).forEach((key) => {
    if (initialState[key].equations.length === 0 || key === 'root') {
        return;
    }

    const { var1, var2, operator } = initialState[key].equations[0];
    switch (operator) {
        case '+':
            // key = var1 + var2
            initialState[var1].equations.push({
                var1: key,
                var2,
                operator: '-'
            });
            initialState[var2].equations.push({
                var1: key,
                var2: var1,
                operator: '-'
            });
            break;
        case '-':
            // key = var1 - var2
            initialState[var1].equations.push({
                var1: key,
                var2,
                operator: '+'
            });
            initialState[var2].equations.push({
                var1: key,
                var2: var1,
                operator: '-/'
            });
            break;
        case '*':
            // key = var1 * var2
            initialState[var1].equations.push({
                var1: key,
                var2,
                operator: '/'
            });
            initialState[var2].equations.push({
                var1: key,
                var2: var1,
                operator: '/'
            });
            break;
        case '/':
            // key = var1 / var2
            initialState[var1].equations.push({
                var1: key,
                var2,
                operator: '*'
            });
            initialState[var2].equations.push({
                var1,
                var2: key,
                operator: '/'
            });
            break;
        case '-/':
            break;
        default:
            panic();
    }
});

let run = (state, target) => {
    while (state[target].value === null) {
        Object.keys(state).forEach((key) => {
            state[key].equations.forEach((equation) => {
                const var1 = equation.var1;
                const var2 = equation.var2;
                const operator = equation.operator;

                if (state[var1].value === null || state[var2].value === null) {
                    return;
                }

                switch (operator) {
                    case '+':
                        state[key].value = state[var1].value + state[var2].value;
                        break;
                    case '-':
                        state[key].value = state[var1].value - state[var2].value;
                        break;
                    case '*':
                        state[key].value = state[var1].value * state[var2].value;
                        break;
                    case '/':
                        state[key].value = state[var1].value / state[var2].value;
                        break;
                    case '-/':
                        state[key].value = (state[var1].value - state[var2].value) * -1;
                        break;
                    default:
                        panic();
                }
            });
        });
    }
}

const state = JSON.parse(JSON.stringify(initialState));
const target1 = state.root.equations[0].var1;
const target2 = state.root.equations[0].var2;
run(state, target1);
const targetValue = state[target2].value;

const newState = JSON.parse(JSON.stringify(initialState));
newState[target1].value = targetValue;
newState[target2].value = targetValue;
delete newState.root;
newState.humn.value = null;

run(newState, 'humn');
console.log(newState.humn.value);



