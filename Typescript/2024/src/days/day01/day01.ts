import * as fs from "fs";
import { sumOfNumbers } from "../../util/array";

const isSample = false;

function readSplitArrays(raw: string[], a: number[], b: number[]) {
  return raw.forEach((line) => {
    const splitIDs = line.split("   ");
    a.push(Number(splitIDs[0]));
    b.push(Number(splitIDs[1]));
  });
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day01/sample1.txt" : "/src/days/day01/full.txt";
  const a: number[] = [];
  const b: number[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      const splitIDs = line.split("   ");
      a.push(Number(splitIDs[0]));
      b.push(Number(splitIDs[1]));
    });

  a.sort();
  b.sort();

  const distances: number[] = [];
  for (let i = 0; i < a.length; i++) {
    distances.push(Math.abs(a[i] - b[i]));
  }

  return sumOfNumbers(distances);
}

export function SolvePartTwo(): number {
  //const fileName = isSample ? "/src/days/day01/sample2.txt" : "/src/days/day01/full.txt";
  //const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  return 0;
}
