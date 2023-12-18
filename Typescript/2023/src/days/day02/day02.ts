import * as fs from "fs";

const isSample = false;

interface Colors {
  Red: number;
  Green: number;
  Blue: number;
}

const GREEN_REGEX = /(\d+) green/;
const BLUE_REGEX = /(\d+) blue/;
const RED_REGEX = /(\d+) red/;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day02/sample.txt" : "/src/days/day02/full.txt";

  const limits: Colors = { Red: 12, Green: 13, Blue: 14 };
  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => checkGameValidity(line, limits))
    .reduce((sum, current) => sum + current);
}

function checkGameValidity(gameData: string, limits: Colors): number {
  let isValid = true;
  const id = Number(gameData.substring(gameData.indexOf(" ") + 1, gameData.indexOf(":")));
  gameData
    .substring(gameData.indexOf(": "))
    .split(";")
    .forEach((set) => {
      if (!isValidColor(set, GREEN_REGEX, limits.Green)) {
        isValid = false;
        return;
      }
      if (!isValidColor(set, BLUE_REGEX, limits.Blue)) {
        isValid = false;
        return;
      }
      if (!isValidColor(set, RED_REGEX, limits.Red)) {
        isValid = false;
        return;
      }
    });

  return isValid ? id : 0;
}

function isValidColor(game: string, colorRegex: RegExp, limit: number): boolean {
  const matchedColor = game.match(colorRegex);
  if (matchedColor) {
    const color = parseInt(matchedColor[0], 10);
    return color <= limit;
  }
  return true;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day02/sample.txt" : "/src/days/day02/full.txt";

  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => getMinCubes(line))
    .reduce((sum, current) => sum + current);
}

function getMinCubes(gameData: string): number {
  const green: number[] = [];
  const blue: number[] = [];
  const red: number[] = [];

  gameData
    .substring(gameData.indexOf(": "))
    .split(";")
    .forEach((set) => {
      green.push(getColorValue(set, GREEN_REGEX));
      blue.push(getColorValue(set, BLUE_REGEX));
      red.push(getColorValue(set, RED_REGEX));
    });

  return Math.max(...green) * Math.max(...blue) * Math.max(...red);
}

function getColorValue(game: string, colorRegex: RegExp): number {
  const matchedColor = game.match(colorRegex);
  if (matchedColor) {
    return parseInt(matchedColor[0], 10);
  }
  return 0;
}
