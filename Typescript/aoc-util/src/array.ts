export function rotateRight(matrix: string[]): string[] {
  return matrix.map((_, colIndex) =>
    matrix
      .map((row) => row[colIndex])
      .reverse()
      .join(''),
  );
}

export function rotateLeft(matrix: string[]): string[] {
  return matrix
    .map((_, colIndex) => matrix.map((row) => row[colIndex]).join(''))
    .reverse();
}

export function sumOfNumbers(arr: number[]): number {
  if (arr.length === 0) throw new Error('Empty array passed, cant get sum');
  return arr.reduce((sum, curr) => sum + curr);
}

export function readSplitArrays(
  raw: string[],
  seperator: string,
  a: number[],
  b: number[],
) {
  return raw.forEach((line) => {
    const splitIDs = line.split(seperator);
    a.push(Number(splitIDs[0]));
    b.push(Number(splitIDs[1]));
  });
}

/**
 * Slices a given array in the horizontal x direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayRight<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  if (arr === undefined) throw new Error('Cant slice undefined array');
  let row = undefined;
  if (x + size <= arr[0]!.length) {
    row = arr[y]!.slice(x, x + size);
  }
  return row;
}

/**
 * Slices a given array in the negative horizontal x direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayLeft<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (x - size + 1 >= 0) {
    row = arr[y]!.slice(x - size + 1, x + 1).reverse();
  }
  return row;
}
