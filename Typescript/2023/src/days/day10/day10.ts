import * as fs from "fs";
import { Point } from "../../util/coords";
import { DirectedGraph, UndirectedGraph } from "data-structure-typed";

interface PipePosition {
  currentCoordinate: Point;
  pipe: string;
}

function parsePipes() {
  const isSample = true;
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const pipes = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  return pipes;
}

export function SolvePartOne(): number {
  const pipes = parsePipes();
  const pipeMap: PipePosition[][] = [];
  const startPosition: Point = { X: 0, Y: 0 };
  const graph = new UndirectedGraph<string>();
  const symbolMap = new Map<Point, string>();
  const pipeSymbols = ["|", "-", "L", "J", "7", "F", ".", "S"];
  const groundMap: Point[] = [];
  pipes.forEach((y, yIndex) => {
    y.forEach((x, xIndex) => {
      const coord: Point = { X: xIndex, Y: yIndex };
      if (x === ".") groundMap.push(coord);
      symbolMap.set(coord, x);
    });
  });

  pipes.forEach((y, yIndex) => {
    const translatedRow: PipePosition[] = [];
    y.forEach((x, xIndex) => {
      const coord: Point = { X: xIndex, Y: yIndex };
      translatedRow.push({ currentCoordinate: coord, pipe: x });
      if (x === "S") {
        startPosition.X = coord.X;
        startPosition.Y = coord.Y;
      }
      if (!isGround(coord, groundMap)) graph.addVertex(getNodeKey(coord));
    });
    pipeMap.push(translatedRow);
  });

  pipes.forEach((y, yIndex) => {
    y.forEach((x, xIndex) => {
      const coord: Point = { X: xIndex, Y: yIndex };
      if (!isGround(coord, groundMap)) {
        console.log("Getting Edges for: " + coord.X + ":" + coord.Y);
        const edges = getEdges(x, coord, y.length, pipes.length);
        edges.forEach((e) => {
          if (!isGround(e, groundMap)) {
            if (hasConnection(coord, e, symbolMap)) {
              console.log("Adding Edge from: " + coord.X + ":" + coord.Y + " to: " + e.X + ":" + e.Y);
              graph.addEdge(getNodeKey(coord), getNodeKey(e));
              // if (!graph.hasEdge(getNodeKey(coord), getNodeKey(e))) {
              //   console.log("Adding Edge from: " + coord.X + ":" + coord.Y + " to: " + e.X + ":" + e.Y);
              //   graph.addEdge(getNodeKey(coord), getNodeKey(e));
              // } else {
              //   console.log("AAl");
              // }
            }
          }
        });
      }
    });
  });

  const c = graph.tarjan(undefined, undefined, undefined, true);

  const cy = graph.getCycles();
  cy.forEach((c, k) => {
    console.log(c);
    console.log(k);
  });
  const bF = graph.bellmanFord(getNodeKey({ X: 1, Y: 1 }));
  bF.distMap.forEach((v, k) => {
    console.log(k.key + " away: " + v);
  });
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function isGround(coord: Point, ground: Point[]): boolean {
  const found = ground.find((v) => v.X === coord.X && v.Y === coord.Y);
  return found !== undefined;
}

function getEdges(symbol: string, coord: Point, maxX: number, maxY: number): Point[] {
  const directions: Point[] = [];
  if (coord.X === 3 && coord.Y === 3) {
    console.log("Aal");
  }
  const north: Point = { X: coord.X, Y: coord.Y - 1 };
  const south: Point = { X: coord.X, Y: coord.Y + 1 };
  const east: Point = { X: coord.X + 1, Y: coord.Y };
  const west: Point = { X: coord.X - 1, Y: coord.Y };
  switch (symbol) {
    case "|": // | is a vertical pipe connecting north and south.
      if (isInMap(north, maxX, maxY)) directions.push(north);
      if (isInMap(south, maxX, maxY)) directions.push(south);
      break;
    case "-": // - is a horizontal pipe connecting east and west.
      if (isInMap(east, maxX, maxY)) directions.push(east);
      if (isInMap(west, maxX, maxY)) directions.push(west);
      break;
    case "L": // L is a 90-degree bend connecting north and east.
      if (isInMap(east, maxX, maxY)) directions.push(east);
      if (isInMap(north, maxX, maxY)) directions.push(north);
      break;
    case "J": // J is a 90-degree bend connecting north and west.
      if (isInMap(west, maxX, maxY)) directions.push(west);
      if (isInMap(north, maxX, maxY)) directions.push(north);
      break;
    case "7": // 7 is a 90-degree bend connecting south and west.
      if (isInMap(west, maxX, maxY)) directions.push(west);
      if (isInMap(south, maxX, maxY)) directions.push(south);
      break;
    case "F": // F is a 90-degree bend connecting south and east.
      if (isInMap(east, maxX, maxY)) directions.push(east);
      if (isInMap(south, maxX, maxY)) directions.push(south);
      break;
  }
  return directions;
}

function isInMap(coord: Point, maxX: number, maxY: number) {
  if (0 <= coord.X && coord.X < maxX && 0 <= coord.Y && coord.Y < maxY) return true;
  else return false;
}

function getNodeKey(point: Point) {
  return point.X.toString() + ":" + point.Y.toString();
}
function hasConnection(coord: Point, edge: Point, symbolMap: Map<Point, string>): boolean {
  let current = ".";
  let next = ".";
  symbolMap.forEach((v, k) => {
    if (coord.X === k.X && coord.Y === k.Y) current = v;
    if (edge.X === k.X && edge.Y === k.Y) next = v;
  });
  if (current === ".") throw new Error("Wtf currently on ground?");
  if (next === ".") throw new Error("No next tile found, this should not happen");
  const direction = getDirection(coord, edge);
  switch (direction) {
    case Direction.North:
      return isNorthPossible(current, next);
    case Direction.South:
      return isSouthPossible(current, next);
    case Direction.West:
      return isWestPossible(current, next);
    case Direction.East:
      return isEastPossible(current, next);
    default:
      console.log("FUCK ");
      return false;
  }
}

enum Direction {
  North = "NORTH",
  South = "SOUTH",
  West = "WEST",
  East = "EAST"
}
function getDirection(current: Point, next: Point): Direction {
  const xDiff = next.X - current.X;
  const yDiff = next.Y - current.Y;

  if (xDiff === 1 && yDiff === 0) {
    return Direction.East;
  } else if (xDiff === -1 && yDiff === 0) {
    return Direction.West;
  } else if (xDiff === 0 && yDiff === 1) {
    return Direction.South;
  } else if (xDiff === 0 && yDiff === -1) {
    return Direction.North;
  } else {
    throw new Error("Source the same as destination, shouldnt happen");
  }
}

function isNorthPossible(current: string, next: string): boolean {
  if (current === "|") {
    if (next === "|") return true;
    if (next === "7") return true;
    if (next === "F") return true;
  }
  if (current === "L") {
    if (next === "|") return true;
    if (next === "7") return true;
    if (next === "F") return true;
  }
  if (current === "J") {
    if (next === "|") return true;
    if (next === "7") return true;
    if (next === "F") return true;
  }

  return false;
}

function isSouthPossible(current: string, next: string): boolean {
  if (current === "|") {
    if (next === "J") return true;
    if (next === "|") return true;
    if (next === "L") return true;
  }
  if (current === "7") {
    if (next === "|") return true;
    if (next === "J") return true;
  }
  if (current === "F") {
    if (next === "|") return true;
    if (next === "J") return true;
  }

  return false;
}

function isWestPossible(current: string, next: string): boolean {
  if (current === "-") {
    if (next === "-") return true;
    if (next === "F") return true;
    if (next === "L") return true;
  }
  if (current === "J") {
    if (next === "-") return true;
    if (next === "F") return true;
    if (next === "L") return true;
  }
  if (current === "7") {
    if (next === "-") return true;
    if (next === "F") return true;
    if (next === "L") return true;
  }

  return false;
}

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
function isEastPossible(current: string, next: string): boolean {
  if (current === "-") {
    if (next === "-") return true;
    if (next === "7") return true;
    if (next === "J") return true;
  }
  if (current === "L") {
    if (next === "-") return true;
    if (next === "7") return true;
    if (next === "J") return true;
  }
  if (current === "F") {
    if (next === "-") return true;
    if (next === "7") return true;
    if (next === "J") return true;
  }

  return false;
}
