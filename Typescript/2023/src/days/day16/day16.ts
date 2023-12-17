import * as fs from "fs";
import { DirectedPoint, Direction, GetDirectedPointKey, GetPointKey } from "../../util/coords";
import { Queue } from "data-structure-typed";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  const grid = extendGrid(lines);

  const energizedMap = traverseGrid(grid, { direction: Direction.E, X: 1, Y: 1 });
  return countEnergizedFields(energizedMap);
}

function countEnergizedFields(energizedMap: Map<string, number>): number {
  const uniquePoints: string[] = [];
  energizedMap.forEach((v, k) => {
    const point = k.split("-")[0];
    if (!uniquePoints.includes(point)) uniquePoints.push(point);
  });

  return uniquePoints.length;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  const grid = extendGrid(lines);
  let highestEnergizedConfig = 0;
  for (let y = 1; y < grid.length; y++) {
    let energizedMap = traverseGrid(grid, { direction: Direction.E, X: 1, Y: y });
    let result = countEnergizedFields(energizedMap);
    if (result > highestEnergizedConfig) {
      highestEnergizedConfig = result;
    }

    energizedMap = traverseGrid(grid, { direction: Direction.W, X: grid[0].length - 1, Y: y });
    result = countEnergizedFields(energizedMap);
    if (result > highestEnergizedConfig) {
      highestEnergizedConfig = result;
    }
  }
  for (let x = 1; x < grid[0].length; x++) {
    let energizedMap = traverseGrid(grid, { direction: Direction.S, X: x, Y: 1 });
    let result = countEnergizedFields(energizedMap);
    if (result > highestEnergizedConfig) {
      highestEnergizedConfig = result;
    }

    energizedMap = traverseGrid(grid, { direction: Direction.N, X: x, Y: grid.length - 1 });
    result = countEnergizedFields(energizedMap);
    if (result > highestEnergizedConfig) {
      highestEnergizedConfig = result;
    }
  }
  return highestEnergizedConfig;
}

function traverseGrid(grid: string[][], start: DirectedPoint): Map<string, number> {
  const S: Queue<DirectedPoint> = new Queue<DirectedPoint>();
  const energizedPositions = new Map<string, number>();

  S.push(start);
  while (!S.isEmpty()) {
    const w = S.dequeue();
    if (w !== undefined) {
      const beamSymbol = grid[w.Y][w.X];
      const wVisited = energizedPositions.has(GetDirectedPointKey(w));
      if (beamSymbol !== "X" && !wVisited) {
        const ePos = energizedPositions.get(GetDirectedPointKey(w));
        if (ePos === undefined) energizedPositions.set(GetDirectedPointKey(w), 1);
        else energizedPositions.set(GetDirectedPointKey(w), ePos + 1);
        const nextPost = getNextPos(w, beamSymbol);
        if (nextPost !== undefined) {
          nextPost.forEach((p) => S.push(p));
        }
      }
    } else {
      S.shift();
    }
  }
  return energizedPositions;
}

//Hope this works lol
function getNextPos(beam: DirectedPoint, symbol: string): DirectedPoint[] | undefined {
  if (symbol === ".") {
    if (beam.direction == Direction.N) {
      return [{ direction: Direction.N, X: beam.X, Y: beam.Y - 1 }];
    }
    if (beam.direction == Direction.E) {
      return [{ direction: Direction.E, X: beam.X + 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.S) {
      return [{ direction: Direction.S, X: beam.X, Y: beam.Y + 1 }];
    }
    if (beam.direction == Direction.W) {
      return [{ direction: Direction.W, X: beam.X - 1, Y: beam.Y }];
    }
  }
  if (symbol === "|") {
    if (beam.direction == Direction.N) {
      return [{ direction: Direction.N, X: beam.X, Y: beam.Y - 1 }];
    }
    if (beam.direction == Direction.E || beam.direction == Direction.W) {
      return [
        { direction: Direction.N, X: beam.X, Y: beam.Y - 1 },
        { direction: Direction.S, X: beam.X, Y: beam.Y + 1 }
      ];
    }
    if (beam.direction == Direction.S) {
      return [{ direction: Direction.S, X: beam.X, Y: beam.Y + 1 }];
    }
  }
  if (symbol === "-") {
    if (beam.direction == Direction.N || beam.direction === Direction.S) {
      return [
        { direction: Direction.E, X: beam.X + 1, Y: beam.Y },
        { direction: Direction.W, X: beam.X - 1, Y: beam.Y }
      ];
    }
    if (beam.direction == Direction.E) {
      return [{ direction: Direction.E, X: beam.X + 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.W) {
      return [{ direction: Direction.W, X: beam.X - 1, Y: beam.Y }];
    }
  }
  if (symbol === "\\") {
    if (beam.direction == Direction.N) {
      return [{ direction: Direction.W, X: beam.X - 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.E) {
      return [{ direction: Direction.S, X: beam.X, Y: beam.Y + 1 }];
    }
    if (beam.direction == Direction.S) {
      return [{ direction: Direction.E, X: beam.X + 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.W) {
      return [{ direction: Direction.N, X: beam.X, Y: beam.Y - 1 }];
    }
  }
  if (symbol === "/") {
    if (beam.direction == Direction.N) {
      return [{ direction: Direction.E, X: beam.X + 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.E) {
      return [{ direction: Direction.N, X: beam.X, Y: beam.Y - 1 }];
    }
    if (beam.direction == Direction.S) {
      return [{ direction: Direction.W, X: beam.X - 1, Y: beam.Y }];
    }
    if (beam.direction == Direction.W) {
      return [{ direction: Direction.S, X: beam.X, Y: beam.Y + 1 }];
    }
  }
  if (symbol === "X") {
    return undefined;
  }
  throw new Error("Unkown Symbol");
}

function extendGrid(grid: string[][]): string[][] {
  const newLine: string[] = [];
  for (let x = 0; x < grid[0].length; x++) {
    newLine.push("X");
  }
  grid.splice(0, 0, newLine);
  for (let y = 0; y < grid.length; y++) {
    grid[y].splice(0, 0, "X");
    grid[y].push("X");
  }
  grid.push(newLine);
  return grid;
}

function printGrid(grid: string[][], eMap: Map<string, number>) {
  grid.forEach((l, y) => {
    let row = "";

    l.forEach((r, x) => {
      const ePos = eMap.get(GetPointKey({ X: x, Y: y }));
      if (ePos !== undefined) row += "#";
      else row += ".";
    });
    console.log(row);
  });
}
