import fs from "fs";

const minLimit = -50;
const maxLimit = 50;

const input = fs.readFileSync("./input.txt");
const lines = input.toString().split("\n").slice(0, -1);

const cube: boolean[][][] = [];

const toggleCube = (
  operation: boolean,
  xMinRange: number,
  xMaxRange: number,
  yMinRange: number,
  yMaxRange: number,
  zMinRange: number,
  zMaxRange: number,
  log: boolean = false
) => {
  xMinRange = xMinRange < minLimit ? minLimit : xMinRange;
  yMinRange = yMinRange < minLimit ? minLimit : yMinRange;
  zMinRange = zMinRange < minLimit ? minLimit : zMinRange;
  xMaxRange = xMaxRange > maxLimit ? maxLimit : xMaxRange;
  yMaxRange = yMaxRange > maxLimit ? maxLimit : yMaxRange;
  zMaxRange = zMaxRange > maxLimit ? maxLimit : zMaxRange;

  for (let x = xMinRange; x <= xMaxRange; x++) {
    for (let y = yMinRange; y <= yMaxRange; y++) {
      for (let z = zMinRange; z <= zMaxRange; z++) {
        cube[x] = cube[x] || [];
        cube[x][y] = cube[x][y] || [];
        cube[x][y][z] = operation;

        if (log) {
          console.log(`${x},${y},${z}`);
        }
      }
    }
  }
};

const countCube = () => {
  let count = 0;
  for (let x = minLimit; x <= maxLimit; x++) {
    for (let y = minLimit; y <= maxLimit; y++) {
      for (let z = minLimit; z <= maxLimit; z++) {
        if (cube[x][y][z]) {
          count++;
        }
      }
    }
  }

  return count;
};

toggleCube(false, minLimit, maxLimit, minLimit, maxLimit, minLimit, maxLimit);

lines.forEach((line) => {
  const [operation, ranges] = line.split(" ");
  const [xRange, yRange, zRange] = ranges.split(",");
  const [xMinRange, xMaxRange] = xRange.split("..");
  const [yMinRange, yMaxRange] = yRange.split("..");
  const [zMinRange, zMaxRange] = zRange.split("..");

  toggleCube(
    operation === "on",
    parseInt(xMinRange.substring(2)),
    parseInt(xMaxRange),
    parseInt(yMinRange.substring(2)),
    parseInt(yMaxRange),
    parseInt(zMinRange.substring(2)),
    parseInt(zMaxRange)
  );
});

console.log(countCube());
