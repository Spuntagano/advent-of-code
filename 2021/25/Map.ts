export enum POINT {
  ">" = ">",
  "v" = "v",
  "." = ".",
}

export default class Map {
  map: { point: POINT; canMove: boolean }[][];
  width: number;
  height: number;

  constructor(map: POINT[][]) {
    if (map.length === 0 || map[0].length === 0) {
      throw new Error("Map cannot be empty");
    }

    this.map = map.map((points) => {
      return points.map((point) => {
        return {
          point,
          canMove: false,
        };
      });
    });
    this.height = map.length;
    this.width = map[0].length;
  }

  public step() {
    let moved = 0;
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x].point === POINT[">"]) {
          this.checkMove(y, x, this.map[y][x].point);
        }
      }
    }

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x].point === POINT[">"]) {
          moved += this.move(y, x, this.map[y][x].point);
        }
      }
    }

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x].point === POINT["v"]) {
          this.checkMove(y, x, this.map[y][x].point);
        }
      }
    }

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x].point === POINT["v"]) {
          moved += this.move(y, x, this.map[y][x].point);
        }
      }
    }

    return moved;
  }

  public getCurrentState() {
    return this.map.map((points) => {
      return points.map((point) => {
        return point.point;
      });
    });
  }

  private checkMove(y: number, x: number, point: POINT) {
    if (point === POINT[">"]) {
      const newX = this.getNewPosition(x, point);
      if (this.map[y][newX].point === POINT["."]) {
        this.map[y][x].canMove = true;
      }
    }

    if (point === POINT["v"]) {
      const newY = this.getNewPosition(y, point);
      if (this.map[newY][x].point === POINT["."]) {
        this.map[y][x].canMove = true;
      }
    }
  }

  private move(y: number, x: number, point: POINT) {
    let moved = 0;
    if (point === POINT[">"]) {
      const newX = this.getNewPosition(x, point);
      if (this.map[y][x].canMove) {
        this.map[y][x].point = POINT["."];
        this.map[y][x].canMove = false;

        if (this.map[y][newX].point !== POINT["."]) {
          throw new Error("Attemping to move to a non empty position");
        }

        this.map[y][newX].point = POINT[">"];
        moved++;
      }
    }

    if (point === POINT["v"]) {
      const newY = this.getNewPosition(y, point);
      if (this.map[y][x].canMove) {
        this.map[y][x].point = POINT["."];
        this.map[y][x].canMove = false;

        if (this.map[newY][x].point !== POINT["."]) {
          throw new Error("Attemping to move to a non empty position");
        }

        this.map[newY][x].point = POINT["v"];
        moved++;
      }
    }

    return moved;
  }

  private getNewPosition(position: number, point: POINT) {
    if (point === POINT[">"]) {
      let newX = position + 1;

      if (newX >= this.width) {
        newX = 0;
      }

      return newX;
    }

    if (point === POINT["v"]) {
      let newY = position + 1;

      if (newY >= this.height) {
        newY = 0;
      }

      return newY;
    }

    throw new Error("Attempting to move invalid point");
  }
}
