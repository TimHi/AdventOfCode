import * as fs from "fs";
const isSample = true;

interface Eq {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  X: number;
  Y: number;
  AButton: number;
  BButton: number;
}

interface BigEq {
  x1: bigint;
  x2: bigint;
  y1: bigint;
  y2: bigint;
  X: bigint;
  Y: bigint;
  AButton: number;
  BButton: number;
}

const regex = /Button A: X\+(\d+), Y\+(\d+)\s+Button B: X\+(\d+), Y\+(\d+)\s+Prize: X=(\d+), Y=(\d+)/;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day13/sample.txt" : "/src/days/day13/full.txt";
  const equations: BigEq[] = [];
  let rawLines: string[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "") {
        const padded = rawLines.join("\n");
        const match = padded.match(regex);
        if (match?.length !== 7) throw new Error("Did not find all numbers");
        equations.push({
          x1: BigInt(match[1]),
          y1: BigInt(match[2]),
          x2: BigInt(match[3]),
          y2: BigInt(match[4]),
          X: BigInt(match[5]),
          Y: BigInt(match[6]),
          AButton: -1,
          BButton: -1
        });
        rawLines = [];
      } else {
        rawLines.push(l);
      }
    });
  // const cEq = calculateBigButtonPresses(equations);
  // const cost = calculateBigCosts(cEq);
  // console.log(cost);
  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day13/sample.txt" : "/src/days/day13/full.txt";
  const equations: BigEq[] = [];
  let rawLines: string[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "") {
        const padded = rawLines.join("\n");
        const match = padded.match(regex);
        if (match?.length !== 7) throw new Error("Did not find all numbers");
        equations.push({
          x1: BigInt(match[1]),
          y1: BigInt(match[2]),
          x2: BigInt(match[3]),
          y2: BigInt(match[4]),
          X: BigInt(10000000000000 + match[5]),
          Y: BigInt(10000000000000 + match[6]),
          AButton: -1,
          BButton: -1
        });
        rawLines = [];
      } else {
        rawLines.push(l);
      }
    });
  const cEq = calculateBigButtonPresses(equations);
  const cost = calculateBigCosts(cEq);
  console.log(cost);
  return Number(cost);
}

/*
Det matrix has the form:
| tl tr |
| bl br |
 */
function calcBig2x2Determinant(tl: bigint, tr: bigint, bl: bigint, br: bigint): number {
  return tl * br - bl * tr;
}

function calculateBigButtonPresses(equations: BigEq[]): BigEq[] {
  equations.forEach((eq) => {
    //TODO Double Check
    const A_detA = calcBig2x2Determinant(eq.x1, eq.x2, eq.y1, eq.y2);

    const A_detA1 = calcBig2x2Determinant(eq.X, eq.x2, eq.Y, eq.y2);
    const A_detA2 = calcBig2x2Determinant(eq.x1, eq.X, eq.y1, eq.Y);
    if (
      A_detA !== BigInt(0) &&
      A_detA1 !== BigInt(0) &&
      A_detA2 !== BigInt(0) &&
      A_detA1 % A_detA === BigInt(0) &&
      A_detA2 % A_detA === BigInt(0)
    ) {
      eq.AButton = Number((A_detA1 * 100n) / A_detA) / 100;
      eq.BButton = Number((A_detA2 * 100n) / A_detA) / 100;
    }
  });

  return equations;
}

function calculateBigCosts(cEq: BigEq[]): number {
  let cost = 0;
  cEq.forEach((eq) => {
    if (eq.AButton !== -1 && eq.BButton !== -1 && isInt(eq.AButton) && isInt(eq.BButton)) {
      const eqCost = 3 * eq.AButton + eq.BButton;
      cost = cost + eqCost;
    }
  });
  return cost;
}

//------------------------------------------------------------------------------------------------------------Part1:

/*
Det matrix has the form:
| tl tr |
| bl br |
 */
function calc2x2Determinant(tl: number, tr: number, bl: number, br: number): number {
  return tl * br - bl * tr;
}

function calculateButtonPresses(equations: Eq[]): Eq[] {
  equations.forEach((eq) => {
    //TODO Double Check
    const A_detA = calc2x2Determinant(eq.x1, eq.x2, eq.y1, eq.y2);

    const A_detA1 = calc2x2Determinant(eq.X, eq.x2, eq.Y, eq.y2);
    const A_detA2 = calc2x2Determinant(eq.x1, eq.X, eq.y1, eq.Y);

    if (!Number.isNaN(A_detA) && !Number.isNaN(A_detA1)) eq.AButton = A_detA1 / A_detA;
    if (!Number.isNaN(A_detA) && !Number.isNaN(A_detA2)) eq.BButton = A_detA2 / A_detA;
  });

  return equations;
}

function isInt(n: number) {
  return n % 1 === 0 && n > 0;
}
function calculateCosts(cEq: Eq[]): number {
  let cost = 0;
  cEq.forEach((eq) => {
    if (eq.AButton !== -1 && eq.BButton !== -1 && isInt(eq.AButton) && isInt(eq.BButton)) {
      const eqCost = 3 * eq.AButton + eq.BButton;
      cost += eqCost;
    }
  });
  return cost;
}
