// import * as fs from "fs";

import { rotateLeft, rotateRight } from '../util/array';
import { initialField } from './rocks';

// import { rotateLeft, rotateRight } from "../../util/array";

// const isSample = true;

export function GetInitialField(): string[] {
	return initialField.split('\n');
}

export function GetNorth(field: string[]): string[] {
	return rotateLeft(tilt(rotateRight(field)));
}

export function GetSouth(field: string[]): string[] {
	return rotateRight(tilt(rotateLeft(field)));
}
export function GetEast(field: string[]): string[] {
	return tilt(field);
}
export function GetWest(field: string[]): string[] {
	return rotateRight(rotateRight(tilt(rotateLeft(rotateLeft(field)))));
}

function tilt(field: string[]): string[] {
	const tiltedTowers: string[] = [];
	for (let y = 0; y < field.length; y++) {
		let loop = true;
		let replaced = field[y].replaceAll('O.', '.O');
		while (loop) {
			replaced = replaced.replaceAll('O.', '.O');
			loop = replaced.includes('O.');
		}

		tiltedTowers.push(replaced);
	}

	return tiltedTowers;
}

// function cycleN(field: string[], times: number): string[] {
//   let east = [...field];
//   const collision = new Map<string, number>();
//   for (let i = 0; i < times; i++) {
//     const north = rotateLeft(tilt(rotateRight(east)));
//     const west = rotateRight(rotateRight(tilt(rotateLeft(rotateLeft(north)))));
//     const south = rotateRight(tilt(rotateLeft(west)));
//     east = tilt(south);
//     const col = collision.get(hashGrid(east));
//     if (col !== undefined) {
//       const loopOrigin = collision.get(hashGrid(east));
//       const loopLength = i - loopOrigin!;
//       const remaining = 1000000000 - 1 - i;
//       const remainingIterations = remaining % loopLength;
//       for (let i = 0; i < remainingIterations; i++) {
//         const north = rotateLeft(tilt(rotateRight(east)));
//         const west = rotateRight(
//           rotateRight(tilt(rotateLeft(rotateLeft(north))))
//         );
//         const south = rotateRight(tilt(rotateLeft(west)));
//         east = tilt(south);
//       }
//       return east;
//     }

//     collision.set(hashGrid([...east]), i);
//   }
//   return east;
// }
// function hashGrid(grid: string[]): string {
//   return grid.join(",");
// }

// function calculateLoad(field: string[]): number {
//   let load = 0;
//   field.reverse().forEach((l, i) => {
//     const foundRockInLine = l.split("").filter((v) => v === "O");
//     load = load + foundRockInLine.length * (i + 1);
//   });
//   return load;
// }
