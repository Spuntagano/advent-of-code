const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

function checkAnswer(puzzle, answer) {
  let puzzleIndex = 0;
  let answerIndex = 0;

  while (puzzleIndex < puzzle.length) {
    let count = 0;
    while (puzzle[puzzleIndex] === '#') {
      count++;
      puzzleIndex++;
    }

    if (count > 0) {
      if (answer[answerIndex] !== count) {
        return false;
      }

      answerIndex++;
    }

    puzzleIndex++;
  }

  return answerIndex === answer.length;
}

function dfs(puzzle, answer, index) {
  if (index === puzzle.length) {
    return checkAnswer(puzzle, answer) ? 1 : 0;
  }

  if (puzzle[index] === '?') {
    const a = [...puzzle];
    a[index] = '#';

    const b = [...puzzle];
    b[index] = '.';

    return dfs(a, answer, index + 1) + dfs(b, answer, index + 1);
  } else {
    return dfs(puzzle, answer, index + 1);
  }
}

let total = 0;
for (let line of lines) {
  if (line === '') {
    continue;
  }

  const kek = line.split(' ');
  const puzzle = kek[0].split('');
  const answer = kek[1].split(',').map(x => parseInt(x));

  total += dfs(puzzle, answer, 0);
}

console.log(total);


