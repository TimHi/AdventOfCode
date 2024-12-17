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

  const field: string[][] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  return getSeatingScore(field);
}

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

//Find all paths, get all positions
function getSeatingScore(field: string[][]): number {
  throw new Error("Function not implemented.");
}
