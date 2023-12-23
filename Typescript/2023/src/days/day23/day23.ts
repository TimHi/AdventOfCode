import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day23/sample.txt" : "/src/days/day23/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  console.log("TBD2");
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD2");
  return 0;
}
