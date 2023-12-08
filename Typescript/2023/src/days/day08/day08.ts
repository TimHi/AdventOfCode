import * as fs from "fs";

interface Node {
  start: string;
  leftDest: string;
  rightDest: string;
}

interface DessertMap {
  directions: string[];
  map: Map<string, Node>;
  startPointDurationMap: Map<string, number>;
}
type FinalCondition = (n: string) => boolean;

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day08/sample2.txt" : "/src/days/day08/full.txt";
  const map = parseDessertMap(fileName);
  const finalCondition = (i: string) => i === "ZZZ";
  const steps = getStepCountForStart("AAA", map, finalCondition);
  return steps;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day08/sample_p2.txt" : "/src/days/day08/full.txt";
  const map = parseDessertMap(fileName);
  const finalCondition = (i: string) => i.split("")[2] === "Z";
  map.map.forEach((n) => {
    if (n.start.split("")[2] === "A") {
      const steps = getStepCountForStart(n.start, map, finalCondition);
      map.startPointDurationMap.set(n.start, steps);
    }
  });

  const resultSteps: number[] = [];
  map.startPointDurationMap.forEach((v) => resultSteps.push(v));
  return lcmOfList(resultSteps) ?? 0;
}

function getStepCountForStart(start: string, map: DessertMap, finalCondition: FinalCondition): number {
  let currentPosition = start;
  let found = false;
  let step = 0;
  while (!found) {
    for (let i = 0; i < map.directions.length; i++) {
      step++;
      const direction = map.directions[i];
      const currentNode = map.map.get(currentPosition);
      if (currentNode === undefined) throw new Error("Node " + currentPosition + " does not exist.");
      if (direction === "R") {
        currentPosition = currentNode.rightDest;
      } else {
        currentPosition = currentNode.leftDest;
      }

      if (finalCondition(currentPosition)) {
        found = true;
        break;
      }
    }
  }
  return step;
}

function parseDessertMap(fileName: string): DessertMap {
  const directions: string[] = [];
  const nodeMap = new Map<string, Node>();

  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (i === 0) directions.push(...line.split(""));
      else {
        const regex = /(\w+) = \((\w+), (\w+)\)/;
        const match = line.match(regex);

        if (match && match.length === 4) {
          const node: Node = { start: match[1], leftDest: match[2], rightDest: match[3] };
          nodeMap.set(node.start, node);
        } else {
          console.log("No match in line: " + line);
        }
      }
    });
  return { directions: directions, map: nodeMap, startPointDurationMap: new Map<string, number>() };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function lcmOfList(numbers: number[]): number | null {
  if (numbers.length === 0) {
    return null;
  }

  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }

  return result;
}
