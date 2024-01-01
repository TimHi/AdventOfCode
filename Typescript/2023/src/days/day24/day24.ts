import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";
import { Vector } from "vector-math";

interface HailStone {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
  vector: Vector;
}

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day24/sample.txt" : "/src/days/day24/full.txt";
  const hailStones: HailStone[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const data = l.split("@");
      const pos = getAllNumbersInString(data[0]);
      const vel = getAllNumbersInString(data[1]);
      return { px: pos[0], py: pos[1], pz: pos[2], vx: vel[0], vy: vel[1], vz: vel[2], vector: new Vector(vel[0], vel[1], vel[2]) };
    });

  console.log("TBD");
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
