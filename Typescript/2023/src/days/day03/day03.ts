import * as fs from "fs";

const isSample = true;

interface Point {
  X: number;
  Y: number;
}

interface EngineNumber {
  StartPos: Point;
  Value: number;
}

const ENGINE_SYMBOLS = ["*", "#", "$", "+", "&", "-", "/", "@", "=", "%"];

const SYMBOL_MAP = new Map<Point, string>();
const GEAR_MAP = new Map<Point, EngineNumber[]>();

const numberRegex = new RegExp("[0-9]+", "g");

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day03/sample.txt" : "/src/days/day03/full.txt";

  const engine = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  return parseField(engine);
}

export function SolvePartTwo(): number {
  if (SYMBOL_MAP.size === 0) throw new Error("Part One needed to be run before");
  return calculateGears();
}

function parseField(lines: string[]): number {
  let sum = 0;

  lines.forEach((line, yIndex) => {
    line.split("").forEach((char, xIndex) => {
      if (ENGINE_SYMBOLS.includes(char)) {
        SYMBOL_MAP.set({ X: xIndex, Y: yIndex }, char);
        if (char === "*") {
          GEAR_MAP.set({ X: xIndex, Y: yIndex }, []);
        }
      }
    });
  });
  lines.forEach((line, yIndex) => {
    const numberMatch = line.match(numberRegex);
    if (numberMatch) {
      const filteredNums = numberMatch.filter((elem, index, self) => index === self.indexOf(elem));
      filteredNums.forEach((foundNumber) => {
        let index = line.indexOf(foundNumber);
        while (index !== -1) {
          const isValid =
            (index === 0 || !/\d/.test(line[index - 1])) &&
            (!/\d/.test(line[index + foundNumber.length]) || index + foundNumber.length === line.length);
          if (isValid) {
            const end = index + foundNumber.length - 1;
            if (checkSymbols(index, end, yIndex, Number(foundNumber))) {
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

function checkSymbols(start: number, end: number, y: number, currentNumber: number): boolean {
  const engineNumber: EngineNumber = { StartPos: { X: start, Y: y }, Value: currentNumber };
  let hasValidNeighbour = false;
  for (let i = start; i <= end; i++) {
    const right = checkMapByProperty({ X: i + 1, Y: y });
    if (ENGINE_SYMBOLS.includes(right)) {
      hasValidNeighbour = true;
      if (right === "*") {
        addGearValueIfMissing(engineNumber, { X: i + 1, Y: y });
      }
    }
    const topRight = checkMapByProperty({ X: i + 1, Y: y + 1 });
    if (ENGINE_SYMBOLS.includes(topRight)) {
      hasValidNeighbour = true;
      if (topRight === "*") {
        addGearValueIfMissing(engineNumber, { X: i + 1, Y: y + 1 });
      }
    }
    const bottomRight = checkMapByProperty({ X: i + 1, Y: y - 1 });
    if (ENGINE_SYMBOLS.includes(bottomRight)) {
      hasValidNeighbour = true;
      if (bottomRight === "*") {
        addGearValueIfMissing(engineNumber, { X: i + 1, Y: y - 1 });
      }
    }
    const bottom = checkMapByProperty({ X: i, Y: y - 1 });
    if (ENGINE_SYMBOLS.includes(bottom)) {
      hasValidNeighbour = true;
      if (bottom === "*") {
        addGearValueIfMissing(engineNumber, { X: i, Y: y - 1 });
      }
    }
    const top = checkMapByProperty({ X: i, Y: y + 1 });
    if (ENGINE_SYMBOLS.includes(top)) {
      hasValidNeighbour = true;
      if (top === "*") {
        addGearValueIfMissing(engineNumber, { X: i, Y: y + 1 });
      }
    }
    const left = checkMapByProperty({ X: i - 1, Y: y });
    if (ENGINE_SYMBOLS.includes(left)) {
      hasValidNeighbour = true;
      if (left === "*") {
        addGearValueIfMissing(engineNumber, { X: i - 1, Y: y });
      }
    }
    const topLeft = checkMapByProperty({ X: i - 1, Y: y + 1 });
    if (ENGINE_SYMBOLS.includes(topLeft)) {
      hasValidNeighbour = true;
      if (topLeft === "*") {
        addGearValueIfMissing(engineNumber, { X: i - 1, Y: y + 1 });
      }
    }
    const bottomLeft = checkMapByProperty({ X: i - 1, Y: y - 1 });
    if (ENGINE_SYMBOLS.includes(bottomLeft)) {
      hasValidNeighbour = true;
      if (bottomLeft === "*") {
        addGearValueIfMissing(engineNumber, { X: i - 1, Y: y - 1 });
      }
    }
  }

  return hasValidNeighbour;
}

function checkMapByProperty(targetKey: Point): string {
  let value = ".";
  SYMBOL_MAP.forEach((v, key) => {
    if (key.X === targetKey.X && key.Y === targetKey.Y) {
      value = v;
    }
  });
  return value;
}

function calculateGears(): number {
  let gearSum = 0;
  GEAR_MAP.forEach((v) => {
    if (v.length === 2) {
      gearSum = gearSum + v[0].Value * v[1].Value;
    }
  });
  return gearSum;
}

function addGearValueIfMissing(num: EngineNumber, gearSymbol: Point) {
  let isAdded = false;
  GEAR_MAP.forEach((v, k) => {
    if (k.X === gearSymbol.X && k.Y === gearSymbol.Y) {
      v.forEach((e) => {
        if (e.StartPos.X === num.StartPos.X && e.StartPos.Y === num.StartPos.Y && num.Value === e.Value) {
          isAdded = true;
          return;
        }
      });
      if (!isAdded) {
        v.push(num);
      }
    }
  });
}
