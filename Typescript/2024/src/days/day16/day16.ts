import * as fs from "fs";
import { DirectedPoint, Direction, GetDirectedPointKey, GetPointKey, Point } from "aoc-util";

const isSample = false;

export interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }
}

export enum DIRECTION {
  North = 0,
  East = 1,
  South = 2,
  West = 3
}

export const DELTA = new Map<DIRECTION, Point>([
  [DIRECTION.North, { X: 0, Y: -1 }],
  [DIRECTION.East, { X: 1, Y: 0 }],
  [DIRECTION.South, { X: 0, Y: 1 }],
  [DIRECTION.West, { X: -1, Y: 0 }]
]);

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";

  const field: string[][] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  return getPathScore(field);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";

  const field: string[][] = [];
  const instructions: string[] = [];
  let isField = true;
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "\n" || l === "\r") isField = false;
      if (isField) {
        field.push(l.split("").filter((x) => x !== "\r"));
      } else if (!isField && l !== "\n" && l !== "\r") {
        instructions.push(...l.split(""));
      }
    });

  return 0;
}

function getFieldCoord(field: string[][], f: string) {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
      if (field[y][x] === f) return { X: x, Y: y };
    }
  }
  throw new Error("Field not found");
}

//lol
function dirToDir(dir: number): Direction {
  if (dir === 0) return Direction.N;
  if (dir === 1) return Direction.E;
  if (dir === 2) return Direction.S;
  if (dir === 3) return Direction.W;
  throw new Error("Unkown Dir");
}

function isWall(pos: DirectedPoint, field: string[][]): boolean {
  return field[pos.Y][pos.X] === "#";
}

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

const visited = new Set<string>();

function getPathScore(map: string[][]): number {
  // Create a queue which stores
  // the paths
  const queue: Queue<DirectedPoint[]> = new Queue();

  const src = getFieldCoord(map, "S");
  const end = getFieldCoord(map, "E");
  // Path vector to store the current path
  const path: DirectedPoint[] = [];
  //HEHEHEHE
  path.push({ ...src, direction: Direction.E });
  queue.enqueue(path);
  const foundPaths: DirectedPoint[][] = [];
  while (queue.size() > 0) {
    const pPath = queue.dequeue();
    if (pPath === undefined) throw new Error("Path in Que is undefined but there is size höh");
    const lastPointInPath = pPath[pPath.length - 1];

    // If last vertex is the desired destination
    // then print the path
    if (lastPointInPath.Y === end.Y && lastPointInPath.X === end.X) {
      foundPaths.push(pPath);
    }
    const neighbours: DirectedPoint[] = [];
    const n: DirectedPoint = { X: lastPointInPath.X, Y: lastPointInPath.Y - 1, direction: Direction.N };
    const e: DirectedPoint = { X: lastPointInPath.X + 1, Y: lastPointInPath.Y, direction: Direction.E };
    const w: DirectedPoint = { X: lastPointInPath.X - 1, Y: lastPointInPath.Y, direction: Direction.W };
    const s: DirectedPoint = { X: lastPointInPath.X, Y: lastPointInPath.Y + 1, direction: Direction.S };
    if (lastPointInPath.direction === Direction.N) {
      neighbours.push(n);
      neighbours.push(e);
      neighbours.push(w);
    }
    if (lastPointInPath.direction === Direction.S) {
      neighbours.push(s);
      neighbours.push(e);
      neighbours.push(w);
    }
    if (lastPointInPath.direction === Direction.E) {
      neighbours.push(n);
      neighbours.push(e);
      neighbours.push(s);
    }
    if (lastPointInPath.direction === Direction.W) {
      neighbours.push(w);
      neighbours.push(n);
      neighbours.push(s);
    }
    neighbours.forEach((n) => {
      if (isInBounds(n, map[0].length, map.length)) {
        if (!visited.has(GetDirectedPointKey(n))) {
          visited.add(GetDirectedPointKey(n));
          if (!isWall(n, map)) {
            const newpath = JSON.parse(JSON.stringify(pPath));
            newpath.push(n);
            queue.enqueue(newpath);
          }
        }
      }
    });
  }

  let pathScore = Number.MAX_SAFE_INTEGER;
  let tPathScore = 0;
  for (let p = 0; p < foundPaths.length; p++) {
    tPathScore = 0;
    for (let v = 1; v < foundPaths[p].length; v++) {
      if (foundPaths[p][v - 1].direction !== foundPaths[p][v].direction) {
        tPathScore += 1000;
        tPathScore += 1;
      } else {
        tPathScore += 1;
      }
    }
    if (tPathScore < pathScore) pathScore = tPathScore;
    console.log(tPathScore);
    printPath(map, foundPaths[p]);
  }
  return pathScore;
}

function printPath(field: string[][], foundPath: DirectedPoint[]) {
  console.log("Found Path:");
  const keys = foundPath.map((p) => GetPointKey(p));
  for (let y = 0; y < field.length; y++) {
    let row = "";
    for (let x = 0; x < field[0].length; x++) {
      if (keys.includes(GetPointKey({ X: x, Y: y }))) {
        row += "o";
      } else {
        row += field[y][x];
      }
    }
    console.log(row);
  }
}
//11037
//111404 not the right
//112403 too high
//112404 too high
//113404
//113404
//114404
