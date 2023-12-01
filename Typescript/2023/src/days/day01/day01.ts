import * as fs from "fs";
import { isNumber } from "../../util/numbers";

const isSample = false;

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
  ["one", "o1e"],
  ["two", "t2o"],
  ["three", "t3e"],
  ["four", "f4r"],
  ["five", "f5e"],
  ["six", "s6x"],
  ["seven", "s7n"],
  ["eight", "e8t"],
  ["nine", "n9n"]
]);

export function SolvePartOne(): number {
  const fileName = isSample
    ? "/src/days/day01/sample1.txt"
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
    ? "/src/days/day01/sample2.txt"
    : "/src/days/day01/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  let sum = 0;
  lines.forEach((line) => {
    const replacedLine = replaceInLine(line);
    const numbersInLine: string[] = replacedLine
      .split("")
      .filter((c) => isNumber(c));

    const add =
      numbersInLine.length === 1
        ? Number(numbersInLine[0] + numbersInLine[0])
        : Number(numbersInLine[0] + numbersInLine[numbersInLine.length - 1]);
    sum += add;
  });
  return sum;
}

function replaceInLine(line: string): string {
  let replaceLine = line;
  digits.forEach((d) => {
    replaceLine = replaceLine.replaceAll(d, digitMap.get(d) ?? "");
  });
  return replaceLine;
}
