import * as fs from "fs";

function getOASISReadings(): number[][] {
  const isSample = true;
  const fileName = isSample ? "/src/days/day09/sample.txt" : "/src/days/day09/full.txt";
  const oasisReadings: number[][] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((v) => v.split(" "))
    .forEach((l) => {
      const convertedNums: number[] = [];
      l.forEach((n) => convertedNums.push(Number(n)));
      oasisReadings.push(convertedNums);
    });
  return oasisReadings;
}

export function SolvePartOne(): number {
  let sum = 0;
  getOASISReadings().forEach((r) => (sum = sum + EstimateNextReading(r)));
  return sum;
}

export function SolvePartTwo(): number {
  let sum = 0;
  getOASISReadings().forEach((r) => (sum = sum + EstimateFirstReading(r)));
  return sum;
}

export function EstimateFirstReading(readings: number[]): number {
  const pyramidRow = buildDifferencePyramide(readings);
  return getFirstNumber(pyramidRow);
}

export function EstimateNextReading(readings: number[]): number {
  const pyramidRow = buildDifferencePyramide(readings);
  return getNextNumber(pyramidRow);
}

function buildDifferencePyramide(readings: number[]): number[][] {
  const pyramidRow: number[][] = [];
  let isConst = false;
  let rowNumbers = [...readings];
  while (!isConst) {
    rowNumbers = getRowDifferences(rowNumbers);
    pyramidRow.push(rowNumbers);
    isConst = rowNumbers.every((v) => v === 0);
  }
  pyramidRow.reverse();
  pyramidRow.push(readings);
  return pyramidRow;
}

function getNextNumber(pyramidRows: number[][]): number {
  let nextNum = pyramidRows[1][0] - pyramidRows[0][0];
  for (let index = 1; index < pyramidRows.length - 1; index++) {
    const nextRow = pyramidRows[index + 1];
    const diffNext = nextRow[nextRow.length - 1];
    nextNum = nextNum + diffNext;
  }
  return nextNum;
}

function getFirstNumber(pyramidRows: number[][]): number {
  let firstNum = 0;
  for (let index = 0; index < pyramidRows.length - 1; index++) {
    const nextRow = pyramidRows[index + 1];
    const diffNext = nextRow[0];
    firstNum = diffNext - firstNum;
  }
  return firstNum;
}

function getRowDifferences(row: number[]): number[] {
  const rowNumbers: number[] = [];
  for (let index = 0; index < row.length - 1; index++) {
    rowNumbers.push(row[index + 1] - row[index]);
  }
  return rowNumbers;
}
