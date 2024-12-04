export interface Point {
  X: number;
  Y: number;
}
export interface DirectedPoint extends Point {
  direction: Direction;
}
export declare enum Direction {
  N = 'North',
  E = 'East',
  S = 'South',
  W = 'West',
}
export declare function IndexOfDirection(direction: Direction): number;
export declare function GetDirection(dir: string): Direction;
export declare function GetPointKey(p: Point): string;
export declare function GetDirectedPointKey(point: DirectedPoint): string;
export declare function GetDirectedPointFromKey(key: string): DirectedPoint;
export declare function GetPointFromKey(key: string): Point;
export declare function getManhattanDistance(a: Point, b: Point): number;
//# sourceMappingURL=coords.d.ts.map
