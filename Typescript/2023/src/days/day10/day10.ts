import * as fs from "fs";
import { Point } from "../../util/coords";
import { Queue } from "data-structure-typed";
import { Point as geoPoint } from "ts-2d-geometry/dist";
import gaussShoelace from "gauss-shoelace";

const isSample = true;
function parsePipes(fileName: string): string[][] {
  const pipes = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  return pipes;
}

enum DIRECTION {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST"
}

const DELTA = new Map<DIRECTION, Point>([
  [DIRECTION.North, { X: 0, Y: -1 }],
  [DIRECTION.East, { X: 1, Y: 0 }],
  [DIRECTION.South, { X: 0, Y: 1 }],
  [DIRECTION.West, { X: -1, Y: 0 }]
]);

const PIPEMAP = new Map<string, DIRECTION[]>([
  ["|", [DIRECTION.North, DIRECTION.South]],
  ["-", [DIRECTION.West, DIRECTION.East]],
  ["L", [DIRECTION.North, DIRECTION.East]],
  ["J", [DIRECTION.North, DIRECTION.West]],
  ["7", [DIRECTION.West, DIRECTION.South]],
  ["F", [DIRECTION.East, DIRECTION.South]]
]);

interface PipePosition {
  p: Point;
  symbol: string;
}

const PIPE_SYMBOLS = ["F", "|", "-", "L", "J", "7"];
export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const pipes = parsePipes(fileName);
  const startPoint = getStartPoint(pipes);
  const pipeMap = parseDetails(pipes);
  const results = new Map<string, number>();
  PIPE_SYMBOLS.forEach((possibleStart) => {
    const result = traverseMap(possibleStart, startPoint, pipeMap);
    results.set(possibleStart, result.size);
  });
  let foundValidWin = 0;
  let winningStartSymbol = "S";
  results.forEach((r, k) => {
    if (r % 2 === 0 && r > foundValidWin) {
      foundValidWin = r;
      winningStartSymbol = k;
    }
  });
  const half = foundValidWin / 2;
  console.log(results);
  console.log(`Start: ${winningStartSymbol} has ${half} pipes in its loop`);

  return half;
}

function traverseMap(possibleStart: string, startPoint: Point, pipeMap: PipePosition[][]): Map<string, Point> {
  const S: Queue<PipePosition> = new Queue<PipePosition>();
  const discovered = new Map<string, Point>();
  discovered.set(getPointKey(startPoint), startPoint);
  const startDirections = PIPEMAP.get(possibleStart);
  if (startDirections === undefined) throw new Error("Startdirections undefinded");
  const direction = startDirections[0];
  const delta = DELTA.get(direction);
  if (delta === undefined) throw new Error("Delta undefined for " + direction);
  const newPos = pipeMap[startPoint.Y + delta.Y][startPoint.X + delta.X];
  S.push(newPos);

  while (!S.isEmpty()) {
    const w = S.dequeue();
    if (w !== undefined) {
      const wVisited = discovered.has(getPointKey(w.p));
      if (!wVisited) {
        discovered.set(getPointKey(w.p), w.p);
        if (w.symbol !== ".") {
          const wDir = PIPEMAP.get(w.symbol);
          if (wDir === undefined) throw new Error("Direction undefined for point" + w.symbol);
          for (const direction of wDir) {
            const delta = DELTA.get(direction);
            if (delta === undefined) throw new Error("Delta undefined for " + direction);
            const newPos = pipeMap[w.p.Y + delta.Y][w.p.X + delta.X];
            S.push(newPos);
          }
        }
      }
    } else {
      S.shift();
    }
  }
  return discovered;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day10/sample2.txt" : "/src/days/day10/full.txt";
  const pipes = parsePipes(fileName);
  const startPoint = getStartPoint(pipes);
  const pipeMap = parseDetails(pipes);
  const results = new Map<string, number>();
  const groundPoints: geoPoint[] = [];
  pipeMap.forEach((v, y) => {
    v.forEach((r, x) => {
      if (r.symbol === ".") groundPoints.push(new geoPoint(x, y));
    });
  });
  PIPE_SYMBOLS.forEach((possibleStart) => {
    const result = traverseMap(possibleStart, startPoint, pipeMap);
    results.set(possibleStart, result.size);
  });
  let foundValidWin = 0;
  let winningStartSymbol = "S";
  results.forEach((r, k) => {
    if (r % 2 === 0 && r > foundValidWin) {
      foundValidWin = r;
      winningStartSymbol = k;
    }
  });

  const result = traverseMap(winningStartSymbol, startPoint, pipeMap);
  const points: Array<[number, number]> = [];
  result.forEach((v) => {
    points.push([v.X, v.Y]);
  });

  return getPolyArea(result);
}

function getPolyArea(map: Map<string, Point>): number {
  const shoelacePoints: Array<[number, number]> = [];
  map.forEach((v) => {
    shoelacePoints.push([v.X, v.Y]);
  });
  const shoelace = gaussShoelace(shoelacePoints);
  const innerPoints = -shoelacePoints.length / 2 + 1 + shoelace;
  return innerPoints;
}

function getStartPoint(map: string[][]): Point {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S") return { X: x, Y: y };
    }
  }
  throw new Error("No start point in Map");
}

function getPointKey(p: Point): string {
  return `${p.X}:${p.Y}`;
}

function parseDetails(map: string[][]): PipePosition[][] {
  const details: PipePosition[][] = [];
  for (let y = 0; y < map.length; y++) {
    const row: PipePosition[] = [];
    for (let x = 0; x < map[0].length; x++) {
      row.push({ p: { X: x, Y: y }, symbol: map[y][x] });
    }
    details.push(row);
  }
  return details;
}
