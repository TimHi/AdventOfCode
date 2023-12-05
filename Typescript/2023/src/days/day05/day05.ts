import * as fs from "fs";
import { Almanach, parseAlamanach } from "./almanach";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";

  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  const almanach: Almanach = parseAlamanach(lines);

  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
