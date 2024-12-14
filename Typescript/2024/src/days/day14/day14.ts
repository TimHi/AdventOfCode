import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day14/sample.txt" : "/src/days/day14/full.txt";

  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day13/sample.txt" : "/src/days/day13/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  return 0;
}
