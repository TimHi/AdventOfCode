import * as fs from "fs";

const isSample = false;

const isIncreasingGradually = (a: number, b: number) => {
  const dif = Math.abs(a - b);
  return dif >= 0 && dif <= 3;
};

enum Direction {
  INC,
  DEC,
  ERR
}

function determineGrowthDirection(a: number, b: number): Direction {
  if (a === b) return Direction.ERR;
  if (b < a) return Direction.DEC;
  if (b > a) return Direction.INC;
  throw new Error(`Can't determine growth direction for a: ${a}, b: ${b}`);
}

function isLevelvalid(level: number[]): boolean {
  const growthDirection = determineGrowthDirection(level[0], level[1]);
  if (growthDirection === Direction.ERR) return false;

  for (let i = 0; i < level.length - 1; i++) {
    if (determineGrowthDirection(level[i], level[i + 1]) !== growthDirection) {
      return false;
    }
    if (!isIncreasingGradually(level[i], level[i + 1])) {
      return false;
    }
  }
  return true;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day02/sample.txt" : "/src/days/day02/full.txt";
  let safeRows = 0;

  const levels = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.split(" ").map((sLine) => Number(sLine)));

  levels.forEach((level) => {
    if (isLevelvalid(level)) safeRows++;
  });

  return safeRows;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
