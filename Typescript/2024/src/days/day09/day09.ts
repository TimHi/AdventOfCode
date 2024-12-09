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

function getFileBlockToMove(alreadyTriedToMoveIDsThatDidNotFitIntoTheGapOfEmptyBlocks: number[], inflatedArray: number[]): number[] {
  let block: number[] = [];
  const blocks: number[][] = [];

  let currentBlockNumber = Number.isNaN(inflatedArray[inflatedArray.length - 1]) ? -1 : inflatedArray[inflatedArray.length - 1];

  for (let x = inflatedArray.length - 1; x >= 0; x--) {
    const c = inflatedArray[x];

    if (!Number.isNaN(c) && c === currentBlockNumber) {
      block.push(c);
    } else {
      blocks.push(block);
      block = [];
      currentBlockNumber = -1;
    }
    if (!Number.isNaN(c) && currentBlockNumber === -1) {
      currentBlockNumber = c;
      block.push(c);
    }
  }
  const blocksNoEmpty = blocks.filter((b) => b.length > 0);
  const blocksNoAlreadyUsed = blocksNoEmpty.filter((b) => !alreadyTriedToMoveIDsThatDidNotFitIntoTheGapOfEmptyBlocks.includes(b[0]));
  if (blocksNoAlreadyUsed.length > 0) {
    return blocksNoAlreadyUsed[0];
  } else return [];
}

function moveAmiphodeAsBlock(block: number[]): number[] {
  const inflatedArray = inflateBlocks(block);
  const alreadyTriedBlocks: number[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const nextBlockToInsert: number[] = getFileBlockToMove(alreadyTriedBlocks, inflatedArray);

    //We tested all locations and the inserted blocks should be placed
    if (nextBlockToInsert.length === 0) break;
    //Mark blog as tried
    alreadyTriedBlocks.push(nextBlockToInsert[0]);
    const spaceNeededToInsertTheBlock = nextBlockToInsert.length;
    let start = -1;
    let end = -1;

    for (let f = 0; f < inflatedArray.length; f++) {
      const currentValue = inflatedArray[f];

      if (Number.isNaN(currentValue)) {
        if (start === -1) {
          start = f;
        }
      }

      if (!Number.isNaN(currentValue)) {
        //Start was set and end is found
        if (start !== -1) {
          end = f;
        }

        if (end - start >= spaceNeededToInsertTheBlock) {
          const removeIndex = inflatedArray.findIndex((n) => n === nextBlockToInsert[0]);
          if (removeIndex < start) {
            break;
          }
          const NaNs: number[] = [];
          for (let t = 0; t < spaceNeededToInsertTheBlock; t++) {
            NaNs.push(NaN);
          }

          inflatedArray.splice(removeIndex, spaceNeededToInsertTheBlock, ...NaNs);
          inflatedArray.splice(start, spaceNeededToInsertTheBlock, ...nextBlockToInsert);

          break;
        }

        start = -1;
        end = -1;
      }
    }
  }

  return inflatedArray;
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
