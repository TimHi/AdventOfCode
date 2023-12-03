import * as fs from "fs";

const isSample = true;

interface Point {
  X: number;
  Y: number;
}

interface Part {
  Start: Point;
  End: Point;
  Value: string;
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

  return checkSymbols();
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
    let tempLine = line;
    let offSet = 0;
    if (numberMatch) {
      numberMatch.forEach((foundNumber) => {
        const startPoint = tempLine.indexOf(foundNumber);
        if (checkNumberMapByProperty({ X: startPoint + offSet, Y: yIndex }))
          console.error("Duplicate numbers in map, this approach wont work");
        const num: Part = {
          Start: { X: startPoint + offSet, Y: yIndex },
          End: { X: startPoint + foundNumber.length - 1 + offSet, Y: yIndex },
          Value: foundNumber
        };
        NUMBER_MAP.set({ X: startPoint + offSet, Y: yIndex }, num);
        tempLine = tempLine.substring(
          startPoint + foundNumber.length,
          tempLine.length - 1
        );
        offSet += startPoint + foundNumber.length;
      });
    }
  });
}

function checkSymbols(): number {
  let sum = 0;
  NUMBER_MAP.forEach((num) => {
    for (let i = num.Start.X; i <= num.End.X; i++) {
      if (checkMapByProperty({ X: i + 1, Y: num.Start.Y })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i + 1, Y: num.Start.Y + 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i + 1, Y: num.Start.Y - 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i, Y: num.Start.Y - 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i, Y: num.Start.Y + 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i - 1, Y: num.Start.Y })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i - 1, Y: num.Start.Y + 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
      if (checkMapByProperty({ X: i - 1, Y: num.Start.Y - 1 })) {
        console.log("Valid Number: " + num.Value);
        sum += Number(num.Value);
        break;
      }
    }
  });
  return sum;
}

function checkMapByProperty(targetKey: Point): boolean {
  let hasKey = false;
  SYMBOL_MAP.forEach((_, key) => {
    if (key.X === targetKey.X && key.Y === targetKey.Y) {
      hasKey = true;
      return;
    }
  });
  return hasKey;
}

function checkNumberMapByProperty(targetKey: Point): boolean {
  let hasKey = false;
  NUMBER_MAP.forEach((_, key) => {
    if (key.X === targetKey.X && key.Y === targetKey.Y) {
      hasKey = true;
      return;
    }
  });
  return hasKey;
}

//543466 too low
//541173 too low
