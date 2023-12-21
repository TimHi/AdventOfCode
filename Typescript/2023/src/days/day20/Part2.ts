import * as fs from "fs";

interface Conjection {
  id: string;
  memory: Map<string, boolean>;
  destinations: string[];
  origins: string[];
}

interface FlipFlop {
  id: string;
  state: boolean;
  destinations: string[];
  origins: string[];
}

function parseMap(isSample: boolean) {
  const fileName = isSample ? "/src/days/day20/sample.txt" : "/src/days/day20/full.txt";
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {});
}

export function CalculateNeededPresses(isSample: boolean): number {
  return 0;
}
