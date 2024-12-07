import { getAllNumbersInString } from "aoc-util";
import * as fs from "fs";

const isSample = true;

function parsePageRules(lines: string[]): Map<number, number[]> {
  let index = 0;
  const instructionSet: Map<number, number[]> = new Map();
  let currentInstruction = "X";
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
  return instructionSet;
}

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

  //Key is the instruction and the value what has to come before
  const instructionSet: Map<number, number[]> = parsePageRules(lines);

  let middlePageResult = 0;
  const index = lines.findIndex((l) => l === "") + 1;

  for (let i = index; i < lines.length; i++) {
    const printOrder = getAllNumbersInString(lines[i]);
    const middleNumString = printOrder[Math.floor(printOrder.length / 2)];
    if (isValidManual(instructionSet, printOrder)) middlePageResult = middlePageResult + middleNumString;
  }

  return middlePageResult;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  const instructionSet: Map<number, number[]> = parsePageRules(lines);
  const index = lines.findIndex((l) => l === "") + 1;
  let middlePageResult = 0;
  //Do the same stuff as in Part 1 but track the broken ones, could be unified into one iteration but who cares am I right
  for (let i = index; i < lines.length; i++) {
    const printOrder = getAllNumbersInString(lines[i]);
    let t = [...printOrder];
    if (!isValidManual(instructionSet, [...t])) {
      //Just shuffle the shit around until we are done
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (!isValidManual(instructionSet, [...t])) {
          t = fixManual(instructionSet, [...t]);
        } else {
          const middleNumString = t[Math.floor(t.length / 2)];
          middlePageResult += middleNumString;
          break;
        }
      }
    }
  }

  return middlePageResult;
}

function fixManual(instructionSet: Map<number, number[]>, manual: number[]): number[] {
  let printOrder = [...manual];

  printOrder.reverse();
  const printedChars: number[] = [];
  while (printOrder.length > 0) {
    const charToCheck = printOrder.pop()!;
    const needToPrintBefore = instructionSet.get(charToCheck) ?? [];
    //Rule is only relevant if both pages are present in the print order, of not yeet it
    const mustBeBefore = needToPrintBefore.filter((nP) => printOrder.includes(nP));
    if (mustBeBefore.some((rPB) => !printedChars.includes(rPB))) {
      mustBeBefore.push(charToCheck);
      printedChars.push(...mustBeBefore);
      printOrder = printOrder.filter((pO) => !mustBeBefore.includes(pO));
    } else {
      printedChars.push(charToCheck);
    }
  }

  return printedChars;
}
