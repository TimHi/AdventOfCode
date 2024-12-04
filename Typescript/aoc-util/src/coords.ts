import type { Dictionary } from './dict.js';

export interface Point {
  X: number;
  Y: number;
}

export interface DirectedPoint extends Point {
  direction: Direction;
}

export enum Direction {
  N = 'North',
  E = 'East',
  S = 'South',
  W = 'West',
  NE = 'NorthEast',
  SE = 'SouthEast',
  SW = 'SouthWest',
  NW = 'NorthWest',
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
    case Direction.NE:
      return 4;
    case Direction.SE:
      return 5;
    case Direction.SW:
      return 5;
    case Direction.NW:
      return 6;
  }
}

export function GetDirection(dir: string): Direction {
  switch (dir) {
    case 'North':
      return Direction.N;
    case 'East':
      return Direction.E;
    case 'South':
      return Direction.S;
    case 'West':
      return Direction.W;
    case 'NorthEast':
      return Direction.NE;
    case 'SouthEast':
      return Direction.SE;
    case 'SouthWest':
      return Direction.SW;
    case 'NorthWest':
      return Direction.NW;
    default:
      throw new Error('Could not parse Direction ' + dir);
  }
}

export function GetPointKey(p: Point): string {
  return `${p.X}:${p.Y}`;
}

export function GetDirectedPointKey(point: DirectedPoint): string {
  return GetPointKey(point) + '-' + point.direction;
}

export function GetDirectedPointFromKey(key: string): DirectedPoint {
  const pattern = /^(\d+):(\d+)-([A-Za-z]+)$/; // Regular expression to match the format

  const match = key.match(pattern);

  if (match) {
    const [, X, Y, direction] = match.map((part) =>
      isNaN(Number(part)) ? part : Number(part),
    );

    if (
      typeof X === 'number' &&
      typeof Y === 'number' &&
      Direction[direction as keyof typeof Direction]
    ) {
      return {
        X,
        Y,
        direction: Direction[direction as keyof typeof Direction],
      };
    }
  }

  throw new Error('Point could not be parsed');
}

export function GetPointFromKey(key: string): Point {
  const split = key.split(':');
  return { X: Number(split[0]), Y: Number(split[1]) };
}

export function getManhattanDistance(a: Point, b: Point) {
  return Math.abs(a.X - b.X) + Math.abs(a.Y - b.Y);
}

/**
 * Get a neighbour for a given position in a 2D array.
 * If the position is out of bounds undefined is returned
 */
const DirectedSteps: Dictionary<
  Direction,
  <T>(x: number, y: number, arr: T[][]) => T | undefined
> = {
  [Direction.N]: function <T>(x: number, y: number, arr: T[][]): T | undefined {
    if (y - 1 >= 0) return arr[y - 1]![x];
    else return undefined;
  },
  [Direction.E]: function <T>(x: number, y: number, arr: T[][]): T | undefined {
    if (x + 1 < arr[0]!.length) return arr[y]![x + 1];
    else return undefined;
  },
  [Direction.S]: function <T>(x: number, y: number, arr: T[][]): T | undefined {
    if (y + 1 < arr.length) return arr[y + 1]![x];
    else return undefined;
  },
  [Direction.W]: function <T>(x: number, y: number, arr: T[][]): T | undefined {
    if (x - 1 >= 0) return arr[y]![x - 1];
    else return undefined;
  },
  [Direction.NE]: function <T>(
    x: number,
    y: number,
    arr: T[][],
  ): T | undefined {
    if (y - 1 >= 0 && x + 1 < arr[0]!.length) return arr[y - 1]![x + 1];
    else return undefined;
  },
  [Direction.SE]: function <T>(
    x: number,
    y: number,
    arr: T[][],
  ): T | undefined {
    if (y + 1 < arr.length && x + 1 < arr[0]!.length) return arr[y + 1]![x + 1];
    else return undefined;
  },
  [Direction.SW]: function <T>(
    x: number,
    y: number,
    arr: T[][],
  ): T | undefined {
    if (y + 1 < arr.length && x - 1 >= 0) return arr[y + 1]![x - 1];
    else return undefined;
  },
  [Direction.NW]: function <T>(
    x: number,
    y: number,
    arr: T[][],
  ): T | undefined {
    if (y - 1 >= 0 && x - 1 >= 0) return arr[y - 1]![x - 1];
    else return undefined;
  },
};

export function GetNeighbour<T>(
  x: number,
  y: number,
  direction: Direction,
  arr: T[][],
): T | undefined {
  const step = DirectedSteps[direction];
  return step(x, y, arr);
}
