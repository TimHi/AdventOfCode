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

function checkOccurance(line: string[]): boolean {
  if (line.join("") === WORD_TO_FIND) return true;
  else return false;
}

let right = 0; // 3
let left = 0; // 2
let down = 0; // 1
let up = 0; // 2
let diagRightUp = 0;
let diagRightDown = 0;
let diagLeftup = 0;
let diagLeftDown = 0;

function checkDirections(line: string[][], x: number, y: number): number {
  let occuranceOfPosition = 0;
  //RIGHT
  const row = Slice2DArrayRight(x, y, WORD_TO_FIND.length, line);
  if (row !== undefined && checkOccurance(row)) {
    occuranceOfPosition++;
    right++;
  }

  //LEFT
  const rowL = Slice2DArrayLeft(x, y, WORD_TO_FIND.length, line);
  if (rowL !== undefined && checkOccurance(rowL)) {
    occuranceOfPosition++;
    left++;
  }

  //DOWN
  const downCol = Slice2DArrayDown(x, y, WORD_TO_FIND.length, line);
  if (downCol !== undefined && checkOccurance(downCol)) {
    occuranceOfPosition++;
    down++;
  }

  //UP
  const upCol = Slice2DArrayUp(x, y, WORD_TO_FIND.length, line);
  if (upCol !== undefined && checkOccurance(upCol)) {
    occuranceOfPosition++;
    up++;
  }

  //DIAG RIGHT UP
  const diagRightUpSlice = Slice2DArrayDiagRightUp(x, y, WORD_TO_FIND.length, line);
  if (diagRightUpSlice !== undefined && checkOccurance(diagRightUpSlice)) {
    occuranceOfPosition++;
    diagRightUp++;
  }

  //DIAG RIGHT DOWN
  const diagRightDownSlice = Slice2DArrayDiagRightDown(x, y, WORD_TO_FIND.length, line);
  if (diagRightDownSlice !== undefined && checkOccurance(diagRightDownSlice)) {
    occuranceOfPosition++;
    diagRightDown++;
  }

  //DIAG LEFT DOWN
  const diagLeftDownSlice = Slice2DArrayDiagLeftDown(x, y, WORD_TO_FIND.length, line);
  if (diagLeftDownSlice !== undefined && checkOccurance(diagLeftDownSlice)) {
    occuranceOfPosition++;
    diagLeftDown++;
  }

  //DIAG LEFT UP
  const diagLeftUpSlice = Slice2DArrayDiagLeftUp(x, y, WORD_TO_FIND.length, line);
  if (diagLeftUpSlice !== undefined && checkOccurance(diagLeftUpSlice)) {
    occuranceOfPosition++;
    diagLeftup++;
  }

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

  console.log(
    `Right: ${right}, Left ${left}, Down: ${down}, Up: ${up}, Diag Right Up: ${diagRightUp}, Diag Right Down: ${diagRightDown}, Diag Left Down ${diagLeftDown}, 
    Diag Left Up ${diagLeftup}`
  );
  return xmasOccurance;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day04/sample.txt" : "/src/days/day04/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  let masOccurance = 0;

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
          (tLdR === "MAS" || tLdR === "SAM" || dRtL === "SAM" || dRtL === "MAS") &&
          (tRdL === "MAS" || tRdL === "SAM" || dLtR === "SAM" || dLtR === "MAS")
        ) {
          masOccurance++;
        }
      }
    }
  }
  return masOccurance;
}
