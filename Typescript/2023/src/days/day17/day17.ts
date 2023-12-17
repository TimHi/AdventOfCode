import * as fs from "fs";
import { GetPointFromKey, GetPointKey, Point } from "../../util/coords";

const isSample = true;

function constructHeatLossMap(grid: string[][]): Map<string, number> {
  const heatLossMap = new Map<string, number>();
  grid.forEach((r, y) => {
    r.forEach((c, x) => {
      heatLossMap.set(GetPointKey({ X: x, Y: y }), Number(grid[y][x]));
    });
  });
  return heatLossMap;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day17/sample.txt" : "/src/days/day17/full.txt";
  const grid = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const startPoint = { X: 0, Y: 0 };
  const endPoint = { X: grid[0].length - 1, Y: grid.length - 1 };
  const heatLossMap = constructHeatLossMap(grid);
  const h = (p: Point) => {
    const h = heatLossMap.get(GetPointKey(p));
    if (h !== undefined) return h;
    else throw new Error("Heatloss for Point " + GetPointKey(p) + " is undefined");
  };
  const bestPath = AStar(startPoint, endPoint, h, heatLossMap);
  return bestPath.length;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function reconstructPath(cameFrom: Record<string, string>, current: string): string[] {
  const totalPath: string[] = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function AStar(start: Point, goal: Point, h: (node: Point) => number, heatLossMap: Map<string, number>): string[] | string {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openSet: Set<string> = new Set([GetPointKey(start)]);

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  const cameFrom: Record<string, string> = {};

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore: Record<string, number> = {};
  gScore[GetPointKey(start)] = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore: Record<string, number> = {};
  fScore[GetPointKey(start)] = h(start);

  while (openSet.size > 0) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue

    const current: string | undefined = Array.from(openSet).reduce((minNode, node) => (fScore[node] < fScore[minNode] ? node : minNode));
    const currentPoint = GetPointFromKey(current);
    if (currentPoint === goal) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);

    // Assuming neighbors is a function that returns an array of neighboring nodes
    for (const neighbor of neighbors(currentPoint)) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentativeGScore = gScore[current] + d(currentPoint, neighbor);

      if (tentativeGScore < (gScore[GetPointKey(neighbor)] || Infinity)) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[GetPointKey(neighbor)] = current;
        gScore[GetPointKey(neighbor)] = tentativeGScore;
        fScore[GetPointKey(neighbor)] = tentativeGScore + h(neighbor);
        if (!openSet.has(GetPointKey(neighbor))) {
          openSet.add(GetPointKey(neighbor));
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  return "failure";
}

function d(current: Point, neighbor: Point): number {
  // Replace with actual edge weight calculation
  return 1;
}

function neighbors(node: Point, grid: ): Point[] {
  // Replace with actual neighbor calculation
  return [];
}
