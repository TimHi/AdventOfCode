import * as fs from "fs";
const isSample = false;

//The leftmost block is in position 0. If a block contains free space, skip it instead.
function calcChecksum(block: number[]): number {
  let checkSum = 0;
  for (let x = 0; x < block.length; x++) {
    if (!Number.isNaN(block[x])) {
      checkSum = checkSum + x * block[x];
    }
  }
  return checkSum;
}

function inflateBlocks(block: number[]): number[] {
  const inflatedBlock: number[] = [];
  for (let x = 0; x < block.length; x += 2) {
    const currentNum = x === 0 ? 0 : x / 2;
    const timesOfNum = block[x];
    const freeSpaces = block[x + 1];
    for (let t = 0; t < timesOfNum; t++) {
      inflatedBlock.push(currentNum);
    }
    for (let f = 0; f < freeSpaces; f++) {
      inflatedBlock.push(NaN);
    }
  }
  return inflatedBlock;
}

function isOnlyEmptySpaceTrailing(block: number[]): boolean {
  let isTrailing = false;
  for (let x = 0; x < block.length; x++) {
    if (!Number.isNaN(block[x]) && isTrailing) {
      return false;
    }
    if (Number.isNaN(block[x])) {
      isTrailing = true;
    }
  }
  return isTrailing;
}
function moveAmiphodeAsBlock(block: number[]): number[] {
  const inflatedArray = inflateBlocks(block);
}

function moveAmiphode(block: number[]): number[] {
  const inflatedArray = inflateBlocks(block);
  for (let x = block.length - 1; x > 0; x -= 2) {
    if (isOnlyEmptySpaceTrailing(inflatedArray)) {
      return inflatedArray;
    }
    const currentNum = x === 0 ? 0 : x / 2;
    const timesOfNum = block[x];
    const remove = inflatedArray.findIndex((n) => n === currentNum);
    if (remove === -1) throw new Error("WTF?");
    for (let t = 0; t < timesOfNum; t++) {
      //Find the first free space
      const freeSpace = inflatedArray.findIndex((n) => Number.isNaN(n));
      if (freeSpace === -1) {
        console.log("Well fuck what now");
      } else {
        inflatedArray.splice(remove + t, 1, NaN);
        inflatedArray.splice(freeSpace, 1, currentNum);
      }
    }
  }

  return inflatedArray;
}

export function SolvePartOne(): number {
  const startTime = performance.now();

  const fileName = isSample ? "/src/days/day09/sample.txt" : "/src/days/day09/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("")
    .map((l) => Number(l));

  const blockWithMovedAmiphode = moveAmiphode(lines);
  const checkSum = calcChecksum(blockWithMovedAmiphode);
  const endTime = performance.now();

  console.log(`P1 ${(endTime - startTime) / 1000} s`);
  return checkSum;
}

export function SolvePartTwo(): number {
  const startTime = performance.now();

  const fileName = isSample ? "/src/days/day09/sample.txt" : "/src/days/day09/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("")
    .map((l) => Number(l));

  const blockWithMovedAmiphode = moveAmiphodeAsBlock(lines);
  const checkSum = calcChecksum(blockWithMovedAmiphode);
  const endTime = performance.now();

  console.log(`P2 ${(endTime - startTime) / 1000} s`);
  return checkSum;
}

function printResult(holyShitLargeArray: number[]) {
  let result = "";
  holyShitLargeArray.forEach((n) => {
    if (!Number.isNaN(n)) {
      result += String(n);
    } else {
      result += ".";
    }
  });
  console.log(result);
}
