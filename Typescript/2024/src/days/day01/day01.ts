import { Dictionary, readSplitArrays, sumOfNumbers } from "aoc-util";
import * as fs from "fs";

const isSample = true;
const DATA_SEPERATOR = "   ";

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day01/sample1.txt" : "/src/days/day01/full.txt";
  const a: number[] = [];
  const b: number[] = [];
  const raw = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  readSplitArrays(raw, DATA_SEPERATOR, a, b);

  a.sort();
  b.sort();

  const distances: number[] = [];
  for (let i = 0; i < a.length; i++) {
    distances.push(Math.abs(a[i] - b[i]));
  }

  return sumOfNumbers(distances);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day01/sample2.txt" : "/src/days/day01/full.txt";
  const raw = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  const left: number[] = [];
  const right: number[] = [];

  readSplitArrays(raw, DATA_SEPERATOR, left, right);

  const occuranceDict: Dictionary<number, number> = {};
  let simularityScore = 0;

  left.forEach((leftNum) => {
    if (leftNum in occuranceDict) {
      const prevCalculated = occuranceDict[leftNum];
      simularityScore += prevCalculated;
    } else {
      const occurances = right.filter((rightValue) => rightValue === leftNum);
      const score = leftNum * occurances.length;
      occuranceDict[leftNum] = score;
      simularityScore += score;
    }
  });
  return simularityScore;
}
