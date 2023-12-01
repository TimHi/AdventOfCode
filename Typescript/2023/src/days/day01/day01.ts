import * as fs from "fs";
import { isNumber } from "../../util/numbers";

const isSample = true;

const digits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
];
const digitMap = new Map<string, string>([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"]
]);

export function SolvePartOne(): number {
  const fileName = isSample
    ? "/src//days/day01/sample1.txt"
    : "/src/days/day01/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  let sum = 0;
  lines.forEach((line) => {
    const numbersInLine: string[] = line.split("").filter((c) => isNumber(c));
    sum +=
      numbersInLine.length === 1
        ? Number(numbersInLine[0] + numbersInLine[0])
        : Number(numbersInLine[0] + numbersInLine[numbersInLine.length - 1]);
  });
  return sum;
}

export function SolvePartTwo(): number {
  const fileName = isSample
    ? "/src//days/day01/sample2.txt"
    : "/src/days/day01/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  let sum = 0;
  lines.forEach((line) => {
    const replacedLine = replaceInLine(line);
    const numbersInLine: string[] = replacedLine
      .split("")
      .filter((c) => isNumber(c));
    sum +=
      numbersInLine.length === 1
        ? Number(numbersInLine[0] + numbersInLine[0])
        : Number(numbersInLine[0] + numbersInLine[numbersInLine.length - 1]);
  });
  return sum;
}

function replaceInLine(line: string): string {
  return "";
}
