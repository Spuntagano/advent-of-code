import Dice from "./Dice";
import Game from "./Game";
import Board from "./Board";

const playerCount = 2;
const boardSize = 10;
const faceCount = 100;
const goalScore = 1000;

const board = new Board(boardSize, { 0: 9, 1: 3 });
const dice = new Dice(faceCount);
const game = new Game(playerCount, goalScore, board, dice);

const gameResult = game.play();

const looserIndex = (gameResult.winnerIndex + 1) % 2;

process.stdout.write(`Step 1: ${gameResult.playerPoints[looserIndex] * dice.getRollCount()}\n`);

const quantumGoalScore = 21;
const quantumFaceCount = 3;

const memoize = (func: any) => {
  const cache: Record<string, any> = {};
  return (...args: any) => {
    const key = JSON.stringify(args);

    if (cache[key]) {
      return cache[key];
    }

    cache[key] = func(...args);
    return cache[key];
  };
};

const downBad = (scores: Record<number, number>, positions: Record<number, number>, currentPlayerIndex: number, rolls: number[]) => {
  const newWins: Record<number, number> = { 0: 0, 1: 0 };
  const otherPlayerIndex = (currentPlayerIndex + 1) % 2;
  const scoresClone = { ...scores };
  const positionsClone = { ...positions };
  if (rolls.length === quantumFaceCount) {
    const quantumBoard = new Board(boardSize, positionsClone);
    const newPosition = quantumBoard.move(currentPlayerIndex, eval(rolls.join("+")));
    scoresClone[currentPlayerIndex] += newPosition;
    positionsClone[currentPlayerIndex] = newPosition;

    if (scoresClone[currentPlayerIndex] >= quantumGoalScore) {
      newWins[currentPlayerIndex]++;
    } else {
      const bob = downBadMemo(scoresClone, positionsClone, otherPlayerIndex, []);
      newWins[0] += bob[0];
      newWins[1] += bob[1];
    }
  } else {
    for (let i = 1; i <= quantumFaceCount; i++) {
      const bob = downBadMemo(scoresClone, positionsClone, currentPlayerIndex, [...rolls, i]);
      newWins[0] += bob[0];
      newWins[1] += bob[1];
    }
  }

  return newWins;
};

const downBadMemo = memoize(downBad);

const wins: Record<number, number> = downBadMemo({ 0: 0, 1: 0 }, { 0: 9, 1: 3 }, 0, []);

process.stdout.write(`Step 2: ${Math.max(...Object.values(wins))}\n`);
