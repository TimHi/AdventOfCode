import { Point } from "aoc-util";
import { HashMap } from "data-structure-typed";
import * as fs from "fs";

const isSample = true;
function getAntennaLocations(map: string[][]): HashMap<string, Point[]> {
  const antennaLocations: HashMap<string, Point[]> = new HashMap();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const antenna = map[y][x];

      if (antenna !== ".") {
        const location: Point = { X: x, Y: y };
        if (antennaLocations.has(antenna)) {
          const locations = antennaLocations.get(antenna);
          if (locations === undefined) throw new Error("Antenna locations in map should not be undefined");
          locations.push(location);
          antennaLocations.set(antenna, locations);
        } else {
          antennaLocations.set(antenna, [location]);
        }
      }
    }
  }
  return antennaLocations;
}

function getAntinodeLocations(maxX: number, maxY: number, AntennaLocations: HashMap<string, Point[]>): HashMap<string, Point[]> {
  const antinodeLocations: HashMap<string, Point[]> = new HashMap();
  return antinodeLocations;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day08/sample.txt" : "/src/days/day08/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));
  const AntennaLocations: HashMap<string, Point[]> = getAntennaLocations(lines);
  const AntinodeLocations: HashMap<string, Point[]> = getAntinodeLocations(lines[0].length, lines.length, AntennaLocations);
  return 0;
}

export function SolvePartTwo(): number {
  return 0;
}
