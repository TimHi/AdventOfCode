import * as fs from "fs";
import { DirectedPoint, GetPointKey } from "aoc-util";

const isSample = false;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";

  const field: string[][] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  return getPathScore(field);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day16/sample.txt" : "/src/days/day16/full.txt";

  const field: string[][] = [];
  const instructions: string[] = [];
  let isField = true;
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "\n" || l === "\r") isField = false;
      if (isField) {
        field.push(l.split("").filter((x) => x !== "\r"));
      } else if (!isField && l !== "\n" && l !== "\r") {
        instructions.push(...l.split(""));
      }
    });

  return 0;
}

/*
1   function Dijkstra(Graph, source):
2       create vertex priority queue Q
3
4       dist[source] ← 0                          // Initialization
5       Q.add_with_priority(source, 0)            // associated priority equals dist[·]
6
7       for each vertex v in Graph.Vertices:
8           if v ≠ source
9               prev[v] ← UNDEFINED               // Predecessor of v
10              dist[v] ← INFINITY                // Unknown distance from source to v
11              Q.add_with_priority(v, INFINITY)
12
13
14      while Q is not empty:                     // The main loop
15          u ← Q.extract_min()                   // Remove and return best vertex
16          for each neighbor v of u:             // Go through all v neighbors of u
17              alt ← dist[u] + Graph.Edges(u, v)
18              if alt < dist[v]:
19                  prev[v] ← u
20                  dist[v] ← alt
21                  Q.decrease_priority(v, alt)
22
23      return dist, prev
*/

//kann meine direct nicht benutzen weil da diagonal drinne steckt....
type Direction = "N" | "E" | "S" | "W";

interface State {
  x: number;
  y: number;
  dir: Direction;
  score: number;
}

const directions: Direction[] = ["N", "E", "S", "W"];
const deltas: Record<Direction, [number, number]> = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1]
};

function getFieldCoord(map: string[][], target: string): [number, number] {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === target) return [i, j];
    }
  }
  throw new Error(`Field ${target} not found`);
}

function getPathScore(map: string[][]): number {
  const [startX, startY] = getFieldCoord(map, "S");
  const [endX, endY] = getFieldCoord(map, "E");

  const pq: State[] = [];
  const visited = new Set<string>();

  pq.push({ x: startX, y: startY, dir: "E", score: 0 });

  while (pq.length > 0) {
    // Sort the queue to simulate priority queue behavior
    pq.sort((a, b) => a.score - b.score);
    const current = pq.shift()!;
    const key = `${current.x},${current.y},${current.dir}`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (current.x === endX && current.y === endY) return current.score;

    // Move forward
    const [dx, dy] = deltas[current.dir];
    const nx = current.x + dx;
    const ny = current.y + dy;
    if (nx >= 0 && ny >= 0 && nx < map.length && ny < map[0].length && map[nx][ny] !== "#") {
      pq.push({ x: nx, y: ny, dir: current.dir, score: current.score + 1 });
    }

    // Rotate clockwise, no OOB/Wall because auf der stelle
    const cwDir = directions[(directions.indexOf(current.dir) + 1) % 4];
    pq.push({ x: current.x, y: current.y, dir: cwDir, score: current.score + 1000 });

    // Rotate clockwise, no OOB/Wall because auf der stelle
    const ccwDir = directions[(directions.indexOf(current.dir) + 3) % 4];
    pq.push({ x: current.x, y: current.y, dir: ccwDir, score: current.score + 1000 });
  }

  throw new Error("No path found");
}

function printPath(field: string[][], foundPath: DirectedPoint[]) {
  console.log("Found Path:");
  const keys = foundPath.map((p) => GetPointKey(p));
  for (let y = 0; y < field.length; y++) {
    let row = "";
    for (let x = 0; x < field[0].length; x++) {
      if (keys.includes(GetPointKey({ X: x, Y: y }))) {
        row += "o";
      } else {
        row += field[y][x];
      }
    }
    console.log(row);
  }
}
//11037
//111404 not the right
//112403 too high
//112404 too high
//113404
//113404
//114404

//95444
