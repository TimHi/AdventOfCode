import * as fs from "fs";
const isSample = false;

function blink(stones: number[], n: number): number[] {
  let copyStones = [...stones];
  for (let b = 0; b < n; b++) {
    let insertCounter = 0;
    const newStones: number[] = [...copyStones];
    for (let s = 0; s < copyStones.length; s++) {
      const stone = copyStones[s];
      // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
      if (stone === 0) {
        newStones[s + insertCounter] = 1;
      }
      // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
      // The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
      // (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
      else if (String(stone).length % 2 === 0) {
        const stringStone = String(stone);
        const left = stringStone.slice(0, Math.floor(stringStone.length / 2));
        const right = stringStone.slice(Math.floor(stringStone.length / 2), stringStone.length);
        newStones[s + insertCounter] = Number(left);
        newStones.splice(s + 1 + insertCounter, 0, Number(right));
        insertCounter++;
      }
      // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
      else {
        newStones[s + insertCounter] *= 2024;
      }
    }

    copyStones = newStones;
  }
  return copyStones;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const stones = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(" ")
    .map((l) => Number(l));

  const blinkedStones = blink(stones, isSample ? 25 : 25);
  return blinkedStones.length;
}

function makeKey(nums: number[]): string {
  return nums.join(" ");
}

function getFromKey(nums: string): number[] {
  return nums.split(" ").map((l) => Number(l));
}

function calcNumber(stone: number): number[] {
  // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
  if (stone === 0) {
    return [1];
  }
  // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
  // The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
  // (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
  else if (String(stone).length % 2 === 0) {
    const stringStone = String(stone);
    const left = stringStone.slice(0, Math.floor(stringStone.length / 2));
    const right = stringStone.slice(Math.floor(stringStone.length / 2), stringStone.length);
    return [Number(left), Number(right)];
  }
  // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
  else {
    return [stone * 2024];
  }
  throw new Error("Unable to handle number");
}

function blinkSmart(stones: number[], n: number): number {
  let copyStones = [...stones];
  const numMap = new Map<string, number[]>();
  for (let b = 0; b < n; b++) {
    let insertCounter = 0;
    let cacheHit = false;
    const newStones: number[] = [...copyStones];
    for (let s = 0; s < copyStones.length; s++) {
      const stone = copyStones[s];
      const key = makeKey(newStones);
      const cachedValue = numMap.get(key);
      if (cachedValue === undefined) {
        const calcedValue = calcNumber(stone);
        newStones[s + insertCounter] = calcedValue[0];
        if (calcedValue.length === 2) {
          newStones.splice(s + 1 + insertCounter, 0, calcedValue[1]);
          insertCounter++;
        }
      } else {
        cacheHit = true;
        newStones.splice(s + 1 + insertCounter, cachedValue.length, ...cachedValue);
      }
    }
    if (!cacheHit) {
      numMap.set(makeKey(copyStones), newStones);
    }
    copyStones = newStones;
  }
  return copyStones.length;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const stones = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(" ")
    .map((l) => Number(l));

  const blinkedStones = blinkSmart(stones, isSample ? 25 : 75);
  return blinkedStones;
}
