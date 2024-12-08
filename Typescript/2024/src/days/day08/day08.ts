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

function getAntinodeLocations(maxX: number, maxY: number, AntennaLocations: Record<string, Point[]>): number {
  const antinodeLocations: Record<string, Point[]> = {};
  const possibleAntinodes: string[] = [];
  for (const antenna in AntennaLocations) {
    const antinodes = getAntinodeForAntenna(AntennaLocations[antenna], maxX, maxY);
    antinodeLocations[antenna] = antinodes;
    antinodes.forEach((a) => {
      if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
    });
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
  return getAntinodeLocations(lines[0].length, lines.length, AntennaLocations);
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day08/sample.txt" : "/src/days/day08/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const AntennaLocations: Record<string, Point[]> = getAntennaLocations(lines);
  const antinodesCount = getAntinodeCountOfAntennas(lines[0].length, lines.length, AntennaLocations);
  return antinodesCount;
}

function getAntinodeCountOfAntennas(maxX: number, maxY: number, antennaLocations: Record<string, Point[]>): number {
  const possibleAntinodes: string[] = [];
  for (const antenna in antennaLocations) {
    const allAntinodes = getAllAntinodes(antennaLocations[antenna], maxX, maxY);
    //In case we cooked wrong and got duplicates only add them once, should not affect the other stuff
    allAntinodes.forEach((a) => {
      if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
    });

    antennaLocations[antenna].forEach((a) => {
      if (!possibleAntinodes.includes(GetPointKey(a))) possibleAntinodes.push(GetPointKey(a));
    });
  }

  return possibleAntinodes.length;
}
//Ich darf nur die Punkte weitergehen die aus dem selben Antennenpaar entstanden sind!
function getAllAntinodes(antennas: Point[], maxX: number, maxY: number): Point[] {
  const antinodes: Point[] = [];
  for (let p1 = 0; p1 < antennas.length; p1++) {
    for (let p2 = 0; p2 < antennas.length; p2++) {
      //Only get positions if points are different
      if (p1 !== p2) {
        const antiNode: Point[] = fuckThisShit(antennas[p1], antennas[p2], maxX, maxY);
        antinodes.push(...antiNode);
      }
    }
  }
  return antinodes;
}

function fuckThisShit(orig1: Point, orig2: Point, maxX: number, maxY: number): Point[] {
  const antinodes: Point[] = [];
  let p1: Point = { X: orig1.X, Y: orig1.Y };
  let p2: Point = { X: orig2.X, Y: orig2.Y };
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const antinode: Point = calculateAntinodeBetweenPoints(p1, p2);

    if (!pointInBounds(antinode, maxX, maxY)) {
      break;
    }
    antinodes.push(antinode);
    p1 = { X: p2.X, Y: p2.Y };
    p2 = { X: antinode.X, Y: antinode.Y };
  }

  return antinodes;
}

function pointInBounds(p: Point, mX: number, mY: number): boolean {
  return p.X >= 0 && p.X < mX && p.Y >= 0 && p.Y < mY;
}
