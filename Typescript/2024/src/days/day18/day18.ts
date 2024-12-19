import { getAllNumbersInString, GetPointKey, Point } from "aoc-util";
import * as fs from "fs";

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

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

interface State {
  p: Point;
  score: number;
}
type Direction = "N" | "E" | "S" | "W";
const directions: Direction[] = ["N", "E", "S", "W"];
const deltas: Record<Direction, [number, number]> = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1]
};

function findPath(blocked: Point[], start: Point, end: Point, kb: number): number {
  const blockedL = blocked.slice(0, kb).map((p) => GetPointKey(p));
  const pq: State[] = [];
  const visited = new Set<string>();

  pq.push({ p: start, score: 0 });

  while (pq.length > 0) {
    // Sort the queue to simulate priority queue behavior
    pq.sort((a, b) => a.score - b.score);
    const current = pq.shift()!;
    const key = GetPointKey(current.p);

    if (visited.has(key)) continue;
    visited.add(key);

    if (current.p.X === end.X && current.p.Y === end.Y) return current.score;

    // Move forward
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(deltas).forEach(([key, value]) => {
      const n = { X: current.p.X + value[1], Y: current.p.Y + value[0] };
      if (n.X >= 0 && n.Y >= 0 && n.X < end.X + 1 && n.Y < end.Y + 1 && !blockedL.includes(GetPointKey(n))) {
        pq.push({ p: n, score: current.score + 1 });
      }
    });
  }
  return -1;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const points: Point[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      return { X: nums[0], Y: nums[1] };
    });

  const start = { X: 0, Y: 0 };
  const end = isSample ? { X: 6, Y: 6 } : { X: 70, Y: 70 };
  const kb = isSample ? 12 : 1024;
  return findPath(points, start, end, kb);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const points: Point[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      return { X: nums[0], Y: nums[1] };
    });

  const start = { X: 0, Y: 0 };
  const end = isSample ? { X: 6, Y: 6 } : { X: 70, Y: 70 };
  let kb = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const path = findPath(points, start, end, kb);
    if (path === -1) {
      console.log(points[2908]);
      return kb;
    } else {
      kb++;
    }
  }
}
