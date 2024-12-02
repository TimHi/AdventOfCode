import * as fs from "fs";

const isSample = true;

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

function isLevelvalidWithDampener(level: number[]): boolean {
  const growthDirection = determineGrowthDirection(level[0], level[1]);
  let unsafeValueIndex = -1;
  if (growthDirection === Direction.ERR) unsafeValueIndex = 0;

  //No Error yet, continue checking
  if (unsafeValueIndex === -1) {
    for (let i = 0; i < level.length - 1; i++) {
      if (determineGrowthDirection(level[i], level[i + 1]) !== growthDirection) {
        unsafeValueIndex = i;
        break;
      }
      if (!isIncreasingGradually(level[i], level[i + 1])) {
        unsafeValueIndex = i;
        break;
      }
    }
  }

  //Test wether a unsafe location was found, remove the unsafe location and throw that shit in Part 01
  if (unsafeValueIndex !== -1) {
    const aLevel = [...level];
    const cLevel = [...level];
    const dLevel = [...level];
    if (unsafeValueIndex > 0) {
      cLevel.splice(unsafeValueIndex - 1, 1);
    }
    dLevel.splice(unsafeValueIndex + 1, 1);
    aLevel.splice(unsafeValueIndex, 1);

    return isLevelvalid(aLevel) || isLevelvalid(cLevel) || isLevelvalid(dLevel);
  } else {
    return true;
  }
}

function parseInput(raw: string): number[][] {
  return raw.split("\n").map((line) => line.split(" ").map((sLine) => Number(sLine)));
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day02/sample.txt" : "/src/days/day02/full.txt";
  let safeRows = 0;

  const levels = parseInput(fs.readFileSync(process.cwd() + fileName, "utf8"));

  levels.forEach((level) => {
    if (isLevelvalid(level)) safeRows++;
  });

  return safeRows;
}

export function SolvePartTwo(): number {
  let safeRows = 0;
  const fileName = isSample ? "/src/days/day02/sample.txt" : "/src/days/day02/full.txt";
  const levels = parseInput(fs.readFileSync(process.cwd() + fileName, "utf8"));

  levels.forEach((level) => {
    if (isLevelvalidWithDampener(level)) safeRows++;
  });

  return safeRows;
}
