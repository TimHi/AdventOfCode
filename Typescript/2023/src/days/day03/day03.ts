import * as fs from "fs";

const isSample = false;

interface Point {
  X: number;
  Y: number;
}

const ENGINE_SYMBOLS = ["*", "#", "$", "+", "&", "-", "/", "@", "=", "%"];

const SYMBOL_MAP = new Map<Point, string>();

export function SolvePartOne(): number {
  const fileName = isSample
    ? "/src/days/day03/sample.txt"
    : "/src/days/day03/full.txt";

  const engine = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  return parseField(engine);
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

function parseField(lines: string[]): number {
  let sum = 0;
  const numberRegex = new RegExp("[0-9]+", "g");
  lines.forEach((line, yIndex) => {
    line.split("").forEach((char, xIndex) => {
      if (ENGINE_SYMBOLS.includes(char))
        SYMBOL_MAP.set({ X: xIndex, Y: yIndex }, char);
    });
  });
  lines.forEach((line, yIndex) => {
    const numberMatch = line.match(numberRegex);

    if (numberMatch) {
      const filteredNums = numberMatch.filter(
        (elem, index, self) => index === self.indexOf(elem)
      );

      filteredNums.forEach((foundNumber) => {
        let index = line.indexOf(foundNumber);
        while (index !== -1) {
          const isValid =
            (index === 0 || !/\d/.test(line[index - 1])) &&
            (!/\d/.test(line[index + foundNumber.length]) ||
              index + foundNumber.length === line.length);
          if (isValid) {
            const end = index + foundNumber.length - 1;
            if (checkSymbols(index, end, yIndex)) {
              sum += Number(foundNumber);
            }
          }
          index = line.indexOf(foundNumber, index + 1);
        }
      });
    }
  });
  return sum;
}

function checkSymbols(start: number, end: number, y: number): boolean {
  for (let i = start; i <= end; i++) {
    if (checkMapByProperty({ X: i + 1, Y: y })) {
      return true;
    }
    if (checkMapByProperty({ X: i + 1, Y: y + 1 })) {
      return true;
    }
    if (checkMapByProperty({ X: i + 1, Y: y - 1 })) {
      return true;
    }
    if (checkMapByProperty({ X: i, Y: y - 1 })) {
      return true;
    }
    if (checkMapByProperty({ X: i, Y: y + 1 })) {
      return true;
    }
    if (checkMapByProperty({ X: i - 1, Y: y })) {
      return true;
    }
    if (checkMapByProperty({ X: i - 1, Y: y + 1 })) {
      return true;
    }
    if (checkMapByProperty({ X: i - 1, Y: y - 1 })) {
      return true;
    }
  }

  return false;
}

function checkMapByProperty(targetKey: Point): boolean {
  let hasKey = false;
  SYMBOL_MAP.forEach((v, key) => {
    if (key.X === targetKey.X && key.Y === targetKey.Y) {
      if (ENGINE_SYMBOLS.includes(v)) {
        hasKey = true;
        return;
      }
    }
  });
  return hasKey;
}
