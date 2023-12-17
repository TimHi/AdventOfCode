import * as fs from "fs";
import { DirectedPoint, Direction, GetDirection, GetPointKey } from "../../util/coords";

const isSample = true;

class CruciblePoint implements DirectedPoint {
  constructor(
    public X: number,
    public Y: number,
    public direction: Direction,
    public moved: number
  ) {}

  static getKey(point: CruciblePoint): string {
    return `${point.X}:${point.Y}-${point.direction}.${point.moved}`;
  }

  static getPointKey(point: CruciblePoint): string {
    return GetPointKey({ X: point.X, Y: point.Y });
  }
  static parseKey(key: string): CruciblePoint {
    const pattern = /^(\d+):(\d+)-([A-Za-z]+).(\d+)$/;
    const match = key.match(pattern);
    if (match) {
      const [, X, Y, direction, moved] = match.map((part) => (isNaN(Number(part)) ? part : Number(part)));
      if (typeof X === "number" && typeof Y === "number" && typeof direction === "string" && typeof moved === "number") {
        return new CruciblePoint(X, Y, GetDirection(direction), moved);
      }
    }
    throw new Error("Point could not be parsed");
  }
}

function constructHeatLossMap(grid: number[][]): Map<string, number> {
  const heatLossMap = new Map<string, number>();
  grid.forEach((r, y) => {
    r.forEach((c, x) => {
      heatLossMap.set(GetPointKey({ X: x, Y: y }), grid[y][x]);
    });
  });
  return heatLossMap;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const grid = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split("").map((v) => Number(v)));
  const startPoint = new CruciblePoint(0, 0, Direction.E, 0);
  const endPoint = new CruciblePoint(grid[0].length - 1, grid.length - 1, Direction.S, 0);
  const heatLossMap = constructHeatLossMap(grid);

  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
