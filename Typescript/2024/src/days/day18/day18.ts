import { getAllNumbersInString , Point, GetPointKey} from "aoc-util";
import * as fs from "fs";

const isSample = true;


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
function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

function findPath(blocked: Point[], start: Point, end: Point): number {
  let foundPath = 0;

  const Q = new Queue<Point>();
  const visited: string[] = [];
  const blockedP = blocked.map((b) => GetPointKey(b));
  visited.push(GetPointKey(start));
  Q.enqueue(start);

  while (Q.size() > 0) {
    const newPos: Point = Q.dequeue()!;

    if (end.X === newPos.X && end.Y === newPos.Y) {
      return visited.length;
    }

    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n = { X: newPos.X + dir.X, Y: newPos.Y + dir.Y };
      if (isInBounds(n, end.X + 1, end.Y + 1)) {
        if (!visited.includes(GetPointKey(n)) && !blockedP.includes(GetPointKey(n))) {
          
            Q.enqueue(n);
            visited.push(GetPointKey(n));
          
        }
      }
    }
  }

  return 0;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const points: Point[] = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n").map((l)=>{
    const nums = getAllNumbersInString(l);
    return {X: nums[0], Y: nums[1]};
  });

  const start = {X: 0, Y: 0};
  const end = isSample ? {X: 6, Y: 6} : {X: 70, Y: 70};
  
  const result = findPath(points, start, end);
  return result;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  const raw = lines[4]
    .split(" ")[1]
    .split(",");

  
  return 0;
}
