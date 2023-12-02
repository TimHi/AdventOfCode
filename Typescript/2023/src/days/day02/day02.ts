import * as fs from "fs";

const isSample = true;

interface Colors {
  Red: number;
  Green: number;
  Blue: number;
}

export function SolvePartOne(): number {
  const fileName = isSample
    ? "/src/days/day02/sample.txt"
    : "/src/days/day02/full.txt";

  const limits: Colors = { Red: 12, Green: 13, Blue: 14 };
  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => checkGame(line, limits))
    .reduce((sum, current) => sum + current);
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

const green = /(\d+) green/;
const blue = /(\d+) blue/;
const red = /(\d+) red/;

function checkGame(gameData: string, limits: Colors): number {
  let isValid = true;
  const id = Number(
    gameData.substring(gameData.indexOf(" ") + 1, gameData.indexOf(":"))
  );
  gameData
    .substring(gameData.indexOf(": "))
    .split(";")
    .forEach((set) => {
      if (!isValidColor(set, green, limits.Green)) {
        isValid = false;
        return;
      }
      if (!isValidColor(set, blue, limits.Blue)) {
        isValid = false;
        return;
      }
      if (!isValidColor(set, red, limits.Red)) {
        isValid = false;
        return;
      }
    });

  return isValid ? id : 0;
}

function isValidColor(
  game: string,
  colorRegex: RegExp,
  limit: number
): boolean {
  const matchedColor = game.match(colorRegex);
  if (matchedColor) {
    const red = parseInt(matchedColor[0], 10);
    return red <= limit;
  }
  return true;
}
