import { Direction, Point } from "aoc-util";
import * as fs from "fs";

import gaussShoelace from "gauss-shoelace";

const isSample = true;

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

  return dig(digInstructions);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const digInstructions: Dig[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => parseHexInstruction(l));
  return dig(digInstructions);
}

function dig(digInstructions: Dig[]): number {
  const digPoints: Point[] = [];
  let previousDigPoint: Point = { X: 0, Y: 0 };
  let stepSum = 0;
  digInstructions.forEach((instruction) => {
    stepSum += instruction.steps;
    const newPoints = getDirectionDelta(instruction.direction, previousDigPoint, instruction.steps);
    previousDigPoint = newPoints[newPoints.length - 1];
    digPoints.push(...newPoints);
  });

  return getInnerPolygonArea(digPoints, stepSum + 1);
}

function getInnerPolygonArea(points: Point[], stepLength: number): number {
  const shoelacePoints: Array<[number, number]> = [];
  points.forEach((v) => {
    shoelacePoints.push([v.X, v.Y]);
  });
  //Part 2 is off by one for some reason
  const shoelace = gaussShoelace(shoelacePoints);
  //const innerPoints = -Math.floor(stepLength / 2) + 1 + shoelace;
  //const result = innerPoints + stepLength;
  const result = shoelace + Math.round(stepLength / 2);
  return result;
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

  switch (direction) {
    case Direction.N:
      pointsBetween.push({ X: p.X, Y: p.Y - steps });
      break;
    case Direction.E:
      pointsBetween.push({ X: p.X + steps, Y: p.Y });
      break;
    case Direction.S:
      pointsBetween.push({ X: p.X, Y: p.Y + steps });
      break;
    case Direction.W:
      pointsBetween.push({ X: p.X - steps, Y: p.Y });
      break;
  }

  return pointsBetween;
}

function parseHexInstruction(instruction: string): Dig {
  const splits = instruction.split(" ");
  const hex = splits[2].replaceAll("(", "").replaceAll(")", "").replaceAll("#", "");
  const steps = parseInt(hex.substring(0, 5), 16);
  if (isNaN(steps)) {
    throw new Error("Invalid hexadecimal string");
  }
  const direction = parseInt(hex.substring(5), 16);
  if (isNaN(direction)) {
    throw new Error("Invalid hexadecimal string");
  }

  switch (direction) {
    case 0:
      return { direction: Direction.E, steps: steps };
    case 1:
      return { direction: Direction.S, steps: steps };
    case 2:
      return { direction: Direction.W, steps: steps };
    case 3:
      return { direction: Direction.N, steps: steps };
  }

  throw new Error("Failed parsing line: " + instruction);
}
