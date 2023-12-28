const fs = require('fs');
const input = fs.readFileSync('./test.txt', 'utf8');
const blocks = input.split('\n\n');

const workflows = {};

function dig(id, workflows, rules, posibilities) {
  const newRules = JSON.parse(JSON.stringify(rules));

  const ruleset = workflows[id];

  for (let i = 0; i < ruleset.length; i++) {
    const rule = ruleset[i];
    const symbol = rule[0][1];
    const [id, breakpoint] = rule[0].split(symbol);
  
    if (rule.length === 1) {
      if (rule[0] === 'A') {
        posibilities.push(newRules);
        return;
      }

      if (rule[0] === 'R') {
        return;
      }

      return dig(rule[0], workflows, newRules, posibilities);
    }

    const newNewRules = [...JSON.parse(JSON.stringify(newRules)), { id, symbol, breakpoint: parseInt(breakpoint) }];
    if (rule[1] === 'A') {
      posibilities.push(newNewRules);
      continue;
    }

    if (rule[1] === 'R') {
      continue;
    }

    dig(rule[1], workflows, newNewRules, posibilities);

    if (symbol === '>') {
      newRules.push({ id, symbol: '<', breakpoint: parseInt(breakpoint) + 1 });
    } else {
      newRules.push({ id, symbol: '>', breakpoint: parseInt(breakpoint) - 2 });
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

const posibilities = []
dig('in', workflows, [], posibilities);

let total = 0;

for (const posibility of posibilities) {
  const letters = {
    x: new Array(4000).fill(true),
    m: new Array(4000).fill(true),
    a: new Array(4000).fill(true),
    s: new Array(4000).fill(true)
  }

  for (const { id, symbol, breakpoint } of posibility) {
    if (symbol === '>') {
      for (let i = 0; i <= breakpoint - 1; i++) {
        letters[id][i] = false;
      }
    } else if (symbol === '<') {
      for (let i = breakpoint - 1; i < 4000; i++) {
        letters[id][i] = false;
      }
    }
  }

  let current = 1;
  Object.values(letters).forEach(value => {
    current *= value.filter(x => x).length;
  });

  console.log(posibility);
  console.log(current);

  total += current;
}

console.log(total);

