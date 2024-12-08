import { GetPointKey, Point } from "aoc-util";

import * as fs from "fs";

const isSample = true;
function getAntennaLocations(map: string[][]): Record<string, Point[]> {
  const antennaLocations: Record<string, Point[]> = {};

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const antenna = map[y][x];

      if (antenna !== ".") {
        const location: Point = { X: x, Y: y };
        if (antennaLocations[antenna] !== undefined) {
          const locations = antennaLocations[antenna];
          locations.push(location);
          antennaLocations[antenna] = locations;
        } else {
          antennaLocations[antenna] = [location];
        }
      }
    }
  }
  return antennaLocations;
}

function calculateAntinodeBetweenPoints(p1: Point, p2: Point): Point {
  //Direction of vec between points p2 - p1:

  const xDir = p2.X - p1.X;
  const yDir = p2.Y - p1.Y;
  const antinode = { X: p2.X + xDir, Y: p2.Y + yDir };
  return antinode;
}

function calculateAllAntinodeBetweenPoints(p1: Point, p2: Point, maxX: number, maxY: number): Point[] {
  const antinodes: Point[] = [];
  const xDir = p2.X - p1.X;
  const yDir = p2.Y - p1.Y;
  let index = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const antinode = { X: p2.X * index + xDir, Y: p2.Y * index + yDir };

    if (antinode.X >= 0 && antinode.X < maxX && antinode.Y >= 0 && antinode.Y < maxY) {
      antinodes.push(antinode);
    } else {
      break;
    }
    index++;
  }

  return antinodes;
}

function getAllAntinodesForAntenna(positions: Point[], maxX: number, maxY: number): Point[] {
  const antinodes: Point[] = [];
  for (let p1 = 0; p1 < positions.length; p1++) {
    for (let p2 = 0; p2 < positions.length; p2++) {
      //Only get positions if points are different
      if (p1 !== p2) {
        const antiNodesFromPoint: Point[] = calculateAllAntinodeBetweenPoints(positions[p1], positions[p2], maxX, maxY);
        antinodes.push(...antiNodesFromPoint);
      }
    }
  }
  return antinodes;
}

function getAntinodeForAntenna(positions: Point[], maxX: number, maxY: number): Point[] {
  const antinodes: Point[] = [];
  for (let p1 = 0; p1 < positions.length; p1++) {
    for (let p2 = 0; p2 < positions.length; p2++) {
      //Only get positions if points are different
      if (p1 !== p2) {
        const antiNode: Point = calculateAntinodeBetweenPoints(positions[p1], positions[p2]);
        //Only add if is in bounds
        if (antiNode.X >= 0 && antiNode.X < maxX && antiNode.Y >= 0 && antiNode.Y < maxY) {
          antinodes.push(antiNode);
        }
      }
    }
  }
  return antinodes;
}

function getAntinodeLocations(maxX: number, maxY: number, AntennaLocations: Record<string, Point[]>, isPartOne: boolean): number {
  const antinodeLocations: Record<string, Point[]> = {};
  const possibleAntinodes: string[] = [];
  for (const antenna in AntennaLocations) {
    if (isPartOne) {
      const antinodes = getAntinodeForAntenna(AntennaLocations[antenna], maxX, maxY);
      antinodeLocations[antenna] = antinodes;
      antinodes.forEach((a) => {
        if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
      });
    } else {
      const antinodes = getAllAntinodesForAntenna(AntennaLocations[antenna], maxX, maxY);
      const aOfA = getAllAntinodesForAntenna(antinodes, maxX, maxY);
      antinodeLocations[antenna] = antinodes;
      antinodes.forEach((a) => {
        if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
      });
      aOfA.forEach((a) => {
        if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
      });
      console.log(possibleAntinodes);
    }
  }

  return possibleAntinodes.length;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day08/sample.txt" : "/src/days/day08/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const AntennaLocations: Record<string, Point[]> = getAntennaLocations(lines);
  return getAntinodeLocations(lines[0].length, lines.length, AntennaLocations, true);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day08/sample.txt" : "/src/days/day08/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const AntennaLocations: Record<string, Point[]> = getAntennaLocations(lines);
  return getAntinodeLocations(lines[0].length, lines.length, AntennaLocations, false);
}
