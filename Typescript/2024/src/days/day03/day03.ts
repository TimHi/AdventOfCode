import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";

const isSample = true;
const MULT_REGEX: RegExp = new RegExp("mul\\(\\d+,\\d+\\)", "g");

const DONT_REGEX: RegExp = new RegExp("don't", "g");
const DO_REGEX: RegExp = new RegExp("do", "g");
function readInput(): string {
  const fileName = isSample ? "/src/days/day03/sample.txt" : "/src/days/day03/full.txt";
  return fs.readFileSync(process.cwd() + fileName, "utf8");
}

function wasMultOperationEnabledBeforeMultOperation(enable: number[], disable: number[], match: RegExpMatchArray): boolean {
  let enableUnderMatchIndex = -1;
  let disableUnderMatchIndex = -1;
  if (match.index === undefined) throw new Error("index");
  const matchIndex = match.index;

  for (const e of enable) {
    if (e < matchIndex && e > enableUnderMatchIndex) {
      enableUnderMatchIndex = e;
    }
  }
  for (const d of disable) {
    if (d < matchIndex && d > disableUnderMatchIndex) {
      disableUnderMatchIndex = d;
    }
  }

  return enableUnderMatchIndex > disableUnderMatchIndex;
}

export function SolvePartOne(): number {
  const instruction = readInput();
  const multOperations = instruction.matchAll(MULT_REGEX);
  let multResult = 0;
  for (const match of multOperations) {
    const digits = getAllNumbersInString(match[0]);
    multResult = multResult + digits[0] * digits[1];
  }
  return multResult;
}

export function SolvePartTwo(): number {
  const instruction = readInput();
  const multOperations = instruction.matchAll(MULT_REGEX);
  let multResult = 0;

  const disable: number[] = [...instruction.matchAll(DONT_REGEX)].map((r) => r.index ?? -1);
  //Since I'm to stupid to properly do regex just filter out all do's that have the same index as a don't lol
  const enable: number[] = [...instruction.matchAll(DO_REGEX)].map((r) => r.index ?? -1).filter((e) => disable.some((d) => d !== e));
  if (!disable.includes(0)) {
    enable.push(0);
    enable.sort();
  }
  for (const match of multOperations) {
    const digits = getAllNumbersInString(match[0]);
    if (wasMultOperationEnabledBeforeMultOperation(enable, disable, match)) {
      multResult = multResult + digits[0] * digits[1];
    }
  }

  return multResult;
}
