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
