const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');
const blocks = input.split('\n\n');

const workflows = {};
const breakpoints = {
  x: [],
  m: [],
  a: [],
  s: []
};

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

  for (let j = 0; j < ruleset.length; j++) {
    if (ruleset[j].length > 1) {
      const symbol = ruleset[j][0][1];
      const [letter, breakpoint] = ruleset[j][0].split(/<|>/);

      if (symbol === '<') {
        breakpoints[letter].push(parseInt(breakpoint));
      } else {
        breakpoints[letter].push(parseInt(breakpoint) + 1);
      }
    }
  }

  workflows[id] = ruleset;
}

Object.values(breakpoints).forEach(x => x.sort((a, b) => a - b));
Object.values(breakpoints).forEach(x => {
  if (x[0] !== 1) {
    x.unshift(1);
  }

  if (x[x.length - 1] !== 4000) {
    x.push(4001);
  }
});

let result = 0;
for (let i = 1; i < breakpoints.x.length; i++) {
  console.log('i', i);
  for (let j = 1; j < breakpoints.m.length; j++) {
    console.log('j', j);
    for (let k = 1; k < breakpoints.a.length; k++) {
      for (let l = 1; l < breakpoints.s.length; l++) {
        const isAccepted = dig('in', workflows, breakpoints.x[i] - 1, breakpoints.m[j] - 1, breakpoints.a[k] - 1, breakpoints.s[l] - 1);

        if (isAccepted === 'A') {
          result += (breakpoints.x[i] - breakpoints.x[i - 1]) * (breakpoints.m[j] - breakpoints.m[j - 1]) * (breakpoints.a[k] - breakpoints.a[k - 1]) * (breakpoints.s[l] - breakpoints.s[l - 1]);
        }
      }
    }
  }
}

console.log(result);



