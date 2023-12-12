import * as fs from "fs";
import { memoize } from "functools";

const isSample = true;

enum Tile {
  Spring = "#",
  Unkown = "?",
  Ground = "."
}

interface Reading {
  rawData: string;
  groups: Group[];
  springsToFill: number[];
  combinations: number;
}

interface Group {
  type: Tile;
  length: number;
}

function parseReadings(): Reading[] {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const readings: Reading[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      const splits = line.split(" ");
      const rawData = splits[0];

      const groups = parseGroups(rawData);

      const springsToFill = splits[1].split(",").map((n) => Number(n));

      readings.push({ rawData: rawData, groups: groups, springsToFill: springsToFill, combinations: 0 });
    });
  return readings;
}

export function SolvePartOne(): number {
  const readings: Reading[] = parseReadings();
  let combinationPossibilities = 0;
  const start = performance.now();
  readings.forEach((reading) => {
    const newPossibilities = getPossibleCombinations(reading);
    //console.log(`Reading: ${i}: ${newPossibilities} found`);
    combinationPossibilities += newPossibilities;
  });
  const end = performance.now();
  console.log(`Part 1: ${end - start} ms`);

  return combinationPossibilities;
}

export function SolvePartTwo(): number {
  const readings: Reading[] = parseReadings();
  let combinationPossibilities = 0;

  readings.forEach((reading, i) => {
    const start = performance.now();

    combinationPossibilities = combinationPossibilities + getUnfoldedCombinations(reading);

    const end = performance.now();
    const executionTime = end - start;
    console.log(`Execution time for Reading, ${i}: ${executionTime / 1000} seconds`);
  });
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
  return getCombinations(reading.rawData, reading.springsToFill).length;
}

function getUnfoldedCombinations(reading: Reading): number {
  const foldCount = 6;
  let possibleCombinations = 0;
  const foldedInput = reading.rawData + "?";
  const repeat = (arr: number[], n: number) => [].concat(...Array(n).fill(arr));

  let foundCombinations: string[] = [];
  for (let index = 0; index < foldCount - 1; index++) {
    if (index < foldCount - 2) {
      const combinationBlock = getCombinationsWithoutFilter(foldedInput);
      if (index === 0) {
        foundCombinations.push(...combinationBlock);
      } else {
        const finalNewCombinations: string[] = [];
        combinationBlock.forEach((c) => {
          const newCombinationInLoop: string[] = [];
          foundCombinations.forEach((fC) => {
            newCombinationInLoop.push(fC + c);
          });
          finalNewCombinations.push(...newCombinationInLoop);
        });
        foundCombinations = finalNewCombinations;
      }
    } else {
      const lastCombinations = getCombinationsWithoutFilter(reading.rawData);
      const finalNewCombinations: string[] = [];
      lastCombinations.forEach((c) => {
        const newCombinationInLoop: string[] = [];
        foundCombinations.forEach((fC) => {
          newCombinationInLoop.push(fC + c);
        });
        finalNewCombinations.push(...newCombinationInLoop);
      });
      foundCombinations = finalNewCombinations;
      console.log(foundCombinations[0].length);
    }
  }

  foundCombinations.forEach((c) => {
    if (c.length !== 39) {
      console.log("Wtf");
    }
    if (isCombinationValid(c, reading.springsToFill)) possibleCombinations++;
  });
  return possibleCombinations;
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
const getCombinationsWithoutFilter = memoize((input: string, currentIndex: number = 0, currentCombination: string = ""): string[] => {
  if (currentIndex === input.length) {
    return [currentCombination];
  }
  const char = input[currentIndex];
  if (char === "?") {
    const combinationsWithHash = uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + "#");
    const combinationsWithDot = uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + ".");
    return combinationsWithHash.concat(combinationsWithDot);
  } else {
    return uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + char);
  }
});

function uncachedGetCombinationsWithoutFilter(input: string, currentIndex: number = 0, currentCombination: string = ""): string[] {
  if (currentIndex === input.length) {
    return [currentCombination];
  }
  const char = input[currentIndex];
  if (char === "?") {
    const combinationsWithHash = uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + "#");
    const combinationsWithDot = uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + ".");
    return combinationsWithHash.concat(combinationsWithDot);
  } else {
    return uncachedGetCombinationsWithoutFilter(input, currentIndex + 1, currentCombination + char);
  }
}

function getCombinations(input: string, springGroups: number[], currentIndex: number = 0, currentCombination: string = ""): string[] {
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
