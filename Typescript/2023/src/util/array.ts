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
