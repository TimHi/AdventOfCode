import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hammingDistance = require("hamming");
const isSample = true;
const oldReflectionMap = new Map<number, SmudgeResult>();
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
    const result = determineInitialReflection(horizontalRows, verticalColumns);
    if (result.row === undefined) throw new Error("Result should not be undefined");
    oldReflectionMap.set(i, result);
    if (result.wasHorizontal) {
      horizontalRowSum += result.row + 1;
    } else {
      verticalRowSum += result.row + 1;
    }
  });
  return verticalRowSum + horizontalRowSum * 100;
}

function determineInitialReflection(horizontalIndexes: number[], verticalIndexes: number[]): SmudgeResult {
  if (horizontalIndexes.length === 1) return { row: horizontalIndexes[0], wasHorizontal: true };
  if (verticalIndexes.length === 1) return { row: verticalIndexes[0], wasHorizontal: false };
  throw new Error("No reflection found");
}

function determineFoundIndex(horizontalIndexes: number[], verticalIndexes: number[], fieldIndex: number): SmudgeResult {
  const oldReflection = oldReflectionMap.get(fieldIndex);
  if (oldReflection === undefined) throw new Error("No old reflection found");
  let newHorizontal: number[] = [];
  let newVertical: number[] = [];
  if (oldReflection?.wasHorizontal) {
    if (oldReflection.row === undefined) throw new Error("No old reflection found");
    const filteredH = horizontalIndexes.length >= 1 ? horizontalIndexes.filter((v) => v != oldReflection.row) : horizontalIndexes;
    newHorizontal = filteredH;
    newVertical = verticalIndexes;
  } else {
    if (oldReflection.row === undefined) throw new Error("No old reflection found");
    const filtered = verticalIndexes.length >= 1 ? verticalIndexes.filter((v) => v != oldReflection.row) : verticalIndexes;
    newVertical = filtered;
    newHorizontal = horizontalIndexes;
  }

  const result = determineInitialReflection(newHorizontal, newVertical);
  return result;
}

interface SmudgeResult {
  row: number | undefined;
  wasHorizontal: boolean;
}

export function SolvePartTwo(): number {
  const fields = parseFields();
  let horizontalRowSum = 0;
  let verticalRowSum = 0;
  fields.forEach((field, i) => {
    const result = getSumWithSmudge(field, i);
    if (result.wasHorizontal) {
      horizontalRowSum += result.row! + 1;
    } else {
      verticalRowSum += result.row! + 1;
    }
  });

  return verticalRowSum + horizontalRowSum * 100;
}

function isHammingDistanceMatch(one: string, two: string, match: number): boolean {
  if (one.length !== two.length) throw new Error("Length needs to be the same");
  return hammingDistance(one, two) === match;
}

function testHorizontalReflection(field: string[], match: number): number[] {
  let index = -1;
  const foundReflections: number[] = [];
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
    if (index !== -1) {
      if (!foundReflections.includes(index)) foundReflections.push(index);
    }
  }

  return foundReflections;
}

const arrayColumn = (arr: string[][], n: number) => arr.map((x) => x[n]);
function testVerticalReflection(field: string[], match: number): number[] {
  const vField = field.map((l) => l.split(""));
  const rowLength = field[0].length;
  const foundReflections: number[] = [];
  let index = -1;
  for (let x = 0; x < rowLength; x++) {
    const checkRightCount = rowLength - x - 1;
    for (let checkCount = 0; checkCount < checkRightCount; checkCount++) {
      if (x - checkCount >= 0 && x + checkCount < rowLength) {
        const upperRow = arrayColumn(vField, x - checkCount).join("");
        const lowerRow = arrayColumn(vField, x + checkCount + 1).join("");
        if (isHammingDistanceMatch(upperRow, lowerRow, match)) {
          index = x;
        } else {
          index = -1;
          break;
        }
      }
    }
    if (index !== -1) {
      if (!foundReflections.includes(index)) foundReflections.push(index);
    }
  }
  return foundReflections;
}

function getSumWithSmudge(field: string[], i: number): SmudgeResult {
  let result: string[] = [];
  const hR = correctHorizontalSmudge([...field], i);
  if (!hR[1]) {
    const vR = correctVerticalSmudge([...field], i);
    if (!vR[1]) {
      throw new Error("WTF");
    } else {
      result = vR[0];
    }
  } else {
    result = hR[0];
  }
  const horizontalRows = testHorizontalReflection(result, 0);
  const verticalColumns = testVerticalReflection(result, 0);
  const smudgeResult = determineFoundIndex(horizontalRows, verticalColumns, i);
  return smudgeResult;
}

function correctVerticalSmudge(field: string[], fieldIndex: number): [string[], boolean] {
  const vField = field.map((l) => l.split(""));

  const rowLength = field[0].length;
  let xSmudgeIndex = -1;
  for (let x = 0; x < rowLength; x++) {
    const checkRightCount = rowLength - x - 1;
    for (let checkCount = 0; checkCount < checkRightCount; checkCount++) {
      if (x - checkCount >= 0 && x + checkCount < rowLength) {
        const upperRow = arrayColumn(vField, x - checkCount).join("");
        const lowerRow = arrayColumn(vField, x + checkCount + 1).join("");
        if (isHammingDistanceMatch(upperRow, lowerRow, 1)) {
          xSmudgeIndex = x - checkCount;
          const checkField = newFieldFromVert(upperRow, lowerRow, vField, rowLength, xSmudgeIndex);
          const hRef = testHorizontalReflection(checkField, 0);
          const vRef = testVerticalReflection(checkField, 0);
          if (isNewReflection(hRef, vRef, fieldIndex)) {
            return [checkField, true];
          } else {
            xSmudgeIndex = -1;
          }
        }
      }
    }
  }
  // Add one to index because we want the row not the index
  return [field, false];
}

function isNewReflection(hRef: number[], vRef: number[], fieldIndex: number): boolean {
  const oldReflection = oldReflectionMap.get(fieldIndex);
  if (oldReflection !== undefined) {
    if (oldReflection.row !== undefined) {
      if (oldReflection.wasHorizontal) {
        if (vRef.length > 0) return true;
        const filteredH = hRef.filter((v) => v !== oldReflection.row);
        if (filteredH.length > 0) return true;
      } else {
        if (hRef.length > 0) return true;
        const filteredV = vRef.filter((v) => v !== oldReflection.row);
        if (filteredV.length > 0) return true;
      }
    }
  }
  return false;
}

function newFieldFromVert(upperRow: string, lowerRow: string, vField: string[][], rowLength: number, xSmudgeIndex: number): string[] {
  const correctedField: string[] = [];
  const correctedUpperRow = correctSmudgeInString(upperRow, lowerRow).split("");
  for (let y = 0; y < vField.length; y++) {
    const correctedRow: string[] = [];
    for (let xR = 0; xR < rowLength; xR++) {
      if (xR !== xSmudgeIndex) {
        correctedRow.push(vField[y][xR]);
      } else {
        correctedRow.push(correctedUpperRow[y]);
      }
    }
    correctedField.push(correctedRow.join(""));
  }
  return correctedField;
}

function correctSmudgeInString(corrupt: string, correct: string): string {
  const index = getSmudgeIndex(corrupt, correct);
  const repaired = exchangeCharAtIndex(corrupt, index);
  return repaired;
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
function correctHorizontalSmudge(field: string[], fieldIndex: number): [string[], boolean] {
  const fieldLength = field.length;
  let ySmudgeIndex = -1;
  for (let y = 0; y < fieldLength; y++) {
    const checkRightCount = fieldLength - y - 1;
    for (let checkCount = 0; checkCount < checkRightCount; checkCount++) {
      if (y - checkCount >= 0 && y + checkCount < fieldLength) {
        const upperRow = field[y - checkCount];
        const lowerRow = field[y + checkCount + 1];
        if (isHammingDistanceMatch(upperRow, lowerRow, 1)) {
          ySmudgeIndex = y - checkCount;
          const fieldToTest = constructNewHField(upperRow, lowerRow, field, ySmudgeIndex);
          const hRef = testHorizontalReflection(fieldToTest, 0);
          const vRef = testVerticalReflection(fieldToTest, 0);
          if (isNewReflection(hRef, vRef, fieldIndex)) {
            return [fieldToTest, true];
          } else {
            ySmudgeIndex = -1;
          }
        }
      }
    }
  }
  return [field, false];
}
function constructNewHField(upperRow: string, lowerRow: string, field: string[], ySmudgeIndex: number) {
  const correctedField: string[] = [];
  const correctedUpperRow = correctSmudgeInString(upperRow, lowerRow);
  for (let yR = 0; yR < field.length; yR++) {
    if (yR !== ySmudgeIndex) {
      correctedField.push(field[yR]);
    } else {
      correctedField.push(correctedUpperRow);
    }
  }
  return correctedField;
}
