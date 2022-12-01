import Board from "./Board";
import Dice from "./Dice";

export default class Game {
	playerCount: number;
	goalScore: number;
	playerPoints: Record<number, number>;
	board: Board;
	dice: Dice;

	constructor(
		playerCount: number,
		goalScore: number,
		board: Board,
		dice: Dice
	) {
		this.playerCount = playerCount;
		this.goalScore = goalScore;
		this.playerPoints = {};
		this.board = board;
		this.dice = dice;
		for (let i = 0; i < playerCount; i++) {
			this.playerPoints[i] = 0;
		}
	}

	play() {
		let winnerIndex = null;
		while (winnerIndex === null) {
			for (let i = 0; i < this.playerCount; i++) {
				const roll1 = this.dice.roll();
				const roll2 = this.dice.roll();
				const roll3 = this.dice.roll();
				const total = roll1 + roll2 + roll3;
				const position = this.board.move(i, total);
				this.playerPoints[i] += position;

				if (process.argv.includes("--verbose")) {
					process.stdout.write(
						`Player ${
							i + 1
						} rolls ${roll1}+${roll2}+${roll3} and moves to space ${position} for a total of ${
							this.playerPoints[i]
						}\n`
					);
				}

				if (this.playerPoints[i] >= this.goalScore) {
					winnerIndex = i;
					break;
				}
			}
		}

		return {
			winnerIndex,
			playerPoints: this.playerPoints,
		};
	}
}
