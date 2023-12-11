import * as fs from "fs";
import { Point } from "../../util/coords";
import { Queue } from "data-structure-typed";

interface PipePosition {
  currentCoordinate: Point;
  pipe: string;
  directions: Point[];
  isStart: boolean;
}

function parsePipes() {
  const isSample = false;
  const fileName = isSample ? "/src/days/day10/sample.txt" : "/src/days/day10/full.txt";
  const pipes = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  return pipes;
}

export function SolvePartOne(): number {
  const pipes = parsePipes();
  const pipeMap: PipePosition[][] = [];
  const startPosition: Point = { X: 0, Y: 0 };

  pipes.forEach((y, yIndex) => {
    const parsedPipes: PipePosition[] = [];
    y.forEach((x, xIndex) => {
      const pos: Point = { X: xIndex, Y: yIndex };
      if (x === "S") {
        startPosition.X = xIndex;
        startPosition.Y = yIndex;
      }
      const directions: Point[] = getDirections(x);
      parsedPipes.push({ currentCoordinate: pos, pipe: x, directions: directions, isStart: false });
    });
    pipeMap.push(parsedPipes);
  });
  const possibleSymbols = ["|", "-", "L", "J", "7", "F"];
  let result = 0;
  possibleSymbols.forEach((possibleStartPipe) => {
    const copy: PipePosition[][] = deepCopyArray(pipeMap);
    const directions = getDirections(possibleStartPipe);
    copy[startPosition.Y][startPosition.X] = {
      currentCoordinate: startPosition,
      pipe: possibleStartPipe,
      directions: directions,
      isStart: true
    };
    const steps = testStartPipes(startPosition, copy);
    if (steps !== 0) result = steps;
  });

  return result;
}
const DELTAS: Point[] = [
  { X: -1, Y: 0 },
  { X: 1, Y: 0 },
  { X: 0, Y: -1 },
  { X: 0, Y: 1 }
];

//https://en.wikipedia.org/wiki/Depth-first_search#Pseudocode
function testStartPipes(startPosition: Point, pipeMap: PipePosition[][]): number {
  const q = new Queue<PipePosition>();
  for (const delta of DELTAS) {
    const start = pipeMap[startPosition.Y + delta.Y] && pipeMap[startPosition.Y + delta.Y][startPosition.X + delta.X];
    if (start !== undefined) {
      const startPipePosition = pipeMap[startPosition.Y + delta.Y][startPosition.X + delta.X];
      for (const dir of startPipePosition.directions) {
        if (dir.X - delta.X === 0 && dir.Y - delta.Y === 0) {
          q.enqueue(startPipePosition);
        }
      }
    }
  }
  const visisted = new Map<string, boolean>();
  while (!q.isEmpty()) {
    const currentPipe = q.dequeue();
    if (currentPipe === undefined) break;
    const hasVisited = visisted.has(`${currentPipe.currentCoordinate.X}-${currentPipe.currentCoordinate.Y}`);
    if (hasVisited) continue;
    const hasPipe = pipeMap[currentPipe.currentCoordinate.Y] && pipeMap[currentPipe.currentCoordinate.Y][currentPipe.currentCoordinate.X];
    if (hasPipe) {
      const pipe = pipeMap[currentPipe.currentCoordinate.Y][currentPipe.currentCoordinate.X];
      for (const dir of pipe.directions) {
        const hasNext =
          pipeMap[currentPipe.currentCoordinate.Y + dir.Y] &&
          pipeMap[currentPipe.currentCoordinate.Y + dir.Y][currentPipe.currentCoordinate.X + dir.X];
        if (hasNext) {
          const next = pipeMap[currentPipe.currentCoordinate.Y + dir.Y][currentPipe.currentCoordinate.X + dir.X];
          q.enqueue(next);
        }
      }
      visisted.set(`${currentPipe.currentCoordinate.X}-${currentPipe.currentCoordinate.Y}`, true);
    }
  }

  return visisted.size / 2;
}

const north: Point = { X: 0, Y: -1 };
const east: Point = { X: 1, Y: 0 };
const south: Point = { X: 0, Y: 1 };
const west: Point = { X: -1, Y: 0 };

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
