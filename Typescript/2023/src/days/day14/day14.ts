import * as fs from "fs";

import { rotateLeft, rotateRight } from "../../util/array";

const isSample = true;

function parseStoneMap() {
  const fileName = isSample ? "/src/days/day14/sample.txt" : "/src/days/day14/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  return lines;
}

export function SolvePartOne(): number {
  const field = parseStoneMap();
  const tilted = rotateLeft(tilt(rotateRight(field)));
  return calculateLoad(tilted);
}

export function SolvePartTwo(): number {
  const field: string[] = parseStoneMap();
  const result = cycleN(field, 1000000000);
  return calculateLoad(result);
}

function cycleN(field: string[], times: number): string[] {
  let east = [...field];
  const collision = new Map<string, number>();
  for (let i = 0; i < times; i++) {
    const north = rotateLeft(tilt(rotateRight(east)));
    const west = rotateRight(rotateRight(tilt(rotateLeft(rotateLeft(north)))));
    const south = rotateRight(tilt(rotateLeft(west)));
    east = tilt(south);
    const col = collision.get(hashGrid(east));
    if (col !== undefined) {
      const loopOrigin = collision.get(hashGrid(east));
      const loopLength = i - loopOrigin!;
      const remaining = 1000000000 - 1 - i;
      const remainingIterations = remaining % loopLength;
      for (let i = 0; i < remainingIterations; i++) {
        const north = rotateLeft(tilt(rotateRight(east)));
        const west = rotateRight(rotateRight(tilt(rotateLeft(rotateLeft(north)))));
        const south = rotateRight(tilt(rotateLeft(west)));
        east = tilt(south);
      }
      return east;
    }

    collision.set(hashGrid([...east]), i);
  }
  return east;
}
function hashGrid(grid: string[]): string {
  return grid.join(",");
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
