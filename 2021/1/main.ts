import fs from "fs";

const input = fs.readFileSync("./input.txt");

const inputArray = input
  .toString()
  .split("\n")
  .slice(0, -1)
  .map((numberString: string) => parseInt(numberString));

let increaseCount = 0;
for (let i = 1; i < inputArray.length; i++) {
  if (inputArray[i] > inputArray[i - 1]) {
    increaseCount++;
  }
}

process.stdout.write(`Step 1: ${increaseCount}\n`);

let rollingIncreaseCount = 0;
for (let i = 2; i < inputArray.length - 1; i++) {
  if (inputArray[i - 1] + inputArray[i] + inputArray[i + 1] > inputArray[i - 2] + inputArray[i - 1] + inputArray[i]) {
    rollingIncreaseCount++;
  }
}

process.stdout.write(`Step 2: ${rollingIncreaseCount}\n`);
