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

/**
 * Slices a given array in the positive vertical y direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayUp<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (y - size + 1 >= 0) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y - i]![x]!);
    }
  }
  return row;
}

/**
 * Slices a given array in the negative vertical y direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayDown<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (y + size <= arr.length) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y + i]![x]!);
    }
  }
  return row;
}

/**
 * Slices a given array in the diag right up direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayDiagRightUp<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (x + size - 1 <= arr[0]!.length && y - size + 1 >= 0) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y - i]![x + i]!);
    }
  }
  return row;
}

/**
 * Slices a given array in the diag right down direction for a given size.
 * In case the desired slice would be out of bounds the method returns undefined.
 * @param x x start position
 * @param y y start position
 * @param size desired size of slice
 * @param arr array to slice
 * @returns slice of the passed array
 */
export function Slice2DArrayDiagRightDown<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (x + size <= arr[0]!.length && y + size <= arr.length) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y + i]![x + i]!);
    }
  }
  return row;
}

export function Slice2DArrayDiagLeftDown<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (x - size + 1 >= 0 && y + size <= arr.length) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y + i]![x - i]!);
    }
  }
  return row;
}

export function Slice2DArrayDiagLeftUp<T>(
  x: number,
  y: number,
  size: number,
  arr: T[][],
): T[] | undefined {
  let row: T[] | undefined = undefined;
  if (x - size + 1 >= 0 && y - size + 1 >= 0) {
    row = [];

    for (let i = 0; i < size; i++) {
      row.push(arr[y - i]![x - i]!);
    }
  }
  return row;
}
