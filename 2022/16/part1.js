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
        cache: {}
    };
});

let maxFlow = 0;
const dfs = (currentNodeName, timeLeft, openedValves) => {
    const node = vertices[currentNodeName];
    const totalFlow = Object.keys(openedValves).reduce((acc, key) => {
        return acc + vertices[key].flow * (openedValves[key] - 1);
    }, 0);
    const cacheKey = Object.keys(openedValves).join('-');

    if (maxFlow < totalFlow) {
        maxFlow = totalFlow;
    }

    if (timeLeft === 0) {
        return;
    }

    if (timeLeft <= node.cache[cacheKey]) {
        return;
    }

    node.cache[cacheKey] = timeLeft;
    if (typeof openedValves[node.name] === 'undefined' && node.flow > 0) {
        dfs(node.name, timeLeft - 1, {...openedValves, [node.name]: timeLeft});
    }

    node.connections.forEach(connection => {
        dfs(connection, timeLeft - 1, {...openedValves});
    });
};

dfs('AA', 30, {});

console.log(maxFlow);

