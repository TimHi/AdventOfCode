import { Point } from "aoc-util";
import * as fs from "fs";
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

function getNeighbours(p: Point): Point[] {
  const neighbours: Point[] = [];
  for (let d = 0; d < 4; d++) {
    const dir = DELTA.get(d);
    if (dir === undefined) throw new Error("Weird delta, should not happen");
    const n = { X: p.X + dir.X, Y: p.Y + dir.Y };
    neighbours.push(n);
  }
  return neighbours;
}

function getBorderPoints(map: string[][], region: Region): Point[] {
  const borderPoints: Point[] = [];
  const pointTracker: string[] = [];
  for (let p = 0; p < region.area.length; p++) {
    const sourcePoint = region.area[p];
    const neighbours = getNeighbours(sourcePoint)
      .filter((p) => isInBounds(p, map[0].length, map.length))
      .filter((p) => map[p.Y][p.X] === region.plant);

    neighbours.forEach((n) => {
      if (!pointTracker.includes(JSON.stringify(n))) {
        borderPoints.push(n);
        pointTracker.push(JSON.stringify(n));
      }
    });
  }
  return borderPoints;
}

function checkDirectNeighbours(map: string[][], currentBorderPoint: Point): number {
  let n = 0;
  let e = 0;
  let s = 0;
  let w = 0;
  if (isNorthEdge(map, currentBorderPoint)) n++;
  if (isSouthEdge(map, currentBorderPoint)) s++;
  if (isEastEdge(map, currentBorderPoint)) e++;
  if (isWestEdge(map, currentBorderPoint)) w++;
  return n + e + w + s;
}

function getEdgeLength(map: string[][], region: Region): Region {
  let edges: number = 0;
  if (region.area.length === 1) {
    edges = 4;
  } else {
    const borderPoints = getBorderPoints(map, region);

    borderPoints.forEach((b) => (edges += checkDirectNeighbours(map, b)));
  }
  region.edges = edges;
  return region;
}

function padMap(map: string[][]): string[][] {
  let padMap = JSON.parse(JSON.stringify(map));
  const edge = Array(padMap.length + 2).fill(" ");
  padMap = padMap.map((a: string[]) => {
    a.push(" ");
    a.unshift(" ");
    return a;
  });
  padMap.push(edge);
  padMap.unshift(edge);
  return padMap;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const field = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const modifiedMap = padMap(field);
  const regions: Region[] = getAreas(modifiedMap).filter((r) => r.plant !== " ");

  regions.forEach((r) => getEdgeLength(modifiedMap, r));
  const totalPrice = regions.map((r) => calculateFencePrice(r)).reduce((sum, c) => (sum += c));
  return totalPrice;
}

//These methods check the LEFTMOST point
function isNorthEdge(map: string[][], currentBorderPoint: Point): boolean {
  const plant = map[currentBorderPoint.Y][currentBorderPoint.X];

  //No plant to the left AND no plant on Top
  if (map[currentBorderPoint.Y][currentBorderPoint.X - 1] !== plant && map[currentBorderPoint.Y - 1][currentBorderPoint.X] !== plant) {
    return true;
  }
  //Plant to the left, no plant on top BUT on top of the left plant is also a plant (Concave C)
  if (
    map[currentBorderPoint.Y][currentBorderPoint.X - 1] === plant &&
    map[currentBorderPoint.Y - 1][currentBorderPoint.X] !== plant &&
    map[currentBorderPoint.Y - 1][currentBorderPoint.X - 1] === plant
  ) {
    return true;
  }
  return false;
}

function isEastEdge(map: string[][], currentBorderPoint: Point): boolean {
  const plant = map[currentBorderPoint.Y][currentBorderPoint.X];
  //No plant to the right AND no plant on Top
  if (map[currentBorderPoint.Y][currentBorderPoint.X + 1] !== plant && map[currentBorderPoint.Y - 1][currentBorderPoint.X] !== plant) {
    return true;
  }
  //Plant to the left, no plant on top BUT on top of the left plant is also a plant (Concave C)
  if (
    map[currentBorderPoint.Y - 1][currentBorderPoint.X] === plant &&
    map[currentBorderPoint.Y][currentBorderPoint.X + 1] !== plant &&
    map[currentBorderPoint.Y - 1][currentBorderPoint.X + 1] === plant
  ) {
    return true;
  }
  return false;
}

function isSouthEdge(map: string[][], currentBorderPoint: Point): boolean {
  const plant = map[currentBorderPoint.Y][currentBorderPoint.X];

  if (map[currentBorderPoint.Y][currentBorderPoint.X - 1] !== plant && map[currentBorderPoint.Y + 1][currentBorderPoint.X] !== plant) {
    return true;
  }

  if (
    map[currentBorderPoint.Y][currentBorderPoint.X - 1] === plant &&
    map[currentBorderPoint.Y + 1][currentBorderPoint.X] !== plant &&
    map[currentBorderPoint.Y + 1][currentBorderPoint.X - 1] === plant
  ) {
    return true;
  }
  return false;
}

function isWestEdge(map: string[][], currentBorderPoint: Point): boolean {
  const plant = map[currentBorderPoint.Y][currentBorderPoint.X];

  if (map[currentBorderPoint.Y][currentBorderPoint.X - 1] !== plant && map[currentBorderPoint.Y - 1][currentBorderPoint.X] !== plant) {
    return true;
  }
  //Plant to the left, no plant on top BUT on top of the left plant is also a plant (Concave C)
  if (
    map[currentBorderPoint.Y - 1][currentBorderPoint.X] === plant &&
    map[currentBorderPoint.Y][currentBorderPoint.X - 1] !== plant &&
    map[currentBorderPoint.Y - 1][currentBorderPoint.X - 1] === plant
  ) {
    return true;
  }
  return false;
}
