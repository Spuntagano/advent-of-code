const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const lines = fs.readFileSync(FILE_NAME, 'utf8').split('\n');

const vertices = {};
lines.forEach(line => {
    if (!line) {
        return;
    }

    const split = line.split(' ');
    const name = split[1];
    const flow = parseInt(split[4].split('=')[1].replace(';',''));
    const connections = [];
    for (let i = 0; i < split.length; i++) {
        if (i <= 8) {
            continue;
        }

        connections.push(split[i].replace(',',''));
    }

    vertices[name] = {
        name,
        flow,
        connections,
    };
});

const queue = {};
const cache = {};
let maxFlow = 0;
const dfs = (state) => {
    const currentNodeName1 = state.currentNodeName1;
    const currentNodeName2 = state.currentNodeName2;
    const timeLeft = state.timeLeft;
    const openedValves = state.openedValves;

    const node1 = vertices[currentNodeName1];
    const node2 = vertices[currentNodeName2];
    const totalFlow = Object.keys(openedValves).reduce((acc, key) => {
        return acc + vertices[key].flow * (openedValves[key] - 1);
    }, 0);
    const cacheKey = currentNodeName1 + '-' + currentNodeName2 + '_' + Object.keys(openedValves).join('-');

    if (maxFlow < totalFlow) {
        maxFlow = totalFlow;
    }

    if (timeLeft === 0) {
        return;
    }

    if (timeLeft <= cache[cacheKey]) {
        return;
    }

    const possibilities1 = [];
    const possibilities2 = [];

    cache[cacheKey] = timeLeft;
    if (typeof openedValves[node1.name] === 'undefined' && node1.flow > 0) {
        possibilities1.push(node1.name);
    }

    node1.connections.forEach(connection => {
        possibilities1.push(connection);
    });

    if (typeof openedValves[node2.name] === 'undefined' && node2.flow > 0) {
        possibilities2.push(node2.name);
    }

    node2.connections.forEach(connection => {
        possibilities2.push(connection);
    });

    possibilities1.forEach((possibility1) => {
        possibilities2.forEach((possibility2) => {
            const newOpenedValves = { ...openedValves };
            if (possibility1 === node1.name) {
                newOpenedValves[node1.name] = timeLeft;
            }

            if (possibility2 === node2.name) {
                newOpenedValves[node2.name] = timeLeft;
            }

            const score = totalFlow;

            queue[timeLeft-1].push({
                currentNodeName1: possibility1,
                currentNodeName2: possibility2,
                timeLeft: timeLeft - 1,
                openedValves: newOpenedValves,
                score
            });
        });
    });
};

queue[26] = [{currentNodeName1: 'AA', currentNodeName2: 'AA', timeLeft: 26, openedValves: {}, score: 0}];

let iteration = 0;
while (iteration < 10000) {
    for (let i = 0; i <= 26; i++) {
        if (!queue[i]) {
            queue[i] = [];
        }

        if (queue[i].length > 0) {
            queue[i].sort((a, b) => b.score - a.score);
            dfs(queue[i].shift());
        }
    }

    iteration++;
}

console.log(maxFlow);

