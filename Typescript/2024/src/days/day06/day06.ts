import { DirectedPoint, Direction, GetNeighbour, Point } from "aoc-util";
import * as fs from "fs";

const isSample = true;

// If there is something directly in front of you, turn right 90 degrees.
// Otherwise, take a step forward.

function getStartPosition(map: string[][]): DirectedPoint {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "^") return { X: x, Y: y, direction: Direction.N };
    }
  }
  throw new Error("Start not found");
}

function move(currentPosition: DirectedPoint, map: string[][]): DirectedPoint {
  const nextPoint: DirectedPoint = { X: -1, Y: -1, direction: Direction.E };
  const nextSymbol = GetNeighbour(currentPosition.X, currentPosition.Y, currentPosition.direction, map);
  //If no symbol is found we are out of bounds, return dummy value
  if (nextSymbol === undefined) {
    return nextPoint;
  }
  if (nextSymbol === "#") {
    currentPosition.direction = get90DegRight(currentPosition.direction);
  }
  switch (currentPosition.direction) {
    case Direction.N:
      return { ...currentPosition, Y: currentPosition.Y - 1 };
    case Direction.E:
      return { ...currentPosition, X: currentPosition.X + 1 };
    case Direction.S:
      return { ...currentPosition, Y: currentPosition.Y + 1 };
    case Direction.W:
      return { ...currentPosition, X: currentPosition.X - 1 };
    case Direction.NE:
      throw new Error("Only N, S, W, E supported");
    case Direction.SE:
      throw new Error("Only N, S, W, E supported");
    case Direction.SW:
      throw new Error("Only N, S, W, E supported");
    case Direction.NW:
      throw new Error("Only N, S, W, E supported");
  }
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day06/sample.txt" : "/src/days/day06/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  let currentPosition = getStartPosition(lines);
  const positionsVisited: Set<Point> = new Set();
  while (true) {
    currentPosition = move(currentPosition, lines);
    if (currentPosition.X < 0 || currentPosition.X > lines[0].length || currentPosition.Y < 0 || currentPosition.Y > lines.length) break;
    else {
      if (!setHasKey(currentPosition, positionsVisited)) positionsVisited.add({ X: currentPosition.X, Y: currentPosition.Y });
    }
  }
  //printMap(lines, positionsVisited);
  return positionsVisited.size;
}

function setHasKey(t: Point, positionsVisited: Set<Point>): boolean {
  let hasKey = false;
  positionsVisited.forEach((p) => {
    if (p.X === t.X && p.Y === t.Y) hasKey = true;
  });
  return hasKey;
}

function printMap(map: string[][], positionsVisited: Set<Point>) {
  for (let y = 0; y < map.length; y++) {
    let row = "";
    for (let x = 0; x < map[0].length; x++) {
      if (setHasKey({ X: x, Y: y }, positionsVisited)) {
        row += "X";
      } else {
        row += map[y][x];
      }
    }
    console.log(row);
  }
}

export function SolvePartTwo(): number {
  return 0;
}

function get90DegRight(direction: Direction): Direction {
  switch (direction) {
    case Direction.N:
      return Direction.E;
    case Direction.E:
      return Direction.S;
    case Direction.S:
      return Direction.W;
    case Direction.W:
      return Direction.N;
    case Direction.NE:
      throw new Error("Only N, S, W, E supported");
    case Direction.SE:
      throw new Error("Only N, S, W, E supported");
    case Direction.SW:
      throw new Error("Only N, S, W, E supported");
    case Direction.NW:
      throw new Error("Only N, S, W, E supported");
  }
}
