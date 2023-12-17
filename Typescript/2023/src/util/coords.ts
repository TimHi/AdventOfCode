export interface Point {
  X: number;
  Y: number;
}

export interface DirectedPoint extends Point {
  direction: Direction;
}

export enum Direction {
  N = "North",
  E = "East",
  S = "South",
  W = "West"
}

export function IndexOfDirection(direction: Direction): number {
  switch (direction) {
    case Direction.N:
      return 0;
    case Direction.E:
      return 1;
    case Direction.S:
      return 2;
    case Direction.W:
      return 3;
  }
}

export function GetDirection(dir: string): Direction {
  switch (dir) {
    case "North":
      return Direction.N;
    case "East":
      return Direction.E;
    case "South":
      return Direction.S;
    case "West":
      return Direction.W;
    default:
      throw new Error("Could not parse Direction " + dir);
  }
}

export function GetPointKey(p: Point): string {
  return `${p.X}:${p.Y}`;
}

export function GetDirectedPointKey(point: DirectedPoint): string {
  return GetPointKey(point) + "-" + point.direction;
}

export function GetDirectedPointFromKey(key: string): DirectedPoint {
  const pattern = /^(\d+):(\d+)-([A-Za-z]+)$/; // Regular expression to match the format

  const match = key.match(pattern);

  if (match) {
    const [, X, Y, direction] = match.map((part) => (isNaN(Number(part)) ? part : Number(part)));

    if (typeof X === "number" && typeof Y === "number" && Direction[direction as keyof typeof Direction]) {
      return { X, Y, direction: Direction[direction as keyof typeof Direction] };
    }
  }

  throw new Error("Point could not be parsed");
}

export function GetPointFromKey(key: string): Point {
  const split = key.split(":");
  return { X: Number(split[0]), Y: Number(split[1]) };
}

export function getManhattanDistance(a: Point, b: Point) {
  return Math.abs(a.X - b.X) + Math.abs(a.Y - b.Y);
}
