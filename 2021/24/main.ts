import fs from "fs";
import ALU, { instruction } from "./ALU";

const input = fs.readFileSync("./input.txt");

const instructions = input
  .toString()
  .split("\n")
  .slice(0, -1)
  .map((line) => {
    const [operation, ...params] = line.split(" ");
    return { operation, params: params.map((param) => (isNaN(parseInt(param)) ? param : parseInt(param))) } as instruction;
  });

const alu = new ALU(instructions);

let cache: any = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};
const min = 1;
const max = 9;

const start = new Date().getTime();
const results: number[] = [];

let j = 1;
while (j < 14) {
  const newCache: any = {};
  for (let i = min; i <= max; i++) {
    Object.keys(cache).forEach((key) => {
      const f = `${cache[key]}${i}`;
      const pf = parseInt(f);
      if (Math.floor(Math.random() * 100000) === 0) {
        const now = new Date().getTime();
        const timeElapsed = (now - start) / 1000;
        const curr = Object.keys(cache).length;
        const tot = 10 ** String(cache[key]).length;
        console.log(`current: ${f} - cache size ${curr}/${tot} (${(curr / tot) * 100}%) - time elapsed: ${timeElapsed}s`);
      }
      const arr = f.split("").map((val) => parseInt(val));
      alu.run(arr);

      const z = alu.getRegisterValue("z");

      if (z === 0) {
        results.push(pf);
      }

      newCache[z] = newCache[z] || 0;

      if (pf > newCache[z]) {
        newCache[z] = pf;
      }
    });
  }

  cache = newCache;
  j++;
}

console.log(results);
console.log(Math.max(...results));
