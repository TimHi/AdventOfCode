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
    const horizontalRows = testHorizontalReflection(field, 0, false);
    const verticalColumns = testVerticalReflection(field, 0, false);
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
  smudgeLines: string[];
}

export function SolvePartTwo(): number {
  const fields = parseFields();
  let horizontalRowSum = 0;
  let verticalRowSum = 0;

  fields.forEach((field, i) => {
    const horizontalSmudgeIndex = testHorizontalReflection(field, 1, true);
    const verticalSmudgeIndex = testVerticalReflection(field, 1, true);
    if (horizontalSmudgeIndex === undefined && verticalSmudgeIndex === undefined) throw new Error("No smudge found for field: " + i);

    if (horizontalSmudgeIndex !== undefined && horizontalSmudgeIndex.row !== undefined) {
      const result = correctSmudgeAndTest(field, horizontalSmudgeIndex, i);
      if (result !== undefined && result.row !== undefined) {
        if (result.wasHorizontal) {
          horizontalRowSum += result.row;
        } else {
          verticalRowSum += result.row;
        }
      }
    }
    if (verticalSmudgeIndex !== undefined && verticalSmudgeIndex.row !== undefined) {
      const result = correctSmudgeAndTest(field, verticalSmudgeIndex, i);
      if (result !== undefined && result.row !== undefined) {
        if (result.wasHorizontal) {
          horizontalRowSum += result.row;
        } else {
          verticalRowSum += result.row;
        }
      }
    }
  });
  return verticalRowSum + horizontalRowSum * 100;
}

function isHammingDistanceMatch(one: string, two: string, match: number): boolean {
  if (one.length !== two.length) throw new Error("Length needs to be the same");
  return hammingDistance(one, two) === match;
}

function correctSmudgeAndTest(field: string[], smudgeResult: SmudgeResult, fieldIndex: number): SmudgeResult {
  let correctedField: string[] = [...field];
  if (smudgeResult.wasHorizontal) {
    if (smudgeResult.smudgeLines.length !== 2) throw new Error("Need 2 lines to fix smudge");
    const smudgeColIndex = getSmudgeIndex(smudgeResult.smudgeLines[0], smudgeResult.smudgeLines[1]);
    const correctedRow = exchangeCharAtIndex(smudgeResult.smudgeLines[0], smudgeColIndex);
    correctedField[smudgeResult.row! + 1] = correctedRow;
  } else {
    const transposedField = transposeArray(correctedField.map((l) => l.split(""))).map((l) => l.join(""));
    if (smudgeResult.smudgeLines.length !== 2) throw new Error("Need 2 lines to fix smudge");
    const smudgeColIndex = getSmudgeIndex(smudgeResult.smudgeLines[0], smudgeResult.smudgeLines[1]);
    const correctedRow = exchangeCharAtIndex(smudgeResult.smudgeLines[0], smudgeColIndex);
    transposedField[smudgeResult.row!] = correctedRow;
    correctedField = transposeArray(transposedField.map((l) => l.split(""))).map((l) => l.join(""));
  }

  const horizontalRows = testHorizontalReflection(correctedField, 0, false, true, fieldIndex);
  const verticalColumns = testVerticalReflection(correctedField, 0, false, true, fieldIndex);
  if (horizontalRows === undefined && verticalColumns === undefined) throw new Error("No reflection found for field: " + fieldIndex);
  if (horizontalRows !== undefined && horizontalRows.row !== undefined) {
    return horizontalRows;
  }
  if (verticalColumns !== undefined && verticalColumns.row !== undefined) {
    return verticalColumns;
  }

  throw new Error("Did not find new reflection");
}

function testHorizontalReflection(
  field: string[],
  match: number,
  isFindingSmudge: boolean,
  checkForNew: boolean = false,
  fieldIndex: number = 0
): SmudgeResult {
  let smudgeLines: string[] = [];
  let index = -1;
  for (let y = 0; y < field.length; y++) {
    index = -1;
    const checkDownCount = field.length - y - 1;
    for (let checkCount = 0; checkCount < checkDownCount; checkCount++) {
      if (y - checkCount >= 0 && y + checkCount < field.length) {
        const upperRow = field[y - checkCount];
        const lowerRow = field[y + checkCount + 1];
        if (isHammingDistanceMatch(upperRow, lowerRow, match)) {
          smudgeLines.push(upperRow, lowerRow);
          if (isFindingSmudge) {
            return { row: y, wasHorizontal: true, smudgeLines: smudgeLines }; //Holy shit I hate this
          }
          if (checkForNew) {
            //Hacky way to avoid detecting the same old reflection before the new one and returning prematurely
            const oldIndex = oldReflectionMap.get(fieldIndex);
            if (oldIndex === undefined) throw new Error("Part One did not create reflection map correctly");
            if (oldIndex !== y) {
              smudgeLines.push(upperRow, lowerRow);
              index = y;
            }
          } else {
            index = y;
          }
        } else {
          index = -1;
          smudgeLines = [];
          break;
        }
      }
    }
    if (index !== -1) break;
  }
  // Add one to index because we want the row not the index
  return { row: index !== -1 ? index + 1 : undefined, wasHorizontal: true, smudgeLines: smudgeLines };
}

function testVerticalReflection(
  field: string[],
  match: number,
  isFindingSmudge: boolean,
  checkForNew: boolean = false,
  fieldIndex: number = 0
): SmudgeResult {
  const fieldCopy = [...field];
  const transposedField = transposeArray(fieldCopy.map((l) => l.split(""))).map((l) => l.join(""));
  const result = testHorizontalReflection(transposedField, match, isFindingSmudge, checkForNew, fieldIndex);
  return { row: result.row, wasHorizontal: false, smudgeLines: result.smudgeLines };
}

function transposeArray(matrix: string[][]): string[][] {
  console.log("Transpose Field");
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create a new array with swapped rows and columns
  const transposedMatrix: string[][] = Array.from({ length: cols }, () => Array(rows).fill(""));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}

function exchangeCharAtIndex(input: string, index: number): string {
  if (input[index] === ".") return input.substring(0, index) + "#" + input.substring(index + 1);
  else return input.substring(0, index) + "." + input.substring(index + 1);
}
function getSmudgeIndex(one: string, two: string): number {
  const maxLength = Math.max(one.length, two.length);
  for (let i = 0; i < maxLength; i++) {
    const char1 = one.charCodeAt(i) || 0;
    const char2 = two.charCodeAt(i) || 0;

    if ((char1 ^ char2) !== 0) {
      return i;
    }
  }
  throw new Error("Smudge expected to be found but XOR returns no match");
}
