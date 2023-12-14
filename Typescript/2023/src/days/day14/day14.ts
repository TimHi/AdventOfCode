import * as fs from "fs";
import _ from "lodash";
import { rotateLeft, rotateRight } from "../../util/array";

const isSample = false;

function parseStoneMap() {
  const fileName = isSample ? "/src/days/day14/sample.txt" : "/src/days/day14/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  return lines;
}

export function SolvePartOne(): number {
  const field = parseStoneMap();
  const tilted = rotateLeft(tilt(rotateRight(field)));
  const loadNorth = calculateLoad(tilted);
  return loadNorth;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function calculateLoad(field: string[]): number {
  let load = 0;
  field.reverse().forEach((l, i) => {
    const foundRockInLine = l.split("").filter((v) => v === "O");
    load = load + foundRockInLine.length * (i + 1);
  });
  return load;
}

function tilt(field: string[]): string[] {
  const tiltedTowers: string[] = [];
  for (let y = 0; y < field.length; y++) {
    let loop = true;
    let replaced = field[y].replaceAll("O.", ".O");
    while (loop) {
      replaced = replaced.replaceAll("O.", ".O");
      loop = replaced.includes("O.");
    }

    tiltedTowers.push(replaced);
  }

  return tiltedTowers;
}
