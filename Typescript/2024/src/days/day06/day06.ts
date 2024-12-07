import { DirectedPoint, Direction, GetNeighbour, Point } from "aoc-util";
import * as fs from "fs";

const isSample = false;

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

function moveStepInDirection(currentPosition: DirectedPoint): DirectedPoint {
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

function GetNextPos(x: number, y: number, direction: Direction): DirectedPoint | undefined {
  switch (direction) {
    case Direction.N:
      return { X: x, Y: y - 1, direction: direction };
    case Direction.E:
      return { X: x + 1, Y: y, direction: direction };
    case Direction.S:
      return { X: x, Y: y - 1, direction: direction };
    case Direction.W:
      return { X: x - 1, Y: y, direction: direction };
    case Direction.NE:
      throw new Error("Not needed yet");
    case Direction.SE:
      throw new Error("Not needed yet");
    case Direction.SW:
      throw new Error("Not needed yet");
    case Direction.NW:
      throw new Error("Not needed yet");
  }
}

function hitsWallNextStep(currentPosition: DirectedPoint, map: string[][]): boolean {
  const nextSymbol = GetNeighbour(currentPosition.X, currentPosition.Y, currentPosition.direction, map);
  const hitsWall = nextSymbol !== undefined && nextSymbol == "#";

  return hitsWall;
}

function isValidPosition(pos: DirectedPoint, map: string[][]): boolean {
  if (hitsWallNextStep(pos, map)) return false;
  else return true;
}

function move(currentPosition: DirectedPoint, map: string[][]): DirectedPoint {
  const tPos = { ...currentPosition };

  if (hitsWallNextStep(tPos, map)) {
    while (!isValidPosition(tPos, map)) {
      tPos.direction = get90DegRight(tPos.direction);
    }
  }
  return moveStepInDirection(tPos);
}
let GUARD_PATH: Set<Point>;
export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day06/sample.txt" : "/src/days/day06/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  let currentPosition = getStartPosition(lines);
  const positionsVisited: Set<Point> = new Set();
  positionsVisited.add(currentPosition);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    currentPosition = move(currentPosition, lines);
    if (currentPosition.X < 0 || currentPosition.X >= lines[0].length || currentPosition.Y < 0 || currentPosition.Y >= lines.length) break;
    else {
      if (!setHasKey(currentPosition, positionsVisited)) {
        positionsVisited.add({ X: currentPosition.X, Y: currentPosition.Y });
      }
    }
  }
  GUARD_PATH = positionsVisited;
  return positionsVisited.size;
}

function setHasKey(t: Point, positionsVisited: Set<Point>): boolean {
  let hasKey = false;
  positionsVisited.forEach((p) => {
    if (p.X === t.X && p.Y === t.Y) hasKey = true;
  });
  return hasKey;
}

function setHasKeyDir(t: DirectedPoint, positionsVisited: Set<DirectedPoint>): boolean {
  let hasKey = false;
  positionsVisited.forEach((p) => {
    if (p.X === t.X && p.Y === t.Y && p.direction === t.direction) hasKey = true;
  });
  return hasKey;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day06/sample.txt" : "/src/days/day06/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const possibleObstacles: Point[] = [];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === "." && setHasKey({ X: x, Y: y }, GUARD_PATH)) {
        possibleObstacles.push({ X: x, Y: y });
      }
    }
  }

  let loopsFound = 0;

  possibleObstacles.forEach((l, i) => {
    const tMap = JSON.parse(JSON.stringify(lines));
    tMap[l.Y][l.X] = "#";
    let currentPosition = getStartPosition(lines);
    const positionsVisited: Set<Point> = new Set();
    const loopFinder: Set<DirectedPoint> = new Set();
    positionsVisited.add(currentPosition);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      currentPosition = move(currentPosition, tMap);
      if (setHasKeyDir(currentPosition, loopFinder)) {
        loopsFound++;
        return;
      }
      if (currentPosition.X < 0 || currentPosition.X >= lines[0].length || currentPosition.Y < 0 || currentPosition.Y >= lines.length) {
        return;
      }
      if (!setHasKey(currentPosition, positionsVisited)) {
        positionsVisited.add({ X: currentPosition.X, Y: currentPosition.Y });
      }
      loopFinder.add(currentPosition);
    }
  });
  return loopsFound;
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
