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
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const grid = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split("").map((v) => Number(v)));

  const getNextPositions: Record<Direction, (x: number, y: number) => DirectedPoint[]> = {
    [Direction.N]: (x, y) => [
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x + 1, Y: y, direction: Direction.E },
      { X: x - 1, Y: y - 1, direction: Direction.W }
    ],
    [Direction.S]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x + 1, Y: y, direction: Direction.E },
      { X: x - 1, Y: y - 1, direction: Direction.W }
    ],
    [Direction.E]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x + 1, Y: y, direction: Direction.E }
    ],
    [Direction.W]: (x, y) => [
      { X: x, Y: y + 1, direction: Direction.S },
      { X: x, Y: y - 1, direction: Direction.N },
      { X: x - 1, Y: y - 1, direction: Direction.W }
    ]
  };
  const heatLossMap = constructHeatLossMap(grid);
  const options: HeapOptions<Step> = {
    comparator: (a: Step, b: Step) => {
      return a.heuristic - b.heuristic;
    }
  };
  const queue = new MinHeap<Step>(undefined, options);
  const visited = new Set<string>();

  const startPoint: DirectedPoint = { X: 0, Y: 0, direction: Direction.E };
  const startHeatLoss = heatLossMap.get(GetPointKey(startPoint));
  const endPoint: DirectedPoint = { X: grid[0].length - 1, Y: grid.length - 1, direction: Direction.E };
  const start: Step = { heuristic: 0, point: startPoint, totalHeatLoss: startHeatLoss!, moved: 0 };
  //Go down or right
  queue.push(start);
  visited.add(getStepKey(start));
  const startPointS: DirectedPoint = { X: 0, Y: 0, direction: Direction.E };
  const startS: Step = { heuristic: 0, point: startPointS, totalHeatLoss: startHeatLoss!, moved: 0 };
  visited.add(getStepKey(startS));
  queue.push(startS);

  while (queue.size > 0) {
    const step = queue.pop();
    if (step === undefined) throw new Error("Step undefined");

    if (step.point.X === endPoint.X && step.point.Y === endPoint.Y) {
      const endHeatLoss = heatLossMap.get(GetPointKey(step.point));
      if (endHeatLoss === undefined) throw new Error("End Heatloss undefinded");
      console.log(step.totalHeatLoss);
      return step.totalHeatLoss + endHeatLoss;
    }
    const nextSteps = getNextPositions[step.point.direction](step.point.X, step.point.Y)
      .filter((p) => (step.moved > 2 ? p.direction !== step.point.direction : true))
      .filter((p) => p.X >= 0 && p.X < grid[0].length && p.Y >= 0 && p.Y < grid.length);

    nextSteps.forEach((s) => {
      const nextHeatLoss = heatLossMap.get(GetPointKey({ X: s.X, Y: s.Y }));
      if (nextHeatLoss === undefined) throw new Error("Invalid Heatloss Key " + GetPointKey({ X: s.X, Y: s.Y }));
      const movedCounter = step.point.direction === s.direction ? step.moved + 1 : 0;
      if (movedCounter > 3) {
        throw new Error("Too much moves");
      }
      const heur = step.totalHeatLoss + nextHeatLoss;
      const newStep: Step = {
        heuristic: heur,
        point: s,
        moved: movedCounter,
        totalHeatLoss: step.totalHeatLoss + nextHeatLoss
      };
      if (!visited.has(getStepKey(newStep))) {
        queue.push(newStep);
        visited.add(getStepKey(newStep));
      }
    });
  }
  throw new Error("No Path found");
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
