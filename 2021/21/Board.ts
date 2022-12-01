export default class Board {
	boardSize: number;
	playerPositions: Record<number, number>;

	constructor(
		boardSize: number,
		initialPlayerPositions?: Record<number, number>
	) {
		this.boardSize = boardSize;
		this.playerPositions = initialPlayerPositions || {};
	}

	move(currentPlayerIndex: number, step: number) {
		this.playerPositions[currentPlayerIndex] =
			this.playerPositions[currentPlayerIndex] || 1;

		this.playerPositions[currentPlayerIndex] =
			this.playerPositions[currentPlayerIndex] + step;

		while (this.playerPositions[currentPlayerIndex] > this.boardSize) {
			this.playerPositions[currentPlayerIndex] -= this.boardSize;
		}

		return this.playerPositions[currentPlayerIndex];
	}
}
