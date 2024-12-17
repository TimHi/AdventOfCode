import { getAllNumbersInString } from "aoc-util";
import * as fs from "fs";

const isSample = true;

function getOpCode(n: number): Opcode {
  if (n === 0) return Opcode.adv;
  if (n === 1) return Opcode.bxl;
  if (n === 2) return Opcode.bst;
  if (n === 3) return Opcode.jnz;
  if (n === 4) return Opcode.bxc;
  if (n === 5) return Opcode.out;
  if (n === 6) return Opcode.bdv;
  if (n === 7) return Opcode.cdv;
  throw new Error("Unkown Opcode");
}

enum Opcode {
  /*
  The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. 
  (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
  */
  adv = 0,
  /* 
  The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
  */
  bxl = 1,
  /*
  The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.
  */
  bst = 2,
  /*
  The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; 
  if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
  */
  jnz = 3,
  /*
  The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
  */
  bxc = 4,
  /*
  The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
  */
  out = 5,
  /*
  The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
  */
  bdv = 6,
  /*
  The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
  */
  cdv = 7
}

interface Operation {
  code: Opcode;
  comboOperand: number;
}

interface Computer {
  A: number;
  B: number;
  C: number;
  program: Operation[];
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const pc: Computer = { A: 0, B: 0, C: 0, program: [] };
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  pc.A = getAllNumbersInString(lines[0])[0];
  pc.B = getAllNumbersInString(lines[1])[0];
  pc.C = getAllNumbersInString(lines[2])[0];
  const raw = lines[4]
    .split(" ")[1]
    .split(",")
    .map((l) => Number(l));

  const operations: Operation[] = [];
  for (let i = 0; i < raw.length - 1; i++) {
    operations.push({ code: raw[i], comboOperand: raw[i + 1] });
  }
  pc.program = operations;
  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const pc: Computer = { A: 0, B: 0, C: 0, program: [] };
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  pc.A = getAllNumbersInString(lines[0])[0];
  pc.B = getAllNumbersInString(lines[1])[0];
  pc.C = getAllNumbersInString(lines[2])[0];

  const raw = lines[4]
    .split(" ")[1]
    .split(",")
    .map((l) => Number(l));

  const output = runProgram(pc);
  return Number(output.map((n) => String(n)).join());
}

function getComboOperand(op: Opcode, pc: Computer): number {
  if (op === Opcode.adv) {
  }
  return 0;
}

function runProgram(pc: Computer): number[] {
  for (let instPointer = 0; instPointer < pc.program.length; instPointer++) {
    const op = pc.program[instPointer];
    switch (op.code) {
      case Opcode.adv:
        break;
      case Opcode.bxl:
        break;
      case Opcode.bst:
        break;
      case Opcode.jnz:
        break;
      case Opcode.bxc:
        break;
      case Opcode.out:
        break;
      case Opcode.bdv:
        break;
      case Opcode.cdv:
        break;
    }
  }
  return [];
}
