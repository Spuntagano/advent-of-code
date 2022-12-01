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

const min = 11111111111111;
const max = 99999999999999;

const start = new Date().getTime();

for (let i = max; i > min; i--) {
  const val = String(i)
    .split("")
    .map((val) => parseInt(val));

  if (val.includes(0)) {
    continue;
  }

  if (Math.floor(Math.random() * 100000) === 0) {
    const now = new Date().getTime();
    const timeElapsed = (now - start) / 1000;
    console.log(`current: ${i} - time elapsed: ${timeElapsed}s`);
  }

  alu.run(val);

  if (alu.getRegisterValue("z") === 0) {
    console.log(alu.getRegisterValue("z"));
    break;
  }
}
