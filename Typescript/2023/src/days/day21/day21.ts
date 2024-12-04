import * as fs from "fs";

import { Queue } from "data-structure-typed";
import { GetPointKey, Point } from "aoc-util";

const isSample = true;

interface GardenPosition extends Point {
  symbol: string;
}

function parseMap(input: string[][]): [Map<string, GardenPosition>, Point] {
  const gardenMap = new Map<string, GardenPosition>();
  const startPos: Point = { X: 0, Y: 0 };
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const symbol = input[y][x];
      gardenMap.set(GetPointKey({ X: x, Y: y }), { symbol: symbol, X: x, Y: y });
      if (symbol === "S") {
        startPos.X = x;
        startPos.Y = y;
      }
    }
  }
  return [gardenMap, startPos];
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day21/sample.txt" : "/src/days/day21/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  const [map, start] = parseMap(lines);
  const result = getPossibleEndpoints(map, start, lines[0].length, lines.length);
  return result;
}

function getPossibleEndpoints(map: Map<string, GardenPosition>, start: Point, xBound: number, yBound: number): number {
  const deltas: Point[] = [
    { X: 1, Y: 0 },
    { X: -1, Y: 0 },
    { X: 0, Y: 1 },
    { X: 0, Y: -1 }
  ];
  const maxSteps = isSample ? 6 : 64;
  const reachedPositions = new Set<string>();
  const Q = new Queue<string>();
  const visited = new Set<string>();
  Q.enqueue(makePointWithStepKey(start, 0));
  visited.add(makePointWithStepKey(start, 0));
  while (Q.size > 0) {
    const v: string = Q.dequeue()!;
    const [vPoint, stepsAtPoint] = getPointWithStepFromKey(v);
    if (stepsAtPoint === maxSteps) {
      reachedPositions.add(makePointWithStepKey(vPoint, stepsAtPoint));
    }
    if (stepsAtPoint === maxSteps + 1) {
      return reachedPositions.size;
    }
    deltas.forEach((delta) => {
      const nextPoint: Point = { X: vPoint.X + delta.X, Y: vPoint.Y + delta.Y };

      //Is Next Point in Map && not Wall
      if (0 <= nextPoint.X && nextPoint.X < xBound && 0 <= nextPoint.Y && nextPoint.Y < yBound) {
        if (map.get(GetPointKey(nextPoint))!.symbol !== "#") {
          const key = makePointWithStepKey(nextPoint, stepsAtPoint + 1);
          if (!visited.has(key)) {
            Q.enqueue(key);
            visited.add(key);
          }
        }
      }
    });
  }
  return -1;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function getPointWithStepFromKey(key: string): [Point, number] {
  const split = key.split(":");
  return [{ X: Number(split[0]), Y: Number(split[1]) }, Number(split[2])];
}

function makePointWithStepKey(p: Point, step: number): string {
  return `${p.X}:${p.Y}:${step}`;
}
