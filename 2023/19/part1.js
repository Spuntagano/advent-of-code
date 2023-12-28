const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const blocks = input.split('\n\n');

const workflows = {};

function dig(id, workflows, x, m ,a, s) {
  const ruleset = workflows[id];

  for (let i = 0; i < ruleset.length; i++) {
    const rule = ruleset[i];
  
    if (rule.length === 1) {
      if (rule[0] === 'A') {
        return 'A';
      }

      if (rule[0] === 'R') {
        return 'R';
      }

      return dig(rule[0], workflows, x, m, a, s);
    }

    if (eval(rule[0])) {
      if (rule[1] === 'A') {
        return 'A';
      }

      if (rule[1] === 'R') {
        return 'R';
      }

      return dig(rule[1], workflows, x, m, a, s);
    }
  }
}

const rules = blocks[0].split('\n');
for (let i = 0; i < rules.length; i++) {
  if (rules[i] === '') {
    continue;
  }

  const split = rules[i].split('{')
  const id = split[0];
  const ruleset = split[1]
    .replace('}', '')
    .split(',')
    .map(x => x.split(':'));

  workflows[id] = ruleset;
}

let result = 0;
const parts = blocks[1].split('\n');
for (let i = 0; i < parts.length; i++) {
  if (parts[i] === '') {
    continue;
  }

  const split = parts[i].replace(/{|}/g, '').split(',').map(x => x.split('='));
  const x = parseInt(split[0][1]);
  const m = parseInt(split[1][1]);
  const a = parseInt(split[2][1]);
  const s = parseInt(split[3][1]);

  if (dig('in', workflows, x, m, a, s) === 'A') {
    result += x + m + a + s;
  }
}

console.log(result);
