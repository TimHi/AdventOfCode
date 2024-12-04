import * as fs from "fs";

const isSample = false;
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
let diagRighDown = 0;
let diagLeftup = 0;
let diagLeftDown = 0;

function checkDirections(line: string[][], x: number, y: number): number {
  let occuranceOfPosition = 0;
  //RIGHT
  if (x + WORD_TO_FIND.length <= line[0].length) {
    const row = line[y].slice(x, x + WORD_TO_FIND.length);

    if (checkOccurance(row)) {
      occuranceOfPosition++;
      right++;
    }
  }
  //LEFT
  if (x - WORD_TO_FIND.length + 1 >= 0) {
    const row = line[y].slice(x - WORD_TO_FIND.length + 1, x + 1).reverse();
    if (checkOccurance(row)) {
      occuranceOfPosition++;
      left++;
    }
  }
  //DOWN
  if (y + WORD_TO_FIND.length <= line.length) {
    const downCol: string[] = [];

    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      downCol.push(line[y + i][x]);
    }

    if (checkOccurance(downCol)) {
      occuranceOfPosition++;
      down++;
    }
  }
  //UP
  if (y - WORD_TO_FIND.length + 1 >= 0) {
    const upCol: string[] = [];

    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      upCol.push(line[y - i][x]);
    }

    if (checkOccurance(upCol)) {
      occuranceOfPosition++;
      up++;
    }
  }
  //DIAG RIGHT UP
  if (x + WORD_TO_FIND.length - 1 <= line[0].length && y - WORD_TO_FIND.length + 1 >= 0) {
    const diagRightUpWord: string[] = [];
    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      diagRightUpWord.push(line[y - i][x + i]);
    }
    if (checkOccurance(diagRightUpWord)) {
      occuranceOfPosition++;
      diagRightUp++;
    }
  }

  //DIAG RIGHT DOWN
  if (x + WORD_TO_FIND.length <= line[0].length && y + WORD_TO_FIND.length <= line.length) {
    const diagRightDownWord: string[] = [];
    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      diagRightDownWord.push(line[y + i][x + i]);
    }
    if (checkOccurance(diagRightDownWord)) {
      occuranceOfPosition++;
      diagRighDown++;
    }
  }
  //DIAG LEFT DOWN
  if (x - WORD_TO_FIND.length + 1 >= 0 && y + WORD_TO_FIND.length <= line.length) {
    const diagLeftDownWord: string[] = [];
    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      diagLeftDownWord.push(line[y + i][x - i]);
    }
    if (checkOccurance(diagLeftDownWord)) {
      occuranceOfPosition++;
      diagLeftDown++;
    }
  }

  //DIAG LEFT UP
  if (x - WORD_TO_FIND.length + 1 >= 0 && y - WORD_TO_FIND.length + 1 >= 0) {
    const diagLeftUpWord: string[] = [];
    for (let i = 0; i < WORD_TO_FIND.length; i++) {
      diagLeftUpWord.push(line[y - i][x - i]);
    }
    if (checkOccurance(diagLeftUpWord)) {
      occuranceOfPosition++;
      diagLeftup++;
    }
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
    `Right: ${right}, Left ${left}, Down: ${down}, Up: ${up}, Diag Right Up: ${diagRightUp}, Diag Right Down: ${diagRighDown}, Diag Left Down ${diagLeftDown}, 
    Diag Left Up ${diagLeftup}`
  );
  return xmasOccurance;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
