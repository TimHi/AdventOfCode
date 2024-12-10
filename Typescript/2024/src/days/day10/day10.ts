import { GetPointKey, Point } from "aoc-util";

import * as fs from "fs";
const isSample = true;

interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

class Queue<T> implements IQueue<T> {
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

function findAllOccurencesOfNum(map: number[][], numToSearch: number): Point[] {
  const foundNum: Point[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === numToSearch) {
        foundNum.push({ X: x, Y: y });
      }
    }
  }
  return foundNum;
}

enum DIRECTION {
  North = 0,
  East = 1,
  South = 2,
  West = 3
}

const DELTA = new Map<DIRECTION, Point>([
  [DIRECTION.North, { X: 0, Y: -1 }],
  [DIRECTION.East, { X: 1, Y: 0 }],
  [DIRECTION.South, { X: 0, Y: 1 }],
  [DIRECTION.West, { X: -1, Y: 0 }]
]);

function getCopyOfMap(map: number[][]): number[][] {
  return JSON.parse(JSON.stringify(map));
}
//Use BFS to find all paths
function findAllPaths(map: number[][], start: Point): number {
  let foundPath = 0;

  const cMap = getCopyOfMap(map);

  const Q = new Queue<Point>();
  const visited: string[] = [];

  visited.push(GetPointKey(start));
  Q.enqueue(start);

  while (Q.size() > 0) {
    const newPos: Point = Q.dequeue()!;

    if (cMap[newPos.Y][newPos.X] === 9) {
      foundPath++;
    }

    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n = { X: newPos.X + dir.X, Y: newPos.Y + dir.Y };
      if (isInBounds(n, cMap[0].length, cMap.length)) {
        if (!visited.includes(GetPointKey(n))) {
          if (cMap[n.Y][n.X] - cMap[newPos.Y][newPos.X] === 1) {
            Q.enqueue(n);
            visited.push(GetPointKey(n));
          }
        }
      }
    }
  }

  return foundPath;
}

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}
export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) =>
      l.split("").map((n) => {
        if (n === ".") return -100;
        else return Number(n);
      })
    );
  const startPlaces = findAllOccurencesOfNum(lines, 0);

  let trailheadScore = 0;
  startPlaces.forEach((s) => {
    trailheadScore += findAllPaths(lines, s);
  });
  return trailheadScore;
}

function isNotVisited(p: Point, path: Point[]): boolean {
  const size = path.length;
  for (let i = 0; i < size; i++) {
    if (GetPointKey(path[i]) === GetPointKey(p)) {
      return false;
    }
  }
  return true;
}

//TODO: This shit is every year, try to generalize it
function findAllPathsWithIntermediatePaths(map: number[][], src: Point): number {
  // Create a queue which stores
  // the paths
  const queue: Queue<Point[]> = new Queue();
  let foundEnd = 0;
  // Path vector to store the current path
  const path: Point[] = [];
  path.push(src);
  queue.enqueue(path);
  const foundPaths: Point[][] = [];
  while (queue.size() > 0) {
    const pPath = queue.dequeue();
    if (pPath === undefined) throw new Error("Path in Que is undefined but there is size höh");
    const lastPointInPath = pPath[pPath.length - 1];

    // If last vertex is the desired destination
    // then print the path
    if (map[lastPointInPath.Y][lastPointInPath.X] === 9) {
      foundPaths.push(pPath);
      foundEnd++;
    }
    //Get neighbours in each direction
    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n = { X: lastPointInPath.X + dir.X, Y: lastPointInPath.Y + dir.Y };
      if (isInBounds(n, map[0].length, map.length)) {
        if (isNotVisited(n, pPath)) {
          if (map[n.Y][n.X] - map[lastPointInPath.Y][lastPointInPath.X] === 1) {
            const newpath = JSON.parse(JSON.stringify(pPath));
            newpath.push(n);
            queue.enqueue(newpath);
          }
        }
      }
    }
  }

  //console.log(foundPaths);
  return foundEnd;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) =>
      l.split("").map((n) => {
        if (n === ".") return -100;
        else return Number(n);
      })
    );
  const startPlaces = findAllOccurencesOfNum(lines, 0);

  let trailheadScore = 0;
  startPlaces.forEach((s) => {
    trailheadScore += findAllPathsWithIntermediatePaths(lines, s);
  });
  return trailheadScore;
}

function print2D(cMap: number[][], visited: string[]) {
  for (let y = 0; y < cMap.length; y++) {
    let result = "";
    for (let x = 0; x < cMap[0].length; x++) {
      if (visited.includes(GetPointKey({ X: x, Y: y }))) {
        result += "X";
      } else {
        result += ".";
      }
    }
    console.log(result);
  }
}
