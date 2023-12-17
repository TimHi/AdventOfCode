import * as fs from "fs";
import { DirectedPoint, Direction, GetDirectedPointKey, GetPointKey } from "../../util/coords";
import { HeapOptions, MinHeap } from "data-structure-typed";

const isSample = true;
type Step = {
  heuristic: number;
  point: DirectedPoint;
  moved: number;
  totalHeatLoss: number;
};

function parseGrid(): number[][] {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split("").map((v) => Number(v)));
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

function getStepKey(step: Step): string {
  return GetDirectedPointKey(step.point) + "=" + step.moved;
}

export function SolvePartOne(): number {
  const grid = parseGrid();

  return searchLeastHeatLossPath(
    1,
    2,
    1,
    [
      { X: 0, Y: 0, direction: Direction.E },
      { X: 0, Y: 0, direction: Direction.S }
    ],
    { X: grid[0].length - 1, Y: grid.length - 1, direction: Direction.E },
    grid
  );
}

export function SolvePartTwo(): number {
  const grid = parseGrid();
  return searchLeastHeatLossPath(
    4,
    9,
    4,
    [
      { X: 0, Y: 0, direction: Direction.E },
      { X: 0, Y: 0, direction: Direction.S }
    ],
    { X: grid[0].length - 1, Y: grid.length - 1, direction: Direction.E },
    grid
  );
}

function searchLeastHeatLossPath(
  stepsBeforeTurn: number,
  maxSteps: number,
  endSteps: number,
  startPoints: DirectedPoint[],
  endPoint: DirectedPoint,
  grid: number[][]
) {
  const heatLossMap = constructHeatLossMap(grid);
  const options: HeapOptions<Step> = {
    comparator: (a: Step, b: Step) => {
      return a.heuristic - b.heuristic;
    }
  };

  const queue = new MinHeap<Step>(undefined, options);
  const visited = new Set<string>();

  startPoints.forEach((p) => {
    const startStep = { heuristic: 0, moved: 0, point: p, totalHeatLoss: 0 };
    queue.push(startStep);
    visited.add(getStepKey(startStep));
  });

  while (queue.size > 0) {
    const step = queue.pop();
    if (step === undefined) throw new Error("Step undefined");

    if (step.point.X === endPoint.X && step.point.Y === endPoint.Y) {
      if (step.moved < endSteps) continue;
      else return step.totalHeatLoss;
    }

    const nextSteps = getNextPositions(step.point.direction, step.point.X, step.point.Y)
      .filter((p) => {
        if (step.moved < stepsBeforeTurn) return p.direction === step.point.direction;
        if (step.moved > maxSteps) return p.direction !== step.point.direction;
        return true;
      })
      .filter((p) => p.X >= 0 && p.X < grid[0].length && p.Y >= 0 && p.Y < grid.length);

    nextSteps.forEach((s) => {
      const nextHeatLoss = heatLossMap.get(GetPointKey({ X: s.X, Y: s.Y }));
      const movedCounter = step.point.direction === s.direction ? step.moved + 1 : 1;
      const nextStep: Step = {
        heuristic: step.totalHeatLoss + nextHeatLoss!,
        point: s,
        moved: movedCounter,
        totalHeatLoss: step.totalHeatLoss + nextHeatLoss!
      };
      if (!visited.has(getStepKey(nextStep))) {
        queue.push(nextStep);
        visited.add(getStepKey(nextStep));
      }
    });
  }

  throw new Error("No Path found");
}

function getNextPositions(direction: Direction, x: number, y: number) {
  const getNextPositions: Record<Direction, (x: number, y: number) => DirectedPoint[]> = {
    [Direction.N]: (x, y) => [
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x + 1, Y: y, direction: Direction.E },
      { X: x - 1, Y: y, direction: Direction.W }
    ],
    [Direction.S]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x + 1, Y: y, direction: Direction.E },
      { X: x - 1, Y: y, direction: Direction.W }
    ],
    [Direction.E]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x + 1, Y: y, direction: Direction.E }
    ],
    [Direction.W]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x - 1, Y: y, direction: Direction.W }
    ]
  };
  return getNextPositions[direction](x, y);
}
