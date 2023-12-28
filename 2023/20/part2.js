const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n');

let modules = {};

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') {
    continue;
  }

  const [input, outputs] = lines[i].split(' -> ');

  if (input === 'broadcaster') {
    modules['broadcaster'] = {
      type: 'broadcaster',
      outputs: outputs.split(', '),
    }
  } else if (input[0] === '%') {
    modules[input.slice(1)] = {
      type: 'flipflop',
      outputs: outputs.split(', '),
      isOn: false,
    }
  } else if (input[0] === '&') {
    modules[input.slice(1)] = {
      type: 'conjuction',
      outputs: outputs.split(', '),
      memory: {},
    }
  }
}

const keys = Object.keys(modules);
for (let i = 0; keys.length > i; i++) {
  const key = keys[i];
  const module = modules[key];

  for (let j = 0; j < module.outputs.length; j++) {
    const output = module.outputs[j];

    if (modules[output]) {
      if (modules[output].type === 'conjuction') {
        modules[output].memory[key] = false;
      }
    }
  }
}

const finalInputs = {};
for (let i = 0; keys.length > i; i++) {
  const key = keys[i];
  const module = modules[key];

  for (let j = 0; j < module.outputs.length; j++) {
    const output = module.outputs[j];

    if (output === 'rx') {
      Object.keys(module.memory).forEach(key => {
        finalInputs[key] = 0;
      });
    }
  }
}

const modulesCopy = modules;
const finalInputsKeys = Object.keys(finalInputs);
for (let i = 0; i < finalInputsKeys.length; i++) {
  modules = JSON.parse(JSON.stringify(modulesCopy));
  main: while (true) {
    finalInputs[finalInputsKeys[i]]++;

    const queue = [{input: 'button', current: 'broadcaster', pulse: false}];
    while (queue.length > 0) {
      const {input, current, pulse} = queue.shift();

      if (current === finalInputsKeys[i] && !pulse) {
        break main;
      }

      const module = modules[current];

      if (module) {
        if (module.type === 'broadcaster') {
          for (let i = 0; i < module.outputs.length; i++) {
            queue.push({input: current, current: module.outputs[i], pulse});
          }
        } else if (module.type === 'flipflop') {
          if (!pulse) {
            for (let i = 0; i < module.outputs.length; i++) {
              queue.push({input: current, current: module.outputs[i], pulse: module.isOn ? false : true});
            }

            module.isOn = !module.isOn;
          }
        } else if (module.type === 'conjuction') {
          module.memory[input] = pulse;
          const keys = Object.keys(module.memory);
          let allHigh = true;
          for (let i = 0; keys.length > i; i++) {
            const key = keys[i];
            if (!module.memory[key]) {
              allHigh = false;
              break;
            }
          }

          if (allHigh) {
            for (let i = 0; i < module.outputs.length; i++) {
              queue.push({input: current, current: module.outputs[i], pulse: false});
            }
          } else {
            for (let i = 0; i < module.outputs.length; i++) {
              queue.push({input: current, current: module.outputs[i], pulse: true});
            }
          }
        }
      }
    }
  }
}

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
}

const result = lcm(...Object.values(finalInputs));

console.log(result);

