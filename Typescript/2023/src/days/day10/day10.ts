import * as fs from "fs";
function parsePipes() {
  const isSample = true;
  const fileName = isSample ? "/src/days/day10/sample2.txt" : "/src/days/day10/full.txt";
  const pipes = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  return pipes;
}

export function SolvePartOne(): number {
  const pipes = parsePipes();
  return 0;
}

export function SolvePartTwo(): number {
  return 0;
}
