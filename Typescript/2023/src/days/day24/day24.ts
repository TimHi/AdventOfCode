import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day24/sample.txt" : "/src/days/day24/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  console.log("TBD");
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
