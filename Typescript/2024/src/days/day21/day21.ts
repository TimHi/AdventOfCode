import * as fs from "fs";
import { sum } from "lodash";

const isSample = false;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day21/sample.txt" : "/src/days/day21/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));

  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day21/sample.txt" : "/src/days/day21/full.txt";
  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));

  return 0;
}
