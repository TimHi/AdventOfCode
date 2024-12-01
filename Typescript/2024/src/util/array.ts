export function rotateRight(matrix: string[]): string[] {
  return matrix.map((_, colIndex) =>
    matrix
      .map((row) => row[colIndex])
      .reverse()
      .join("")
  );
}

export function rotateLeft(matrix: string[]): string[] {
  return matrix.map((_, colIndex) => matrix.map((row) => row[colIndex]).join("")).reverse();
}

export function sumOfNumbers(arr: number[]): number {
  if (arr.length === 0) throw new Error("Empty array passed, cant get sum");
  return arr.reduce((sum, curr) => sum + curr);
}

export function readSplitArrays(raw: string[], seperator: string, a: number[], b: number[]) {
  return raw.forEach((line) => {
    const splitIDs = line.split(seperator);
    a.push(Number(splitIDs[0]));
    b.push(Number(splitIDs[1]));
  });
}
