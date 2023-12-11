export interface Point {
  X: number;
  Y: number;
}

export function getManhattanDistance(a: Point, b: Point) {
  return Math.abs(a.X - b.X) + Math.abs(a.Y - b.Y);
}
