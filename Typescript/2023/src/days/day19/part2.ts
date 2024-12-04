import { getAllNumbersInString } from "aoc-util";
import * as fs from "fs";
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

type ConditionP2 = {
  type: "x" | "m" | "a" | "s";
  operator: string;
  value: number;
  isDefault: boolean;
  destination: string;
};
interface WorkflowP2 {
  node: string;
  conditions: ConditionP2[];
}

export function GetPossibleCombinations(): number {
  const workflowMap = parseP2Input();
  const result = getCount("in", workflowMap, { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] });
  return result;
}

function rangeSize(r: Range) {
  return r[1] - r[0];
}
function calculateCombinations(batch: XMASRanges) {
  return rangeSize(batch.x) * rangeSize(batch.m) * rangeSize(batch.a) * rangeSize(batch.s);
}

const foundRanges: XMASRanges[] = [];

type Range = [number, number];
type XMASRanges = {
  x: Range;
  m: Range;
  a: Range;
  s: Range;
};
function getCount(currentID: string, map: Map<string, WorkflowP2>, ranges: XMASRanges): number {
  if (currentID === "A") {
    foundRanges.push(ranges);
    return calculateCombinations(ranges);
  }
  if (currentID === "R") {
    return 0;
  }

  let result = 0;
  const currentNode = map.get(currentID)!;
  for (const rule of currentNode.conditions) {
    const range = ranges[rule.type];
    switch (rule.operator) {
      case "<":
        if (range[1] <= rule.value) {
          result += getCount(rule.destination, map, ranges);
          return result;
        } else if (range[0] < rule.value) {
          const matchedPart: XMASRanges = { ...ranges, [rule.type]: [range[0], rule.value] };
          result += getCount(rule.destination, map, matchedPart);
          ranges = { ...ranges, [rule.type]: [rule.value, range[1]] };
          continue;
        }
        break;

      case ">":
        //Fullfilled, go further without adjusting ranges
        if (range[0] > rule.value) {
          result += getCount(rule.destination, map, ranges);
          return result;
        } else if (range[1] > rule.value + 1) {
          //Split ranges
          const matchedPart: XMASRanges = { ...ranges, [rule.type]: [rule.value + 1, range[1]] };
          result += getCount(rule.destination, map, matchedPart);
          ranges = { ...ranges, [rule.type]: [range[0], rule.value + 1] };
          continue;
        }
        break;
      default:
        //Passthrough
        result += getCount(rule.destination, map, ranges);
        break;
    }
  }

  return result;
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
            const operator = rawCondition.includes(">") ? ">" : "<";
            const destination = rawCondition.split(":")[1];
            const variable = rawCondition[0];
            conditions.push({
              type: variable as "x" | "m" | "a" | "s",
              operator: operator,
              value: cost,
              isDefault: false,
              destination: destination
            });
          } else {
            conditions.push({
              type: "x" as "x" | "m" | "a" | "s",
              operator: "",
              value: 0,
              isDefault: true,
              destination: rawCondition
            });
          }
        });
        const workflow: WorkflowP2 = { node: workFlowId, conditions: conditions };
        map.set(workFlowId, workflow);
      }
    });
  return map;
}
