import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  return 0;
}

export function SolvePartTwo(): number {
  return 0;
}
