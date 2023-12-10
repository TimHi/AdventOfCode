import * as fs from "fs";
import { Point } from "../../util/coords";
import { UndirectedGraph } from "data-structure-typed";

interface PipePosition {
  currentCoordinate: Point;
  pipe: string;
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

const pipeSymbols = ["|", "-", "L", "J", "7", "F", ".", "S"];

export function SolvePartOne(): number {
  const pipes = parsePipes();
  const pipeMap: PipePosition[][] = [];
  let startPosition: Point = { X: 0, Y: 0 };
  const graph = new UndirectedGraph<string>();
  pipes.forEach((y, yIndex) => {
    const translatedRow: PipePosition[] = [];
    y.forEach((x, xIndex) => {
      const coord: Point = { X: xIndex, Y: yIndex };
      translatedRow.push({ currentCoordinate: coord, pipe: x });
      if (x === "S") startPosition = coord;
    });
    pipeMap.push(translatedRow);
  });
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
