import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const stones = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(" ")
    .map((l) => Number(l));

  const blinkedStones = Blink(0, stones, 6, new Map<string, number>());
  return blinkedStones;
}

type StonePos = {
  stone: number;
  count: number;
};

function Blink(blinkCounter: number, stones: number[], maxBlinkCounter: number, cache: Map<string, number>): number {
  if (blinkCounter === maxBlinkCounter) {
    return stones.length;
  }

  let sum = 0;

  for (const stone of stones) {
    const stonePos: StonePos = { stone, count: blinkCounter };
    const stoneKey = JSON.stringify(stonePos);

    if (cache.has(stoneKey)) {
      sum += cache.get(stoneKey)!;
      continue;
    }

    let res: number;
    if (stone === 0) {
      res = Blink(blinkCounter + 1, [1], maxBlinkCounter, cache);
    } else {
      const stoneStr = String(stone);
      if (stoneStr.length % 2 === 0) {
        const mid = stoneStr.length / 2;
        const left = Number(stoneStr.slice(0, mid));
        const right = Number(stoneStr.slice(mid));
        res = Blink(blinkCounter + 1, [left, right], maxBlinkCounter, cache);
      } else {
        res = Blink(blinkCounter + 1, [stone * 2024], maxBlinkCounter, cache);
      }
    }

    cache.set(stoneKey, res);
    sum += res;
  }

  return sum;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const stones = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(" ")
    .map((l) => Number(l));

  const blinkedStones = Blink(0, stones, isSample ? 25 : 75, new Map<string, number>());
  return blinkedStones;
}
