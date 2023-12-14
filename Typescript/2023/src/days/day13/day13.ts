import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hammingDistance = require("hamming");
const isSample = false;
const oldReflectionMap = new Map<number, number>();
function parseFields(): string[][] {
  const fileName = isSample ? "/src/days/day13/sample.txt" : "/src/days/day13/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  const fields: string[][] = [];
  let field: string[] = [];
  lines.forEach((l) => {
    if (l === "") {
      fields.push(field);
      field = [];
    } else {
      field.push(l);
    }
  });
  return fields;
}

export function SolvePartOne(): number {
  const fields = parseFields();
  let horizontalRowSum = 0;
  let verticalRowSum = 0;
  fields.forEach((field, i) => {
    const horizontalRows = testHorizontalReflection(field, 0);
    const verticalColumns = testVerticalReflection(field, 0);
    if (horizontalRows === undefined && verticalColumns === undefined) throw new Error("No reflection found for field: " + i);
    if (horizontalRows !== undefined && horizontalRows.row !== undefined) {
      oldReflectionMap.set(i, horizontalRows.row);
      horizontalRowSum += horizontalRows.row;
    }
    if (verticalColumns !== undefined && verticalColumns.row !== undefined) {
      oldReflectionMap.set(i, verticalColumns.row);
      verticalRowSum += verticalColumns.row;
    }
  });
  return verticalRowSum + horizontalRowSum * 100;
}

interface SmudgeResult {
  row: number | undefined;
  wasHorizontal: boolean;
}

interface Field {
  original: string[];
  transposedOriginal: string[];
  smudgeFixedHorizontal: string[];
  smugeFixedVertical: string[];
}

export function SolvePartTwo(): number {
  const fields = parseFields();
  // Implement new interface for field which has transposed field and original field and repaired smudge field, Input looks short enough?
  // Unit test to verify transpose works (same array transposed again should be the original)
  // Modify testHorizontalReflection to return list of found reflections
  // Store Field>Reflectionrow from Part 1
  // Take Field
  // Go through lines to find smudge and replace it immediatly -> if horizontal is not found?

  // Use new Field with testHorizontalReflection
  // Pick new row
  return 0;
}

function isHammingDistanceMatch(one: string, two: string, match: number): boolean {
  if (one.length !== two.length) throw new Error("Length needs to be the same");
  return hammingDistance(one, two) === match;
}

function testHorizontalReflection(field: string[], match: number): SmudgeResult {
  let index = -1;
  for (let y = 0; y < field.length; y++) {
    index = -1;
    const checkDownCount = field.length - y - 1;
    for (let checkCount = 0; checkCount < checkDownCount; checkCount++) {
      if (y - checkCount >= 0 && y + checkCount < field.length) {
        const upperRow = field[y - checkCount];
        const lowerRow = field[y + checkCount + 1];
        if (isHammingDistanceMatch(upperRow, lowerRow, match)) {
          index = y;
        } else {
          index = -1;
          break;
        }
      }
    }
    if (index !== -1) break;
  }
  // Add one to index because we want the row not the index
  return { row: index !== -1 ? index + 1 : undefined, wasHorizontal: true };
}

function testVerticalReflection(field: string[], match: number): SmudgeResult {
  const fieldCopy = [...field];
  const transposedField = transposeArray(fieldCopy.map((l) => l.split(""))).map((l) => l.join(""));
  const result = testHorizontalReflection(transposedField, match);
  return { row: result.row, wasHorizontal: false };
}

function transposeArray(matrix: string[][]): string[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const transposedMatrix: string[][] = Array.from({ length: cols }, () => Array(rows).fill(""));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}
