import {
  Direction,
  GetNeighbour,
  Slice2DArrayDiagLeftDown,
  Slice2DArrayDiagLeftUp,
  Slice2DArrayDiagRightDown,
  Slice2DArrayDiagRightUp,
  Slice2DArrayDown,
  Slice2DArrayLeft,
  Slice2DArrayRight,
  Slice2DArrayUp
} from "aoc-util";
import * as fs from "fs";

const isSample = true;
const WORD_TO_FIND = "XMAS";

function isWordToFind(line: string[]): boolean {
  if (line.join("") === WORD_TO_FIND) return true;
  else return false;
}

function checkDirections(line: string[][], x: number, y: number): number {
  let occuranceOfPosition = 0;
  //RIGHT
  const row = Slice2DArrayRight(x, y, WORD_TO_FIND.length, line);
  if (row !== undefined && isWordToFind(row)) occuranceOfPosition++;

  //LEFT
  const rowL = Slice2DArrayLeft(x, y, WORD_TO_FIND.length, line);
  if (rowL !== undefined && isWordToFind(rowL)) occuranceOfPosition++;

  //DOWN
  const downCol = Slice2DArrayDown(x, y, WORD_TO_FIND.length, line);
  if (downCol !== undefined && isWordToFind(downCol)) occuranceOfPosition++;

  //UP
  const upCol = Slice2DArrayUp(x, y, WORD_TO_FIND.length, line);
  if (upCol !== undefined && isWordToFind(upCol)) occuranceOfPosition++;

  //DIAG RIGHT UP
  const diagRightUpSlice = Slice2DArrayDiagRightUp(x, y, WORD_TO_FIND.length, line);
  if (diagRightUpSlice !== undefined && isWordToFind(diagRightUpSlice)) occuranceOfPosition++;

  //DIAG RIGHT DOWN
  const diagRightDownSlice = Slice2DArrayDiagRightDown(x, y, WORD_TO_FIND.length, line);
  if (diagRightDownSlice !== undefined && isWordToFind(diagRightDownSlice)) occuranceOfPosition++;

  //DIAG LEFT DOWN
  const diagLeftDownSlice = Slice2DArrayDiagLeftDown(x, y, WORD_TO_FIND.length, line);
  if (diagLeftDownSlice !== undefined && isWordToFind(diagLeftDownSlice)) occuranceOfPosition++;

  //DIAG LEFT UP
  const diagLeftUpSlice = Slice2DArrayDiagLeftUp(x, y, WORD_TO_FIND.length, line);
  if (diagLeftUpSlice !== undefined && isWordToFind(diagLeftUpSlice)) occuranceOfPosition++;

  return occuranceOfPosition;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day04/sample.txt" : "/src/days/day04/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  let xmasOccurance = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      xmasOccurance += checkDirections(lines, x, y);
    }
  }

  return xmasOccurance;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day04/sample.txt" : "/src/days/day04/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  let masOccurance = 0;
  const MAS = "MAS";
  const SAM = "SAM";
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const C = lines[y][x];
      const NW = GetNeighbour(x, y, Direction.NW, lines);
      const NE = GetNeighbour(x, y, Direction.NE, lines);
      const SW = GetNeighbour(x, y, Direction.SW, lines);
      const SE = GetNeighbour(x, y, Direction.SE, lines);
      if (NW !== undefined && NE !== undefined && SW !== undefined && SE !== undefined) {
        //Diag RightDown/Diag RightUp
        const tLdR = NW + C + SE;
        const dRtL = SE + C + NW;
        //Diag LeftDown/Diag LeftUp
        const tRdL = NE + C + SW;
        const dLtR = SW + C + NE;

        if (
          (tLdR === MAS || tLdR === SAM || dRtL === SAM || dRtL === MAS) &&
          (tRdL === MAS || tRdL === SAM || dLtR === SAM || dLtR === MAS)
        ) {
          masOccurance++;
        }
      }
    }
  }
  return masOccurance;
}
