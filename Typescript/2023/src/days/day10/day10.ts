import * as fs from "fs";
import { Point } from "../../util/coords";

interface PipePosition {
  currentCoordinate: Point;
  pipe: string;
  directions: Point[];
  isStart: boolean;
}

function parsePipes() {
  const isSample = true;
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const pipes = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  return pipes;
}

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.

export function SolvePartOne(): number {
  const pipes = parsePipes();
  const pipeMap: PipePosition[][] = [];
  const groundList: Point[] = [];

  const startPosition: Point = { X: 0, Y: 0 };

  pipes.forEach((y, yIndex) => {
    const parsedPipes: PipePosition[] = [];
    y.forEach((x, xIndex) => {
      const pos: Point = { X: xIndex, Y: yIndex };
      if (x === ".") {
        groundList.push(pos);
      } else if (x === "S") {
        startPosition.X = xIndex;
        startPosition.Y = yIndex;
      }
      const directions: Point[] = getDirections(x);
      parsedPipes.push({ currentCoordinate: pos, pipe: x, directions: directions, isStart: false });
    });
    pipeMap.push(parsedPipes);
  });
  //const possibleSymbols = ["|", "-", "L", "J", "7", "F"];
  const possibleSymbols = ["L"];
  possibleSymbols.forEach((possibleStartPipe) => {
    const copy: PipePosition[][] = deepCopyArray(pipeMap);
    const directions = getDirections(possibleStartPipe);
    copy[startPosition.Y][startPosition.X] = {
      currentCoordinate: startPosition,
      pipe: possibleStartPipe,
      directions: directions,
      isStart: true
    };
    console.log(possibleStartPipe);
    const steps = testStartPipes(startPosition, copy, groundList, copy[0].length, copy.length);
    console.log(steps);
  });

  return 0;
}

function testStartPipes(startPosition: Point, pipeMap: PipePosition[][], groundList: Point[], maxX: number, maxY: number): number {
  const visited: boolean[][] = Array.from({ length: pipeMap.length }, () => Array(pipeMap[0].length).fill(false));

  function dfs(x: number, y: number): void {
    if (visited[startPosition.Y][startPosition.X] === true && x === startPosition.X && y === startPosition.Y) {
      console.log("Found it?");
    }
    if (x <= 0 || x >= pipeMap[0].length || y <= 0 || y >= pipeMap.length || visited[y][x]) {
      return;
    }

    visited[y][x] = true;
    console.log(`Visiting position: (${x}, ${y})`);

    const currentPipe = pipeMap[y][x];

    for (const direction of currentPipe.directions) {
      const newPipePos = pipeMap[y + direction.Y][x + direction.X];
      if (canMove(newPipePos, currentPipe, maxX, maxY, groundList, direction)) {
        const newX = x + direction.X;
        const newY = y + direction.Y;
        dfs(newX, newY);
      }
    }
  }

  dfs(startPosition.X, startPosition.Y);
  return 0; // Update this return value based on your requirements
}

const north: Point = { X: 0, Y: -1 };
const east: Point = { X: 1, Y: 0 };
const south: Point = { X: 0, Y: 1 };
const west: Point = { X: -1, Y: 0 };

const PIPES: Map<string, Point[]> = new Map<string, Point[]>([
  ["|", [north, south]],
  ["-", [east, west]],
  ["L", [north, east]],
  ["J", [north, west]],
  ["7", [south, west]],
  ["F", [east, south]]
]);
const DELTAS: Point[] = [
  { X: -1, Y: 0 },
  { X: 1, Y: 0 },
  { X: 0, Y: -1 },
  { X: 0, Y: 1 }
];

function getDirections(pipe: string): Point[] {
  const directions: Point[] = [];
  switch (pipe) {
    case "|":
      directions.push(north, south);
      break;
    case "-":
      directions.push(east, west);
      break;
    case "L":
      directions.push(north, east);
      break;
    case "J":
      directions.push(north, west);
      break;
    case "7":
      directions.push(south, west);
      break;
    case "F":
      directions.push(east, south);
      break;
    case ".":
      break;
    case "S":
      break;
    default:
      throw new Error("Unknown Symbol");
  }
  return directions;
}

export function SolvePartTwo(): number {
  return 0;
}

function deepCopyArray(originalArray: PipePosition[][]): PipePosition[][] {
  return originalArray.map((row) => row.slice());
}
function canMove(
  direction: PipePosition,
  currentPipe: PipePosition,
  maxX: number,
  maxY: number,
  groundList: Point[],
  newDirection: Point
): boolean {
  const isGround = groundList.find((g) => g.X === direction.currentCoordinate.X && g.Y === direction.currentCoordinate.Y);
  if (isGround !== undefined) return false;
  if (
    0 <= direction.currentCoordinate.X &&
    direction.currentCoordinate.X < maxX &&
    0 <= direction.currentCoordinate.Y &&
    direction.currentCoordinate.Y < maxY
  ) {
    console.log("Are " + currentPipe.pipe + " and " + direction.pipe + " connected");
    if (arePipesConnecting(currentPipe.pipe, newDirection)) {
      console.log("True");
      return true;
    } else {
      console.log("False");
      return false;
    }
  } else {
    return false;
  }
}
function arePipesConnecting(pipe1: string, pipe2: Point): boolean {
  const directions1 = PIPES.get(pipe1);

  if (!directions1) {
    throw new Error("Invalid pipe type");
  }
  for (const dir1 of directions1) {
    if (pipe2.X - dir1.X === 0 && pipe2.Y - dir1.Y === 0) {
      return true;
    }
  }

  return false;
}
