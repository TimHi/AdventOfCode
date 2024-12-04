import { GetPointKey, Point } from "aoc-util";
import * as fs from "fs";

const isSample = false;
const slopes = ["^", ">", "<", "v"];
interface HikingNode {
  pos: Point;
  symbol: string;
}

function parseHikingMap(): [Point, Point, Map<string, HikingNode>] {
  const fileName = isSample ? "/src/days/day23/sample.txt" : "/src/days/day23/full.txt";
  const map = new Map<string, HikingNode>();

  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  const startPoint: Point = { X: 0, Y: 0 };
  const endPoint: Point = { X: 0, Y: lines.length - 1 };

  lines.forEach((row, y) => {
    row.forEach((col, x) => {
      const hikingNode: HikingNode = { pos: { X: x, Y: y }, symbol: col };
      map.set(GetPointKey(hikingNode.pos), hikingNode);

      if (y === 0 && col === ".") {
        endPoint.X = x;
      }
      if (y === lines.length - 1 && col === ".") {
        endPoint.X = x;
      }
    });
  });
  return [startPoint, endPoint, map];
}

export function SolvePartOne(): number {
  const [start, end, hikingMap] = parseHikingMap();
  const path = DFS_exhaustive(start, end, hikingMap);
  return path;
}

export function SolvePartTwo(): number {
  const [start, end, hikingMap] = parseHikingMap();

  const path = DFS_exhaustive(start, end, hikingMap, false);
  return path;
}

function DFS_exhaustive(start: Point, end: Point, hikingMap: Map<string, HikingNode>, isSlippery = true): number {
  const stack: Array<[string, string[]]> = [[GetPointKey(start), [GetPointKey(start)]]];
  const foundPaths: number[] = [];
  let aal = 0;
  while (stack.length > 0) {
    const [currentVertex, path] = stack.pop() ?? [];

    if (currentVertex === GetPointKey(end)) {
      // 94 90, 86, 82, 82, 74
      foundPaths.push(path!.length - 2); //-2 because start/end?
      if (path!.length > aal) {
        aal = path!.length;
        console.log(path!.length);
      }
    }
    const neighbors = getNeighbors(currentVertex!, hikingMap, isSlippery);

    for (const neighbor of neighbors) {
      if (!path!.includes(neighbor)) {
        stack.push([neighbor, path!.concat([neighbor])]);
      }
    }
  }
  return Math.max(...foundPaths);
}

function getNeighbors(current: string, hikingMap: Map<string, HikingNode>, isSlippery: boolean): string[] {
  const foundNeighbors: string[] = [];
  const currentNode = hikingMap.get(current)!;

  const deltas: Point[] = [
    { X: 1, Y: 0 },
    { X: -1, Y: 0 },
    { X: 0, Y: 1 },
    { X: 0, Y: -1 }
  ];
  if (slopes.includes(currentNode.symbol) && isSlippery) {
    const d = mapSlopeToDelta(currentNode.symbol);
    const newPoint: Point = { X: currentNode.pos.X + d.X, Y: currentNode.pos.Y + d.Y };
    const nextNode = hikingMap.get(GetPointKey(newPoint));
    if (nextNode !== undefined && nextNode.symbol !== "#") {
      foundNeighbors.push(GetPointKey(newPoint));
    }
  } else {
    deltas.forEach((d) => {
      const newPoint: Point = { X: currentNode.pos.X + d.X, Y: currentNode.pos.Y + d.Y };
      const nextNode = hikingMap.get(GetPointKey(newPoint));
      if (nextNode !== undefined && nextNode.symbol !== "#") {
        foundNeighbors.push(GetPointKey(newPoint));
      }
    });
  }
  return foundNeighbors;
}

function mapSlopeToDelta(slope: string): Point {
  switch (slope) {
    case "^":
      return { X: 0, Y: -1 };
    case "v":
      return { X: 0, Y: 1 };
    case "<":
      return { X: -1, Y: 0 };
    case ">":
      return { X: 1, Y: 0 };
    default:
      throw new Error("Unknown slope");
  }
}
