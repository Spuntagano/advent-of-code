const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const lines = input.trimEnd().split('\n');

const root = {
    name: '/',
    children: {},
    parrent: null,
    files: [],
    size: 0,
};

let current = root;
const folders = [];

lines.forEach((line) => {
    const split = line.split(' ');

    if (split[0] === '$') {
        if (split[1] === 'cd') {
            if (split[2] === '/') {
                folders.push(root);
            } else if (split[2] === '..') {
                current = current.parent;
            } else {
                current = current.children[split[2]];
                folders.push(current);
            }
        } else if (split[1] === 'ls') {
            // skip
        }
    } else {
        if (split[0] === 'dir') {
            if (!current.children[split[1]]) {
                current.children[split[1]] = {
                    name: split[1],
                    children: {},
                    parent: current,
                    files: [],
                    size: 0,
                };
            }
        } else {
            current.files.push({size: parseInt(split[0]), name: split[1]});
        }
    }
});

folders.forEach((folder) => {
    const dfs = (node) => {
        node.files.forEach((file) => {
            folder.size += file.size;
        })
        Object.values(node.children).forEach((child) => {
            dfs(child);
        });
    }

    dfs(folder);
});

const sum = folders.reduce((acc, folder) => {
    if (folder.size <= 100000) {
        return acc + folder.size;
    }

    return acc;
}, 0);

console.log(sum);

