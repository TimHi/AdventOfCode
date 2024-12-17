import { getAllNumbersInString } from "aoc-util";
import * as fs from "fs";

const isSample = false;

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
  inst: number;
  out: number[];
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const pc: Computer = { A: 0, B: 0, C: 0, program: [], inst: 0, out: [] };
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  pc.A = getAllNumbersInString(lines[0])[0];
  pc.B = getAllNumbersInString(lines[1])[0];
  pc.C = getAllNumbersInString(lines[2])[0];
  const raw = lines[4]
    .split(" ")[1]
    .split(",")
    .map((l) => Number(l));

  const operations: Operation[] = [];
  for (let i = 0; i < raw.length - 1; i += 2) {
    operations.push({ code: raw[i], comboOperand: raw[i + 1] });
  }
  pc.program = operations;
  const finishedPc = runProgram(pc);
  console.log(pc);
  console.log(finishedPc.out.map((n) => String(n)).join(","));
  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const pc: Computer = { A: 0, B: 0, C: 0, program: [], inst: 0, out: [] };
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  pc.A = getAllNumbersInString(lines[0])[0];
  pc.B = getAllNumbersInString(lines[1])[0];
  pc.C = getAllNumbersInString(lines[2])[0];
  const raw = lines[4]
    .split(" ")[1]
    .split(",")
    .map((l) => Number(l));

  const operations: Operation[] = [];
  for (let i = 0; i < raw.length - 1; i += 2) {
    operations.push({ code: raw[i], comboOperand: raw[i + 1] });
  }
  pc.program = operations;

  const output = runProgram(pc).out;
  console.log(pc);
  console.log(finishedPc.out.map((n) => String(n)).join(","));
  return 0;
}

function getComboOperandValue(op: Operation, pc: Computer): number {
  if (op.comboOperand === 0) return 0;
  if (op.comboOperand === 1) return 1;
  if (op.comboOperand === 2) return 2;
  if (op.comboOperand === 3) return 3;
  if (op.comboOperand === 4) return pc.A;
  if (op.comboOperand === 5) return pc.B;
  if (op.comboOperand === 6) return pc.C;
  if (op.comboOperand === 7) return 7;
  throw new Error("Unknown combo operand");
}

function adv(op: Operation, pc: Computer): Computer {
  const numerator = pc.A;
  const denumerator = getComboOperandValue(op, pc);
  pc.A = Math.floor(numerator / Math.pow(2, denumerator));
  return pc;
}

function bxl(op: Operation, pc: Computer): Computer {
  const operand = op.comboOperand;
  // ^ bitwise XOR
  pc.B = pc.B ^ operand;
  return pc;
}

function bst(op: Operation, pc: Computer): Computer {
  pc.B = getComboOperandValue(op, pc) % 8;
  return pc;
}

function jnz(op: Operation, pc: Computer): Computer {
  const operand = op.comboOperand;
  if (pc.A !== 0) {
    pc.inst = operand;
  } else {
    pc.inst += 1;
  }
  return pc;
}

function bxc(pc: Computer): Computer {
  pc.B = pc.B ^ pc.C;
  return pc;
}

function out(op: Operation, pc: Computer): Computer {
  const operand = getComboOperandValue(op, pc);
  pc.out.push(operand % 8);
  return pc;
}

function bdv(op: Operation, pc: Computer): Computer {
  const numerator = pc.A;
  const denumerator = getComboOperandValue(op, pc);
  pc.B = Math.floor(numerator / Math.pow(2, denumerator));
  return pc;
}

function cdv(op: Operation, pc: Computer): Computer {
  const numerator = pc.A;
  const denumerator = getComboOperandValue(op, pc);
  pc.C = Math.floor(numerator / Math.pow(2, denumerator));
  return pc;
}

function runProgram(pc: Computer): Computer {
  while (pc.inst < pc.program.length) {
    const op = pc.program[pc.inst];
    switch (op.code) {
      case Opcode.adv:
        pc = adv(op, pc);
        pc.inst += 1;
        break;
      case Opcode.bxl:
        pc = bxl(op, pc);
        pc.inst += 1;
        break;
      case Opcode.bst:
        pc = bst(op, pc);
        pc.inst += 1;
        break;
      case Opcode.jnz:
        pc = jnz(op, pc);
        break;
      case Opcode.bxc:
        pc = bxc(pc);
        pc.inst += 1;
        break;
      case Opcode.out:
        pc = out(op, pc);
        pc.inst += 1;
        break;
      case Opcode.bdv:
        bdv(op, pc);
        pc.inst += 1;
        break;
      case Opcode.cdv:
        cdv(op, pc);
        pc.inst += 1;
        break;
    }
  }
  return pc;
}
