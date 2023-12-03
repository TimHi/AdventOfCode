import * as fs from "fs";
import { isNumber } from "../../util/numbers";

const isSample = true;

interface Point {
  X: number;
  Y: number;
}

interface Part {
  Start: Point;
  End: Point;
  Value: string;
  Used: boolean;
}

const ENGINE_SYMBOLS = ["*", "#", "$", "+", "&", "-", "/", "@", "=", "%"];

const SYMBOL_MAP = new Map<Point, string>();
const NUMBER_MAP = new Map<Point, Part>();

export function SolvePartOne(): number {
  const fileName = isSample
    ? "/src/days/day03/sample.txt"
    : "/src/days/day03/full.txt";

  const engine = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  parseField(engine);
  checkSymbols();
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function parseField(lines: string[]) {
  const numberRegex = new RegExp("[0-9]+", "g");
  lines.forEach((line, yIndex) => {
    line.split("").forEach((char, xIndex) => {
      if (ENGINE_SYMBOLS.includes(char))
        SYMBOL_MAP.set({ X: xIndex, Y: yIndex }, char);
    });

    const numberMatch = line.match(numberRegex);
    if (numberMatch) {
      numberMatch.forEach((foundNumber) => {
        const startPoint = line.indexOf(foundNumber);
        if (NUMBER_MAP.has({ X: startPoint, Y: yIndex }))
          console.error("Duplicate numbers in map, this approach wont work");
        NUMBER_MAP.set(
          { X: startPoint, Y: yIndex },
          {
            Start: { X: startPoint, Y: yIndex },
            End: { X: startPoint + foundNumber.length - 1, Y: yIndex },
            Value: foundNumber,
            Used: false
          }
        );
      });
    }
  });
}

function checkSymbols() {
  NUMBER_MAP.forEach((num, position) => {
    for (let i = num.Start.X; i <= num.End.X; i++) {}
  });
}
