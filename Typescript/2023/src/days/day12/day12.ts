import * as fs from "fs";

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

function parseReadings(shouldExpand: boolean): Reading[] {
  const fileName = isSample ? "/src/days/day12/sample.txt" : "/src/days/day12/full.txt";
  const readings: Reading[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      const splits = line.split(" ");
      let rawData = splits[0];
      if (shouldExpand) {
        rawData = rawData + "?" + rawData + "?" + rawData + "?" + rawData + "?" + rawData;
      }
      const groups = parseGroups(rawData);
      const springsToFill = splits[1].split(",").map((n) => Number(n));

      readings.push({ rawData: rawData, groups: groups, springsToFill: springsToFill, combinations: 0 });
    });
  return readings;
}

export function SolvePartOne(): number {
  const readings: Reading[] = parseReadings(false);
  let combinationPossibilities = 0;
  readings.forEach((reading) => (combinationPossibilities = combinationPossibilities + getPossibleCombinations(reading)));
  return combinationPossibilities;
}

export function SolvePartTwo(): number {
  const readings: Reading[] = parseReadings(true);
  let combinationPossibilities = 0;

  readings.forEach((reading, i) => {
    const start = performance.now();
    combinationPossibilities = combinationPossibilities + getPossibleCombinations(reading);
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
  const valid: string[] = [];
  const combinatios: string[] = getCombinations(reading.rawData);
  combinatios.forEach((c) => {
    const split = getSpringGroupLengths(c);
    let isValid = true;
    if (split.length === reading.springsToFill.length) {
      for (let i = 0; i < split.length; i++) {
        const element = split[i];
        if (element !== reading.springsToFill[i]) {
          isValid = false;
        }
      }
      if (isValid) valid.push(c);
    }
  });
  return valid.length;
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

//Split into two for . and #? Cache?
function getCombinations(input: string, currentIndex: number = 0, currentCombination: string = ""): string[] {
  if (currentIndex === input.length) {
    return [currentCombination];
  }
  const char = input[currentIndex];
  if (char === "?") {
    const combinationsWithHash = getCombinations(input, currentIndex + 1, currentCombination + "#");
    const combinationsWithDot = getCombinations(input, currentIndex + 1, currentCombination + ".");
    console.log("Combs with has");
    console.log(combinationsWithHash);
    console.log("Combs with dot");
    console.log(combinationsWithDot);
    return combinationsWithHash.concat(combinationsWithDot);
  } else {
    return getCombinations(input, currentIndex + 1, currentCombination + char);
  }
}

// ???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1
