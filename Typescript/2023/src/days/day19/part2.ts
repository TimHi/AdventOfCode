import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";
import { cloneDeep } from "lodash";
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

interface ConditionP2 {
  variable: string;
  variableShouldBeBigger: boolean;
  rangeCount: number;
  isDefault: boolean;
  destination: string;
}
interface WorkflowP2 {
  node: string;
  conditions: ConditionP2[];
}

export function GetPossibleCombinations(): number {
  const workflowMap = parseP2Input();
  const ranges = new Map<string, number[]>();
  ranges.set("x", [1, 4000]);
  ranges.set("m", [1, 4000]);
  ranges.set("a", [1, 4000]);
  ranges.set("s", [1, 4000]);
  const g = getCount("in", workflowMap, ranges);
  const result = sumMaps(g);
  //const result = trimDuplicatesAndCalculateSum(g);
  return result;
}

function getCount(currentID: string, map: Map<string, WorkflowP2>, ranges: Map<string, number[]>): Map<string, number[]>[] {
  const sum: Map<string, number[]>[] = [];

  if (currentID === "A") {
    const rangeList: number[][] = [];
    ranges.forEach((v) => {
      rangeList.push(v);
    });
    const tSum = rangeList.reduce((prev, curr) => prev * (curr[1] - curr[0] + 1), 1);
    console.log(tSum);
    sum.push(ranges);
    return sum;
  }
  if (currentID === "R") {
    return [];
  }

  const currentNode = map.get(currentID)!;
  for (let index = 0; index < currentNode.conditions.length; index++) {
    const child = currentNode.conditions[index];
    const tempRanges = cloneDeep(ranges);
    if (child.isDefault) {
      sum.push(...getCount(child.destination, map, tempRanges));
    } else {
      if (child.variableShouldBeBigger) {
        const oldRange = tempRanges.get(child.variable)!;
        oldRange[0] = child.rangeCount;
        tempRanges.set(child.variable, oldRange);
      } else {
        const oldRange = tempRanges.get(child.variable)!;
        oldRange[1] = child.rangeCount;
        tempRanges.set(child.variable, oldRange);
      }

      sum.push(...getCount(child.destination, map, tempRanges));
    }
  }

  return sum;
}

function parseP2Input() {
  const isSample = true;
  const fileName = isSample ? "/src/days/day19/sample.txt" : "/src/days/day19/full.txt";
  const map = new Map<string, WorkflowP2>();

  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      const conditions: ConditionP2[] = [];
      if (l.includes("{") && l.length > 0 && l !== "") {
        const workFlowId = l.substring(0, l.indexOf("{"));
        const trimmedLine = l.substring(l.indexOf("{") + 1).replace("}", "");
        const splits = trimmedLine.split(",");
        splits.forEach((rawCondition) => {
          if (rawCondition.includes(">") || rawCondition.includes("<")) {
            const cost = getAllNumbersInString(rawCondition)[0];
            const isBigger = rawCondition.includes(">");
            const destination = rawCondition.split(":")[1];
            const variable = rawCondition[0];
            conditions.push({
              variable: variable,
              variableShouldBeBigger: isBigger,
              rangeCount: cost,
              isDefault: false,
              destination: destination
            });
          } else {
            conditions.push({ variable: "", variableShouldBeBigger: false, rangeCount: 0, isDefault: true, destination: rawCondition });
          }
        });
        const workflow: WorkflowP2 = { node: workFlowId, conditions: conditions };
        map.set(workFlowId, workflow);
      }
    });
  return map;
}
function trimDuplicatesAndCalculateSum(abomination: Map<string, number[]>[]): number {
  const xRanges: number[][] = [];
  const mRanges: number[][] = [];
  const aRanges: number[][] = [];
  const sRanges: number[][] = [];
  const xFinal: number[] = [1, 4000];
  const mFinal: number[] = [1, 4000];
  const aFinal: number[] = [1, 4000];
  const sFinal: number[] = [1, 4000];

  abomination.forEach((rangeMap) => {
    const x = rangeMap.get("x")!;
    xRanges.push(x);
    const m = rangeMap.get("m")!;
    mRanges.push(m);
    const a = rangeMap.get("a")!;
    aRanges.push(a);
    const s = rangeMap.get("s")!;
    sRanges.push(s);
  });

  xRanges.forEach((range) => {
    if (range[0] > xFinal[0]) xFinal[0] = range[0];
    if (range[1] < xFinal[1]) xFinal[1] = range[1];
  });
  mRanges.forEach((range) => {
    if (range[0] > mFinal[0]) mFinal[0] = range[0];
    if (range[1] < mFinal[1]) mFinal[1] = range[1];
  });
  aRanges.forEach((range) => {
    if (range[0] > aFinal[0]) aFinal[0] = range[0];
    if (range[1] < aFinal[1]) aFinal[1] = range[1];
  });
  sRanges.forEach((range) => {
    if (range[0] > sFinal[0]) sFinal[0] = range[0];
    if (range[1] < sFinal[1]) sFinal[1] = range[1];
  });
  console.log("Aal");
  return (xFinal[1] - xFinal[0]) * (mFinal[1] - mFinal[0]) * (aFinal[1] - aFinal[0]) * (sFinal[1] - sFinal[0]);
}

function sumMaps(g: Map<string, number[]>[]) {
  let sum = 0;
  g.forEach((v) => {
    const rangeList: number[][] = [];
    v.forEach((v2) => {
      rangeList.push(v2);
    });
    console.log(sum);
    sum += rangeList.reduce((prev, curr) => prev * (curr[1] - curr[0] + 1), 1);
  });
  return sum;
}
//167409079868000
//497087832120000
//15350040384000
