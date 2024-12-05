import { getAllNumbersInString } from "aoc-util";
import * as fs from "fs";

const isSample = false;

function isValidManual(instructionSet: Map<number, number[]>, printOrder: number[]): boolean {
  printOrder.reverse();
  const printedChars: number[] = [];
  while (printOrder.length > 0) {
    const charToCheck = printOrder.pop()!;
    const needToPrintBefore = instructionSet.get(charToCheck) ?? [];
    //Rule is only relevant if both pages are present in the print order, of not yeet it
    const relevantPagesBefore = needToPrintBefore.filter((nP) => printOrder.includes(nP));
    if (relevantPagesBefore.some((rPB) => !printedChars.includes(rPB))) return false;
    printedChars.push(charToCheck);
  }

  return true;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  let currentInstruction = "X";
  let index = 0;
  //Key is the instruction and the value what has to come before
  const instructionSet: Map<number, number[]> = new Map();
  while (currentInstruction !== "") {
    currentInstruction = lines[index];
    const instructions = getAllNumbersInString(currentInstruction);
    if (instructionSet.has(instructions[1])) {
      const values = instructionSet.get(instructions[1]);
      values!.push(instructions[0]);
    } else {
      instructionSet.set(instructions[1], [instructions[0]]);
    }
    index++;
  }

  let middlePageResult = 0;

  for (let i = index; i < lines.length; i++) {
    const printOrder = getAllNumbersInString(lines[i]);
    const middleNumString = printOrder[Math.floor(printOrder.length / 2)];
    if (isValidManual(instructionSet, printOrder)) middlePageResult = middlePageResult + middleNumString;
  }

  return middlePageResult;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => l.split(""));

  return 0;
}
