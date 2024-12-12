import { Point } from "aoc-util";
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
  edges: number;
};

function calculatePrice(r: Region): number {
  return r.area.length * r.perimeter.length;
}

function calculateFencePrice(r: Region): number {
  return r.area.length * r.edges;
}

function isInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}

function getPerimeter(map: string[][], area: Point[], currentRegionPlant: string): Point[] {
  const perimeterTracker: string[] = [];
  const perimeterPoints: Point[] = [];
  area.forEach((p) => {
    for (let d = 0; d < 4; d++) {
      const dir = DELTA.get(d);
      if (dir === undefined) throw new Error("Weird delta, should not happen");
      const n = { X: p.X + dir.X, Y: p.Y + dir.Y };
      if (!isInBounds(n, map[0].length, map.length)) {
        if (!perimeterTracker.includes(JSON.stringify(n))) {
          perimeterTracker.push(JSON.stringify(n));
          perimeterPoints.push(n);
        }
      } else {
        if (map[n.Y][n.X] !== currentRegionPlant) {
          perimeterTracker.push(JSON.stringify(n));
          perimeterPoints.push(n);
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
  return { area: area, perimeter: perimeterPoints, plant: currentRegionPlant, edges: 0 };
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

function getAreaOrigin(map: string[][], p: Point, plant: string): DIRECTION | undefined {
  for (let d = 0; d < 4; d++) {
    const dir = DELTA.get(d);
    if (dir === undefined) throw new Error("");
    const n = { X: p.X + dir.X, Y: p.Y + dir.Y };
    if (isInBounds(n, map[0].length, map.length)) {
      if (map[n.Y][n.X] === plant) {
        return d;
      }
    }
  }
  return undefined;
}

function getEdgeLength(map: string[][], region: Region): Region {
  let edgeCounter = 0;
  let pointInEdge: string[] = [];

  let areaOriginDirection: DIRECTION | undefined = undefined;
  for (let start = 0; start < region.perimeter.length; start++) {
    const startP = region.perimeter[start];
    if (pointInEdge.includes(JSON.stringify(startP))) {
      break;
    }
    pointInEdge.push(JSON.stringify(startP));

    areaOriginDirection = getAreaOrigin(map, startP, region.plant);
    if (areaOriginDirection === undefined) throw new Error("Orig needs direction");
    //Go X or Y

    //X
    let step = 0;
    let n1Reached = false;
    let n2Reached = false;
    if (areaOriginDirection === DIRECTION.North || areaOriginDirection === DIRECTION.South) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        step++;
        const n1: Point = { X: startP.X + step, Y: startP.Y };
        const n2: Point = { X: startP.X - step, Y: startP.Y };
        const o1 = getAreaOrigin(map, n1, region.plant);
        const o2 = getAreaOrigin(map, n2, region.plant);
        if (o1 === undefined || o1 !== areaOriginDirection) {
          n1Reached = true;
        } else {
          if (!n1Reached) pointInEdge.push(JSON.stringify(n1));
        }
        if (o2 === undefined || o2 !== areaOriginDirection) {
          n2Reached = true;
        } else {
          if (!n2Reached) pointInEdge.push(JSON.stringify(n2));
        }
        if (n1Reached && n2Reached) {
          edgeCounter++;
          break;
        }
        //currentEdge.push(...[JSON.stringify(n1), JSON.stringify(n2)]);
      }
    }
    //Y
    if (areaOriginDirection === DIRECTION.East || areaOriginDirection === DIRECTION.West) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        step++;
        const n1: Point = { X: startP.X, Y: startP.Y + step };
        const n2: Point = { X: startP.X, Y: startP.Y - step };
        if (getAreaOrigin(map, n1, region.plant) !== areaOriginDirection) {
          n1Reached = true;
        } else {
          if (!n1Reached) pointInEdge.push(JSON.stringify(n1));
        }
        if (getAreaOrigin(map, n2, region.plant) !== areaOriginDirection) {
          n2Reached = true;
        } else {
          if (!n2Reached) pointInEdge.push(JSON.stringify(n2));
        }
        if (n1Reached && n2Reached) {
          edgeCounter++;
          break;
        }
      }
    }
  }
  region.edges = edgeCounter;
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
