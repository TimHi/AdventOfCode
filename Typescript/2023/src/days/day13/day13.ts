import * as fs from "fs";
const isSample = false;

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

function transposeArray(matrix: string[][]): string[][] {
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

export function SolvePartOne(): number {
  const fields = parseFields();
  let horSum = 0;
  let vertSum = 0;
  fields.forEach((field) => {
    const horizontal = getHorizontalReflection(field);
    if (horizontal !== undefined) {
      horSum += horizontal + 1;
    } else {
      const originalToTranspose = field.map((l) => l.split(""));
      const transposedField = transposeArray(originalToTranspose);
      const reconstructedField: string[] = [];
      transposedField.forEach((l) => reconstructedField.push(l.join("")));
      const horizontal = getHorizontalReflection(reconstructedField);
      if (horizontal !== undefined) {
        vertSum += horizontal + 1;
      } else {
        throw new Error("Its fucked");
      }
    }
    console.log("\n");
  });

  return horSum * 100 + vertSum;
}

export function SolvePartTwo(): number {
  const transposeMap = new Map<number, boolean>();
  const fields = parseFields();
  const correctedFields: string[][] = [];
  for (let index = 0; index < fields.length; index++) {
    const copy = [...fields[index]];
    const c = correctSmudgeLine(copy);
    if (c !== undefined) correctedFields.push(c);
    else {
      const originalToTranspose = copy.map((l) => l.split(""));
      const transposedField = transposeArray(originalToTranspose);
      const reconstructedField: string[] = [];
      transposedField.forEach((l) => reconstructedField.push(l.join("")));
      const c = correctSmudgeLine(reconstructedField);
      if (c !== undefined) {
        correctedFields.push(c);
        transposeMap.set(index, true);
      } else {
        throw new Error("Aal");
      }
    }
  }
  let horSum = 0;
  let vertSum = 0;
  correctedFields.forEach((field, i) => {
    console.log(i);
    const horizontal = getHorizontalReflection(field);
    if (horizontal === undefined) {
      const originalToTranspose = field.map((l) => l.split(""));
      const transposedField = transposeArray(originalToTranspose);
      const reconstructedField: string[] = [];
      transposedField.forEach((l) => reconstructedField.push(l.join("")));
      const horizontal = getHorizontalReflection(reconstructedField);
      if (horizontal !== undefined) {
        vertSum += horizontal + 1;
      } else {
        throw new Error("Its fucked");
      }
    } else {
      const wasTransposed = transposeMap.get(i);
      if (wasTransposed !== undefined && wasTransposed) {
        vertSum += horizontal + 1;
      } else {
        horSum += horizontal + 1;
      }
    }
  });
  return horSum * 100 + vertSum;
}

function exchangeCharAtIndex(input: string, index: number): string {
  if (input[index] === ".") return input.substring(0, index) + "#" + input.substring(index + 1);
  else return input.substring(0, index) + "." + input.substring(index + 1);
}

function correctSmudgeLine(field: string[]): string[] | undefined {
  let smudgeLineIndex = 0;
  let isFound = false;
  for (let yIndex = 0; yIndex < field.length - 1; yIndex++) {
    let stepCount = 1;
    if (isFound) break;
    for (let upperSide = yIndex; upperSide >= 0; upperSide--) {
      const upperRow = field[upperSide];
      let lowerRow = undefined;
      if (yIndex + stepCount < field.length) {
        lowerRow = field[yIndex + stepCount];
        const hammingDist = getHammingDistance(lowerRow, upperRow);
        if (hammingDist === 1) {
          smudgeLineIndex = upperSide;
          isFound = true;
          break;
        }
      }
      stepCount++;
    }
  }
  if (isFound) {
    const correctedField: string[] = [];
    let correctedRow: string = "";
    for (let i = 0; i < field.length; i++) {
      const currentRow = field[i];
      const nextRow = field[i + 1];
      if (i === smudgeLineIndex) {
        const maxLength = Math.max(currentRow.length, nextRow.length);
        for (let i = 0; i < maxLength; i++) {
          const char1 = currentRow.charCodeAt(i) || 0;
          const char2 = nextRow.charCodeAt(i) || 0;

          if ((char1 ^ char2) !== 0) {
            correctedRow = exchangeCharAtIndex(currentRow, i);
            correctedField.push(correctedRow);
            break;
          }
        }
      } else {
        correctedField.push(currentRow);
      }
    }

    return correctedField;
  } else {
    return undefined;
  }
}

function getHammingDistance(cur: string, next: string): number {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const hammingDistance = require("hamming");
  if (cur.length !== next.length) throw new Error("Lines need to have the same length");
  return hammingDistance(cur, next);
}

function prettyPrintField(field: string[]) {
  field.forEach((l) => console.log(l));
}

/// Test each Y Index by comparing each row below and above the index
function getHorizontalReflection(field: string[]): number | undefined {
  for (let yIndex = 0; yIndex < field.length - 1; yIndex++) {
    let stepCount = 1;
    let isReflection = true;
    for (let upperSide = yIndex; upperSide >= 0; upperSide--) {
      const upperRow = field[upperSide];
      let lowerRow = undefined;
      if (yIndex + stepCount < field.length) {
        lowerRow = field[yIndex + stepCount];
      } else {
        //Reached edge, ignore rest
        isReflection = true;
        break;
      }
      if (upperRow !== lowerRow) {
        isReflection = false;
        break;
      }
      stepCount++;
    }
    if (isReflection) {
      return yIndex;
    }
  }

  return undefined;
}
