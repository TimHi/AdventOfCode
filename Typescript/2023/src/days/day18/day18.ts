import * as fs from "fs";
import { Direction, Point } from "../../util/coords";
import gaussShoelace from "gauss-shoelace";

const isSample = false;

interface Dig {
  direction: Direction;
  steps: number;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const digInstructions: Dig[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const splits = l.split(" ");
      return { direction: getDirectionFromInput(splits[0]), steps: Number(splits[1]) };
    });

  //const digPoints: Point[] = [{ X: 0, Y: 0 }];
  const digPoints: Point[] = [];
  let previousDigPoint: Point = { X: 0, Y: 0 };
  digInstructions.forEach((instruction) => {
    const newPoints = getDirectionDelta(instruction.direction, previousDigPoint, instruction.steps);
    previousDigPoint = newPoints[newPoints.length - 1];
    digPoints.push(...newPoints);
  });

  return getPolyArea(digPoints) + digPoints.length;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function getPolyArea(digPoints: Point[]): number {
  const shoelacePoints: Array<[number, number]> = [];
  digPoints.forEach((v) => {
    shoelacePoints.push([v.X, v.Y]);
  });
  const shoelace = gaussShoelace(shoelacePoints);
  const innerPoints = -shoelacePoints.length / 2 + 1 + shoelace;
  return innerPoints;
}

function getDirectionFromInput(i: string): Direction {
  switch (i) {
    case "R":
      return Direction.E;
    case "U":
      return Direction.N;
    case "D":
      return Direction.S;
    case "L":
      return Direction.W;
    default:
      throw new Error("Unknown direction");
  }
}

function getDirectionDelta(direction: Direction, p: Point, steps: number): Point[] {
  const pointsBetween: Point[] = [];
  let previousDigPoint: Point = p;
  for (let index = 0; index < steps; index++) {
    switch (direction) {
      case Direction.N:
        pointsBetween.push({ X: previousDigPoint.X, Y: previousDigPoint.Y - 1 });
        break;
      case Direction.E:
        pointsBetween.push({ X: previousDigPoint.X + 1, Y: previousDigPoint.Y });
        break;
      case Direction.S:
        pointsBetween.push({ X: previousDigPoint.X, Y: previousDigPoint.Y + 1 });
        break;
      case Direction.W:
        pointsBetween.push({ X: previousDigPoint.X - 1, Y: previousDigPoint.Y });
        break;
    }
    previousDigPoint = pointsBetween[pointsBetween.length - 1];
  }

  return pointsBetween;
}
