const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');


function memoize(func) {
  const cache = {};
  return function(...args) {
    const key = args.join('-');
    if (cache[key] !== undefined) {
      return cache[key];
    }

    const result = func(...args);
    cache[key] = result;
    return result;
  }
}

function dfs(puzzle, answer, puzzleIndex, answerIndex, count) {
  if (puzzleIndex > puzzle.length) {
    return 0;
  }

  if (answerIndex > answer.length) {
    return 0;
  }

  if (puzzleIndex === puzzle.length && answerIndex === answer.length && count === 0) {
    return 1;
  }

  if (puzzleIndex === puzzle.length && answerIndex === answer.length - 1 && count === answer[answerIndex]) {
    return 1;
  }

  if (puzzle[puzzleIndex] === '?') {
    let add = 0;
    if (count < answer[answerIndex]) {
      add = memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex, count + 1);
    }

    let dontAdd = 0;
    if (count === answer[answerIndex] || count === 0) {
      if (count === 0) {
        dontAdd = memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex, 0)
      } else {
        dontAdd = memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex + 1, 0)
      }
    }

    return add + dontAdd;
  } else if (puzzle[puzzleIndex] === '#') {
    if (count < answer[answerIndex]) {
      return memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex, count + 1);
    }
  } else if (puzzle[puzzleIndex] === '.') {
    if (count === answer[answerIndex] || count === 0) {
      if (count === 0) {
        return memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex, 0);
      } else {
        return memoizedDfs(puzzle, answer, puzzleIndex + 1, answerIndex + 1, 0);
      }
    }
  }

  return 0;
}

const memoizedDfs = memoize(dfs);

let total = 0;
for (let line of lines) {
  if (line === '') {
    continue;
  }

  const kek = line.split(' ');
  const puzzle = kek[0].split('');
  const answer = kek[1].split(',').map(x => parseInt(x));

  const bigPuzzle = [];
  const bigAnswer = [];

  for (let i = 0; i < 5; i++) {
    bigPuzzle.push(...puzzle);
    if (i !== 4) {
      bigPuzzle.push('?');
    }

    bigAnswer.push(...answer);
  }

  const a = memoizedDfs(bigPuzzle, bigAnswer, 0, 0, 0);
  total += a;
}

console.log(total);


