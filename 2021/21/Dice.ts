export default class Dice {
	current: number;
	faceCount: number;
	rollCount: number;

	constructor(faceCount: number) {
		this.current = 0;
		this.rollCount = 0;
		this.faceCount = faceCount;
	}

	roll() {
		this.rollCount++;
		this.current++;

		if (this.current > this.faceCount) {
			this.current = 1;
		}

		return this.current;
	}

	getRollCount() {
		return this.rollCount;
	}
}
