"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var input = fs_1["default"].readFileSync("./input.txt");
var inputArray = input
    .toString()
    .split("\n")
    .slice(0, -1)
    .map(function (numberString) { return parseInt(numberString); });
var increaseCount = 0;
for (var i = 1; i < inputArray.length; i++) {
    if (inputArray[i] > inputArray[i - 1]) {
        increaseCount++;
    }
}
process.stdout.write("Step 1: ".concat(increaseCount, "\n"));
var rollingIncreaseCount = 0;
for (var i = 2; i < inputArray.length - 1; i++) {
    if (inputArray[i - 1] + inputArray[i] + inputArray[i + 1] > inputArray[i - 2] + inputArray[i - 1] + inputArray[i]) {
        rollingIncreaseCount++;
    }
}
process.stdout.write("Step 2: ".concat(rollingIncreaseCount, "\n"));
