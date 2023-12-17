import * as fs from "fs";
import { DirectedPoint, Direction, GetDirection } from "../../util/coords";

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

class Graph {
  Vertices: CruciblePoint[];
  Edges: Map<string, number>;

  constructor() {
    this.Vertices = [];
    this.Edges = new Map();
  }

  addVertex(vertex: CruciblePoint): void {
    this.Vertices.push(vertex);
  }

  addEdge(from: CruciblePoint, to: CruciblePoint, weight: number): void {
    const keyFrom = CruciblePoint.getKey(from);
    const keyTo = CruciblePoint.getKey(to);
    this.Edges.set(`${keyFrom}-${keyTo}`, weight);
  }
}

function constructHeatLossMap(grid: number[][]): Map<string, number> {
  const heatLossMap = new Map<string, number>();
  grid.forEach((r, y) => {
    r.forEach((c, x) => {
      heatLossMap.set(CruciblePoint.getKey(new CruciblePoint(x, y, Direction.E, 0)), grid[y][x]);
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
  const graph = new Graph();

  const pointA = new CruciblePoint(0, 0, Direction.N, 0);
  const pointB = new CruciblePoint(1, 1, Direction.E, 0);
  heatLossMap.forEach((v, k) => {
    const point = CruciblePoint.parseKey(k);
    graph.addVertex(point);
  });
  graph.addVertex(pointA);
  graph.addVertex(pointB);
  graph.addEdge(pointA, pointB, 1);

  const [distances, predecessors] = dijkstra(graph, pointA);

  console.log("Distances:", distances);
  console.log("Predecessors:", predecessors);
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

//https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
function dijkstra(graph: Graph, source: CruciblePoint): [Record<string, number>, Record<string, CruciblePoint | undefined>] {
  const dist: Record<string, number> = {};
  const prev: Record<string, CruciblePoint | undefined> = {};
  const Q: CruciblePoint[] = [];

  for (const vertex of graph.Vertices) {
    dist[CruciblePoint.getKey(vertex)] = Infinity;
    prev[CruciblePoint.getKey(vertex)] = undefined;
    Q.push(vertex);
  }

  dist[CruciblePoint.getKey(source)] = 0;

  while (Q.length > 0) {
    const u = Q.reduce((minVertex, vertex) =>
      dist[CruciblePoint.getKey(vertex)] < dist[CruciblePoint.getKey(minVertex)] ? vertex : minVertex
    );
    Q.splice(Q.indexOf(u), 1);

    for (const v of Q.filter((vertex) => graph.Edges.has(`${CruciblePoint.getKey(u)}-${CruciblePoint.getKey(vertex)}`))) {
      const alt = dist[CruciblePoint.getKey(u)] + (graph.Edges.get(`${CruciblePoint.getKey(u)}-${CruciblePoint.getKey(v)}`) || 0);

      if (alt < dist[CruciblePoint.getKey(v)]) {
        dist[CruciblePoint.getKey(v)] = alt;
        prev[CruciblePoint.getKey(v)] = u;
      }
    }
  }

  return [dist, prev];
}
