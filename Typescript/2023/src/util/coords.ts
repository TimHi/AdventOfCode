export interface Point {
  X: number;
  Y: number;
}
export function GetPointKey(p: Point): string {
  return `${p.X}:${p.Y}`;
}

export function GetPointFromKey(key: string): Point {
  const split = key.split(":");
  return { X: Number(split[0]), Y: Number(split[1]) };
}

export function getManhattanDistance(a: Point, b: Point) {
  return Math.abs(a.X - b.X) + Math.abs(a.Y - b.Y);
}
