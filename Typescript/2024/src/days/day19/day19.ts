import { getAllNumbersInString, Point } from "aoc-util";
import * as fs from "fs";

const isSample = true;


export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const points: Point[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      return { X: nums[0], Y: nums[1] };
    });
  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const points: Point[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      return { X: nums[0], Y: nums[1] };
    });
  return 0;
}
