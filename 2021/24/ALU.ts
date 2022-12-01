export type register = "w" | "x" | "y" | "z";
export type operation = "inp" | "add" | "mul" | "div" | "mod" | "eql";
export type instruction = { operation: operation; params: [register, register | number] };

export default class ALU {
  private input: number[];
  private instructions: instruction[];
  private registers: Record<register, number>;

  constructor(instructions: instruction[]) {
    this.input = [];
    this.instructions = instructions;
    this.registers = {
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };
  }

  private inp(a: register) {
    const value = this.input.shift();

    if (typeof value === "undefined") {
      throw new Error("Input is empty");
    }

    this.registers[a] = value;
  }

  private add(a: register, b: register | number) {
    let value: number;
    if (typeof b === "number") {
      value = b;
    } else {
      value = this.registers[b];
    }

    this.registers[a] = this.registers[a] + value;
  }

  private mul(a: register, b: register | number) {
    let value: number;
    if (typeof b === "number") {
      value = b;
    } else {
      value = this.registers[b];
    }
    this.registers[a] = this.registers[a] * value;
  }

  private div(a: register, b: register | number) {
    let value: number;
    if (typeof b === "number") {
      value = b;
    } else {
      value = this.registers[b];
    }

    if (value === 0) {
      throw new Error("Cannot divide by 0");
    }

    this.registers[a] = Math.floor(this.registers[a] / value);
  }

  private mod(a: register, b: register | number) {
    if (this.registers[a] < 0) {
      throw new Error("Cannot mod a number < 0");
    }

    let value: number;
    if (typeof b === "number") {
      value = b;
    } else {
      value = this.registers[b];
    }

    if (value <= 0) {
      throw new Error("Cannot mod by a number <= 0");
    }

    this.registers[a] = this.registers[a] % value;
  }

  private eql(a: register, b: register | number) {
    let value: number;
    if (typeof b === "number") {
      value = b;
    } else {
      value = this.registers[b];
    }
    this.registers[a] = Number(this.registers[a] === value);
  }

  async run(input: number[] = []) {
    this.input = input;
    this.registers = {
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };

    let initialInputCount = input.length;
    let inpCount = 0;
    for (let i = 0; i < this.instructions.length; i++) {
      if (!this[this.instructions[i].operation]) {
        throw new Error(`Invalid operation ${this[this.instructions[i].operation]}`);
      }

      if (this.instructions[i].operation === "inp") {
        if (inpCount === initialInputCount) {
          break;
        }

        inpCount++;
      }

      this[this.instructions[i].operation](...this.instructions[i].params);
    }
  }

  getRegisterValue(register: register) {
    return this.registers[register];
  }
}
