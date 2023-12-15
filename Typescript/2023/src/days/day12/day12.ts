import * as fs from "fs";
import { getUnfoldedCombinations } from "./part2";

const isSample = true;

enum Tile {
  Spring = "#",
  Unkown = "?",
  Ground = "."
}

export interface Reading {
  rawData: string;
  groups: Group[];
  springsToFill: number[];
  combinations: number;
}

interface Group {
  type: Tile;
  length: number;
}

function parseReadings(expand: boolean): Reading[] {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const readings: Reading[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      const splits = line.split(" ");
      const rawData = expand ? splits[0] + "?" + splits[0] + "?" + splits[0] + "?" + splits[0] + "?" + splits[0] : splits[0];

      const groups = parseGroups(rawData);

      let springsToFill = splits[1].split(",").map((n) => Number(n));
      if (expand) springsToFill = [...springsToFill, ...springsToFill, ...springsToFill, ...springsToFill, ...springsToFill];
      readings.push({ rawData: rawData, groups: groups, springsToFill: springsToFill, combinations: 0 });
    });
  return readings;
}

export function SolvePartOne(): number {
  const readings: Reading[] = parseReadings(false);
  let combinationPossibilities = 0;
  const start = performance.now();
  readings.forEach((reading) => {
    const newPossibilities = getPossibleCombinations(reading);
    combinationPossibilities += newPossibilities;
  });
  const end = performance.now();
  console.log(`Part 1: ${end - start} ms`);

  return combinationPossibilities;
}

export function SolvePartTwo(): number {
  const readings: Reading[] = parseReadings(true);
  const combinationPossibilities: number = readings
    .map((reading) => getUnfoldedCombinations(reading))
    .reduce((prev, cur) => (cur = prev + cur));
  return combinationPossibilities;
}

function getTileFromData(data: string): Tile {
  switch (data) {
    case "#":
      return Tile.Spring;
    case ".":
      return Tile.Ground;
    case "?":
      return Tile.Unkown;
    default:
      throw new Error("Unknown Data, can't get tile");
  }
}

function parseGroups(input: string): Group[] {
  const groups: Group[] = [];
  let currentType: Tile | null = null;
  let currentLength = 0;

  for (const char of input) {
    const tileType = getTileFromData(char);

    if (tileType === currentType) {
      currentLength++;
    } else {
      if (currentType !== null) {
        groups.push({ type: currentType, length: currentLength });
      }

      currentType = tileType;
      currentLength = 1;
    }
  }
  if (currentType !== null) {
    groups.push({ type: currentType, length: currentLength });
  }

  return groups;
}

function getPossibleCombinations(reading: Reading): number {
  return getCombinations(reading.rawData, reading.springsToFill, 0, "").length;
}

function getSpringGroupLengths(input: string): number[] {
  const groupLengths: number[] = [];

  let currentLength = 0;
  let inGroup = false;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "#") {
      currentLength++;
      inGroup = true;
    } else if (inGroup) {
      groupLengths.push(currentLength);
      currentLength = 0;
      inGroup = false;
    }
  }

  if (inGroup) {
    groupLengths.push(currentLength);
  }

  return groupLengths;
}

function getCombinations(input: string, springGroups: number[], currentIndex: number, currentCombination: string): string[] {
  if (currentIndex === input.length) {
    return [currentCombination];
  }
  const char = input[currentIndex];
  if (char === "?") {
    const combinationsWithHash = getCombinations(input, springGroups, currentIndex + 1, currentCombination + "#");
    const combinationsWithDot = getCombinations(input, springGroups, currentIndex + 1, currentCombination + ".");
    const combined = combinationsWithHash.concat(combinationsWithDot);
    const filtered = combined.filter((c) => isCombinationValid(c, springGroups));
    return filtered;
  } else {
    return getCombinations(input, springGroups, currentIndex + 1, currentCombination + char);
  }
}

function isCombinationValid(combination: string, springsToFill: number[]) {
  const split = getSpringGroupLengths(combination);
  if (split.length === springsToFill.length) {
    for (let i = 0; i < split.length; i++) {
      const element = split[i];
      if (element !== springsToFill[i]) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}
