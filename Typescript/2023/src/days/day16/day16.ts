import * as fs from "fs";
import { GetPointKey, Point } from "../../util/coords";
import { Queue } from "data-structure-typed";

const isSample = false;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  const grid = extendGrid(lines);

  const energizedMap = traverseGrid(grid);
  // printGrid(grid, energizedMap);
  return energizedMap.size;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

enum Direction {
  N = "North",
  E = "East",
  S = "South",
  W = "West"
}

interface Beam extends Point {
  direction: Direction;
}

function traverseGrid(grid: string[][]): Map<string, number> {
  const S: Queue<Beam> = new Queue<Beam>();
  const energizedPositions = new Map<string, number>();
  let lolz = 0;
  S.push({ direction: Direction.E, X: 1, Y: 1 });
  while (!S.isEmpty()) {
    //console.log("\n");
    //printGrid(grid, energizedPositions);
    //TODO: Take direction into account?
    if (lolz === 500000000) return energizedPositions;
    const w = S.dequeue();

    if (w !== undefined) {
      const beamSymbol = grid[w.Y][w.X];
      if (beamSymbol !== "X") {
        //Keep track of energized Positions
        const ePos = energizedPositions.get(GetPointKey(w));
        if (ePos === undefined) energizedPositions.set(GetPointKey(w), 1);
        else energizedPositions.set(GetPointKey(w), ePos + 1);
        const nextPost = getNextPos(w, beamSymbol);
        if (nextPost !== undefined) {
          nextPost.forEach((p) => S.push(p));
        }
      }
    } else {
      S.shift();
    }
    lolz++;
  }
  return energizedPositions;
}

//Hope this works lol
function getNextPos(beam: Beam, symbol: string): Beam[] | undefined {
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
