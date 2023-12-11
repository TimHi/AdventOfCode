import * as fs from "fs";
import { Point, getManhattanDistance } from "../../util/coords";

const isSample = true;

export function SolvePartOne(): number {
  const planetMap = parseGalaxy(1);
  const distanceMap = new Map<string, number>();
  let distSum = 0;
  planetMap.forEach((fromPoint, fromKey) => {
    planetMap.forEach((toPoint, toKey) => {
      if (fromKey !== toKey) {
        if (!distanceMap.has(`${fromKey}<->${toKey}`) && !distanceMap.has(`${toKey}<->${fromKey}`)) {
          const distance = getManhattanDistance(fromPoint, toPoint);
          distSum = distSum + distance;
          distanceMap.set(`${fromKey}<->${toKey}`, distance);
        }
      }
    });
  });

  return distSum;
}

export function SolvePartTwo(): number {
  const expandRows = isSample ? 10 : 1000000;
  const planetMap = parseGalaxy(expandRows);
  const distanceMap = new Map<string, number>();
  let distSum = 0;
  planetMap.forEach((fromPoint, fromKey) => {
    planetMap.forEach((toPoint, toKey) => {
      if (fromKey !== toKey) {
        if (!distanceMap.has(`${fromKey}<->${toKey}`) && !distanceMap.has(`${toKey}<->${fromKey}`)) {
          const distance = getManhattanDistance(fromPoint, toPoint);
          distSum = distSum + distance;
          distanceMap.set(`${fromKey}<->${toKey}`, distance);
        }
      }
    });
  });

  return distSum;
}

function parseGalaxy(expand: number): Map<string, Point> {
  const fileName = isSample ? "/src/days/day11/sample.txt" : "/src/days/day11/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const planetMap = new Map<string, Point>();
  const expandHorizontally: number[] = [];
  const expandVertically: number[] = [];
  for (let yIndex = 0; yIndex < lines.length; yIndex++) {
    const row = lines[yIndex];
    const emptyRow = row.every((v) => v === ".");
    if (emptyRow) expandVertically.push(yIndex);
  }
  for (let xIndex = 0; xIndex < lines[0].length; xIndex++) {
    let emptyCol = true;
    for (let colIndex = 0; colIndex < lines.length; colIndex++) {
      if (lines[colIndex][xIndex] !== ".") {
        emptyCol = false;
        break;
      }
    }
    if (emptyCol) expandHorizontally.push(xIndex);
  }
  //Part 1
  if (expand === 1) {
    lines.forEach((row, yIndex) => {
      row.forEach((_, xIndex) => {
        if (lines[yIndex][xIndex] === "#") {
          const yExpand = expandVertically.filter((v) => v <= yIndex);
          const xExpand = expandHorizontally.filter((v) => v <= xIndex);
          const planetCoordinate: Point = { X: xIndex + xExpand.length, Y: yIndex + yExpand.length };
          planetMap.set(getMapKey(planetCoordinate), planetCoordinate);
        }
      });
    });
  } else {
    // Part 2
    lines.forEach((row, yIndex) => {
      row.forEach((_, xIndex) => {
        if (lines[yIndex][xIndex] === "#") {
          const yExpand = expandVertically.filter((v) => v <= yIndex);
          const xExpand = expandHorizontally.filter((v) => v <= xIndex);
          if (yExpand.length > 0 && xExpand.length === 0) {
            const planetCoordinate: Point = { X: xIndex, Y: yIndex + yExpand.length * (expand - 1) };
            planetMap.set(getMapKey(planetCoordinate), planetCoordinate);
          } else if (xExpand.length > 0 && yExpand.length === 0) {
            const planetCoordinate: Point = { X: xIndex + xExpand.length * (expand - 1), Y: yIndex };
            planetMap.set(getMapKey(planetCoordinate), planetCoordinate);
          } else if (yExpand.length > 0 && xExpand.length > 0) {
            const planetCoordinate: Point = { X: xIndex + xExpand.length * (expand - 1), Y: yIndex + yExpand.length * (expand - 1) };
            planetMap.set(getMapKey(planetCoordinate), planetCoordinate);
          } else if (yExpand.length === 0 && xExpand.length === 0) {
            const planetCoordinate: Point = { X: xIndex, Y: yIndex };
            planetMap.set(getMapKey(planetCoordinate), planetCoordinate);
          } else {
            throw new Error("Should not be possible");
          }
        }
      });
    });
  }

  return planetMap;
}

function getMapKey(point: Point): string {
  return `${point.X}-${point.Y}`;
}
