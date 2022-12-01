import ALU from "./ALU";

describe("ALU", () => {
  it("inp", () => {
    const alu = new ALU([{ operation: "inp", params: ["w"] } as any]);

    alu.run([3]);
    expect(alu.getRegisterValue("w")).toEqual(3);
    expect(() => alu.run()).toThrow();
  });

  it("add", () => {
    const alu = new ALU([
      { operation: "add", params: ["w", 2] },
      { operation: "add", params: ["y", 2] },
      { operation: "add", params: ["y", 2] },
      { operation: "add", params: ["y", "w"] },
    ]);

    alu.run();
    expect(alu.getRegisterValue("w")).toEqual(2);
    expect(alu.getRegisterValue("y")).toEqual(6);
  });

  it("mul", () => {
    const alu = new ALU([
      { operation: "add", params: ["w", 2] },
      { operation: "add", params: ["y", 3] },
      { operation: "mul", params: ["y", 2] },
      { operation: "mul", params: ["y", "w"] },
    ]);

    alu.run();
    expect(alu.getRegisterValue("w")).toEqual(2);
    expect(alu.getRegisterValue("y")).toEqual(12);
  });

  it("div", () => {
    let alu = new ALU([
      { operation: "add", params: ["w", 10] },
      { operation: "add", params: ["y", 20] },
      { operation: "div", params: ["y", 2] },
      { operation: "div", params: ["y", "w"] },
    ]);

    alu.run();
    expect(alu.getRegisterValue("w")).toEqual(10);
    expect(alu.getRegisterValue("y")).toEqual(1);

    alu = new ALU([{ operation: "div", params: ["w", 0] }]);

    expect(() => alu.run()).toThrow();
  });

  it("mod", () => {
    let alu = new ALU([
      { operation: "add", params: ["w", 2] },
      { operation: "add", params: ["y", 13] },
      { operation: "mod", params: ["y", 5] },
      { operation: "mod", params: ["y", "w"] },
    ]);

    alu.run();
    expect(alu.getRegisterValue("w")).toEqual(2);
    expect(alu.getRegisterValue("y")).toEqual(1);

    alu = new ALU([
      { operation: "add", params: ["w", -1] },
      { operation: "mod", params: ["w", 2] },
    ]);

    expect(() => alu.run()).toThrow();

    alu = new ALU([
      { operation: "add", params: ["w", 4] },
      { operation: "mod", params: ["w", 0] },
    ]);

    expect(() => alu.run()).toThrow();
  });

  it("eql", () => {
    const alu = new ALU([
      { operation: "eql", params: ["w", 0] },
      { operation: "eql", params: ["y", "w"] },
    ]);

    alu.run();
    expect(alu.getRegisterValue("w")).toEqual(1);
    expect(alu.getRegisterValue("y")).toEqual(0);
  });

  it("invalid operation", () => {
    const alu = new ALU([{ operation: "yolo", params: ["w", 2] } as any]);

    expect(() => alu.run()).toThrow();
  });

  it("negates positive integer", () => {
    const alu = new ALU([{ operation: "inp", params: ["x"] } as any, { operation: "mul", params: ["x", -1] }]);

    alu.run([4]);
    expect(alu.getRegisterValue("x")).toEqual(-4);
  });

  it("checks if 3x", () => {
    const alu = new ALU([
      { operation: "inp", params: ["z"] } as any,
      { operation: "inp", params: ["x"] } as any,
      { operation: "mul", params: ["z", 3] },
      { operation: "eql", params: ["z", "x"] },
    ]);

    alu.run([4, 12]);
    expect(alu.getRegisterValue("z")).toEqual(1);

    alu.run([4, 13]);
    expect(alu.getRegisterValue("z")).toEqual(0);
  });

  it("to binary", () => {
    const alu = new ALU([
      { operation: "inp", params: ["w"] } as any,
      { operation: "add", params: ["z", "w"] },
      { operation: "mod", params: ["z", 2] },
      { operation: "div", params: ["w", 2] },
      { operation: "add", params: ["y", "w"] },
      { operation: "mod", params: ["y", 2] },
      { operation: "div", params: ["w", 2] },
      { operation: "add", params: ["x", "w"] },
      { operation: "mod", params: ["x", 2] },
      { operation: "div", params: ["w", 2] },
      { operation: "mod", params: ["w", 2] },
    ]);

    alu.run([5]);

    expect(alu.getRegisterValue("w")).toEqual(0);
    expect(alu.getRegisterValue("x")).toEqual(1);
    expect(alu.getRegisterValue("y")).toEqual(0);
    expect(alu.getRegisterValue("z")).toEqual(1);

    alu.run([14]);

    expect(alu.getRegisterValue("w")).toEqual(1);
    expect(alu.getRegisterValue("x")).toEqual(1);
    expect(alu.getRegisterValue("y")).toEqual(1);
    expect(alu.getRegisterValue("z")).toEqual(0);
  });
});
