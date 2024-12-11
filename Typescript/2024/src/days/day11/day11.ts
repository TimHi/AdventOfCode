import { GetPointKey, Point } from "aoc-util";

import * as fs from "fs";
const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) =>
      l.split("").map((n) => {
        if (n === ".") return -100;
        else return Number(n);
      })
    );

  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) =>
      l.split("").map((n) => {
        if (n === ".") return -100;
        else return Number(n);
      })
    );

  return 0;
}
