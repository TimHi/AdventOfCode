import * as fs from "fs";

const isSample = true;

export interface Lens {
  label: string;
  operation: Operation;
  focalLength: number;
  box: number;
}

export enum Operation {
  REMOVE = "-",
  SET = "="
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day15/sample.txt" : "/src/days/day15/full.txt";
  const hashSum = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(",")
    .map((block) => HASH(block))
    .reduce((prev, current) => (prev += current));

  return hashSum;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day15/sample.txt" : "/src/days/day15/full.txt";
  //Key is index 0....256
  const boxes = new Map<number, Lens[]>();
  const lenses: Lens[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split(",")
    .map((block) => ParseLens(block));
  lenses.forEach((l) => {
    processLens(l, boxes);
  });
  const result = VerifyLenses(boxes);
  return result;
}

function HASH(input: string): number {
  let currentValue = 0;
  input.split("").forEach((c) => {
    const ASCII = c.charCodeAt(0);
    currentValue += ASCII;
    currentValue *= 17;
    currentValue = currentValue % 256;
  });
  return currentValue;
}

export function VerifyLenses(boxMap: Map<number, Lens[]>) {
  let focusingPower = 0;
  boxMap.forEach((boxes, boxIndex) => {
    boxes.forEach((lens, lensIndex) => {
      const result = (boxIndex + 1) * (lensIndex + 1) * lens.focalLength;
      focusingPower = focusingPower + result;
    });
  });
  return focusingPower;
}

//The result of running the HASH algorithm on the label indicates the correct box for that step.
export function ParseLens(input: string): Lens {
  const operation = input.indexOf("-") !== -1 ? Operation.REMOVE : Operation.SET;
  const split = input.split(operation);
  return { label: split[0], operation: operation, focalLength: Number(split[1]), box: HASH(split[0]) };
}

function processLens(lens: Lens, boxMap: Map<number, Lens[]>) {
  if (lens.operation === Operation.REMOVE) {
    const box = boxMap.get(lens.box);
    if (box !== undefined) {
      const lensIndex = box.findIndex((v) => v.label === lens.label);
      if (lensIndex !== -1) {
        box.splice(lensIndex, 1);
        boxMap.set(lens.box, box);
      }
    }
  } else if (lens.operation === Operation.SET) {
    const box = boxMap.get(lens.box);
    if (box !== undefined) {
      const lensIndex = box.findIndex((v) => v.label === lens.label);
      //Update existing or remove
      if (lensIndex !== -1) {
        box.splice(lensIndex, 1);
        box.splice(lensIndex, 0, lens);
      } else {
        box.push(lens);
      }
      boxMap.set(lens.box, box);
    } else {
      boxMap.set(lens.box, [lens]);
    }
  } else {
    throw new Error("Unsupported Operation");
  }
}
