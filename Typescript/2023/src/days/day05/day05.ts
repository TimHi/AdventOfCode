import * as fs from "fs";
import { Almanach, parseAlamanach } from "./almanach";

const isSample = true;
const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";

const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
const almanach: Almanach = parseAlamanach(lines);
export function SolvePartOne(): number {
  const positions: number[] = [];
  almanach.seeds.forEach((seed) => {
    let intermediateResult = seed;
    almanach.fullMappings.forEach((maps) => {
      for (const map of maps) {
        if (map.sourceRangeStart <= intermediateResult && intermediateResult <= map.sourceRangeStart + map.length) {
          intermediateResult = intermediateResult + map.destinationRangeStart - map.sourceRangeStart;
          return;
        }
      }
    });
    positions.push(intermediateResult);
  });

  return Math.min(...positions);
}

export function SolvePartTwo(): number {
  let minVal = Number.MAX_VALUE;
  for (let i = 0; i < almanach.seeds.length; i = i + 2) {
    let start = almanach.seeds[i];
    const end = start + almanach.seeds[i + 1];

    while (start <= end) {
      let intermediateResult = start;
      almanach.fullMappings.forEach((maps) => {
        for (const map of maps) {
          if (map.sourceRangeStart <= intermediateResult && intermediateResult <= map.sourceRangeStart + map.length) {
            intermediateResult = intermediateResult + map.destinationRangeStart - map.sourceRangeStart;
            break;
          }
        }
      });
      if (intermediateResult < minVal) minVal = intermediateResult;
      start++;
    }
  }
  return minVal;
}
