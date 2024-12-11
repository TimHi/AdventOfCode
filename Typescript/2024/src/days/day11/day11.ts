import * as fs from "fs";
const isSample = false;

// If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
// If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
// The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
// (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
// If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.

function blink(stones: number[], n: number): number[] {
  //console.log(`Initial arrangement: ${stones.join(" ")}`);
  let copyStones = [...stones];
  for (let b = 0; b < n; b++) {
    //die klappt nicht mehr weil inserted wird
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
    //1 2024 1 0 9 9 2021976
    //1 2024 1 1 9 18216 2021976
    copyStones = newStones;
    //console.log(`After ${b + 1} blink: ${copyStones.join(" ")}`);
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

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const stones = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(" ")
    .map((l) => Number(l));

  const blinkedStones = blink(stones, isSample ? 25 : 75);
  return blinkedStones.length;
}
