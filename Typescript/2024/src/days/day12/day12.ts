import { getManhattanDistance, Point } from "aoc-util";
import * as fs from "fs";
import { map } from "lodash";
enum DIRECTION {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
  NorthEast = 4,
  SouthEast = 5,
  SouthWest = 6,
  NorthWest = 7
}

const DELTA = new Map<DIRECTION, Point>([
  [DIRECTION.North, { X: 0, Y: -1 }],
  [DIRECTION.East, { X: 1, Y: 0 }],
  [DIRECTION.South, { X: 0, Y: 1 }],
  [DIRECTION.West, { X: -1, Y: 0 }],
  [DIRECTION.NorthEast, { X: 1, Y: -1 }],
  [DIRECTION.SouthEast, { X: 1, Y: 1 }],
  [DIRECTION.SouthWest, { X: -1, Y: 1 }],
  [DIRECTION.NorthWest, { X: -1, Y: -1 }]
]);

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

const isSample = true;

type Region = {
  plant: string;
  area: Point[];
  perimeter: Point[];
  edges: Point[];
};

function calculatePrice(r: Region): number {
  return r.area.length * r.perimeter.length;
}

function calculateFencePrice(r: Region): number {
  return r.area.length * r.edges.length;
}

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

function getPerimeter(map: string[][], area: Point[], currentRegionPlant: string): Point[] {
  const perimeterTracker: string[] = [];
  const perimeterPoints: Point[] = [];
  const corners: Point[] = [];
  const cornerTracker: string[] = [];
  area.forEach((p) => {
    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n = { X: p.X + dir.X, Y: p.Y + dir.Y };
      if (!isInBounds(n, map[0].length, map.length)) {
        if (!perimeterTracker.includes(JSON.stringify(n))) {
          perimeterTracker.push(JSON.stringify(n));
          perimeterPoints.push(n);
          if (n.X !== p.X && n.Y !== p.Y) {
            if (!cornerTracker.includes(JSON.stringify(n))) {
              corners.push(n);
            }
          }
        }
      } else {
        if (map[n.Y][n.X] !== currentRegionPlant) {
          perimeterTracker.push(JSON.stringify(n));
          perimeterPoints.push(n);
          if (n.X !== p.X && n.Y !== p.Y) {
            if (!cornerTracker.includes(JSON.stringify(n))) {
              corners.push(n);
            }
          }
        }
      }
    }
  });
  return perimeterPoints;
}

function getRegionArea(map: string[][], start: Point): Region {
  const visited: string[] = [];
  const area: Point[] = [];

  const areaTracker: string[] = [];

  const currentRegionPlant = map[start.Y][start.X];
  const q = new Queue<Point>();
  q.enqueue(start);
  areaTracker.push(JSON.stringify(start));
  area.push(start);

  while (q.size() > 0) {
    const newPos = q.dequeue();
    if (newPos === undefined) throw new Error("Wtf");
    if (!visited.includes(JSON.stringify(newPos))) {
      visited.push(JSON.stringify(newPos));
      for (let d = 0; d < 4; d++) {
        const dir = DELTA.get(d);
        if (dir === undefined) throw new Error("Weird delta, should not happen");
        const n = { X: newPos.X + dir.X, Y: newPos.Y + dir.Y };
        if (isInBounds(n, map[0].length, map.length)) {
          if (!visited.includes(JSON.stringify(n))) {
            if (map[n.Y][n.X] === currentRegionPlant) {
              q.enqueue(n);
              if (!areaTracker.includes(JSON.stringify(n))) {
                areaTracker.push(JSON.stringify(n));
                area.push(n);
              }
            }
          }
        }
      }
    }
  }

  const perimeterPoints: Point[] = getPerimeter(map, area, currentRegionPlant);
  return { area: area, perimeter: perimeterPoints, plant: currentRegionPlant, edges: [] };
}

function getAreas(map: string[][]): Region[] {
  const regions: Region[] = [];
  const isChecked: string[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const currentPoint: Point = { X: x, Y: y };
      if (!isChecked.includes(JSON.stringify(currentPoint))) {
        const region: Region = getRegionArea(map, currentPoint);
        region.area.forEach((p) => isChecked.push(JSON.stringify(p)));
        regions.push(region);
      }
    }
  }
  return regions;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const field = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const regions: Region[] = getAreas(field);
  const totalPrice = regions.map((r) => calculatePrice(r)).reduce((sum, c) => (sum += c));
  return totalPrice;
}

function getEdgeLength(map: string[][], region: Region): Region {
  // let edges = 0;
  // for (let p = 0; p < region.perimeter.length; p++) {
  //   const edgeToTest = region.perimeter[p];
  //   for (let p2 = 0; p2 < region.perimeter.length; p2++) {
  //     const p2ToTest = region.perimeter[p2];

  //     if (edgeToTest.X !== p2ToTest.X && edgeToTest.Y !== p2ToTest.Y) {
  //       if (getManhattanDistance(edgeToTest, p2ToTest) === 2) {
  //         edges++;
  //       }
  //     }
  //   }
  // }

  // region.edges = edges;

  return region;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const field = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const regions: Region[] = getAreas(field);
  regions.forEach((r) => getEdgeLength(field, r));
  const totalPrice = regions.map((r) => calculateFencePrice(r)).reduce((sum, c) => (sum += c));
  return totalPrice;
}
