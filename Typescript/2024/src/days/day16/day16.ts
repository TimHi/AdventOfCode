import * as fs from "fs";
import { DirectedPoint, Direction, GetDirectedPointKey, Point } from "aoc-util";

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

function getPossibleNeighbours(pos: DirectedPoint, field: string[][]): DirectedPoint[] {
  const neighbours: DirectedPoint[] = [];
  for (let d = 0; d < 4; d++) {
    const dir = DELTA.get(d);

    if (dir === undefined) throw new Error("Weird delta, should not happen");
    const n: DirectedPoint = { X: pos.X + dir.X, Y: pos.Y + dir.Y, direction: dirToDir(d) };
    if (isInBounds(n, field[0].length, field.length) && !isWall(n, field)) {
      neighbours.push(n);
    }
  }
  return neighbours;
}

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

function isNotVisited(p: DirectedPoint, path: DirectedPoint[]): boolean {
  const size = path.length;
  for (let i = 0; i < size; i++) {
    if (GetDirectedPointKey(path[i]) === GetDirectedPointKey(p)) {
      return false;
    }
  }
  return true;
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
    //Get neighbours in each direction
    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n: DirectedPoint = { X: lastPointInPath.X + dir.X, Y: lastPointInPath.Y + dir.Y, direction: dirToDir(d) };
      if (n.direction === Direction.S && lastPointInPath.direction === Direction.N) {
        //Skip
      } else if (n.direction === Direction.E && lastPointInPath.direction === Direction.W) {
        //SKip
      } else if (n.direction === Direction.W && lastPointInPath.direction === Direction.E) {
        //SKip
      } else if (n.direction === Direction.N && lastPointInPath.direction === Direction.S) {
        //SKip
      } else {
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
      }
    }
  }

  let pathScore = Number.MAX_SAFE_INTEGER;
  let tPathScore = 0;
  for (let p = 0; p < foundPaths.length; p++) {
    tPathScore = 0;
    for (let v = 1; v < foundPaths[p].length; v++) {
      if (foundPaths[p][v - 1].direction !== foundPaths[p][v].direction) {
        tPathScore += 1001;
      } else {
        tPathScore += 1;
      }
    }
    if (tPathScore < pathScore) pathScore = tPathScore;
    console.log(tPathScore);
  }
  return pathScore;
}
//113404
//112404 too high
//113404
