import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";
import { cloneDeep } from "lodash";
const isSample = true;

interface Workflow {
  id: string;
  conditions: Condition[];
  passedResult: string;
}

interface Condition {
  condition: string;
  stepIfTrue: string;
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

function parseInput(): [Part[], Map<string, Workflow>] {
  const fileName = isSample ? "/src/days/day19/sample.txt" : "/src/days/day19/full.txt";
  const parts: Part[] = [];
  const workflowMap = new Map<string, Workflow>();

  //Parse input
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l[0] !== "{" && l !== "") {
        const conditions: Condition[] = [];
        const workFlowId = l.substring(0, l.indexOf("{"));
        const lineWithoutWorkflowId = l.substring(l.indexOf("{") + 1, l.length - 1);
        const unparsedConditions = lineWithoutWorkflowId.split(",");
        for (let i = 0; i < unparsedConditions.length - 1; i++) {
          const upC = unparsedConditions[i];
          if (upC.includes(">") || upC.includes("<")) {
            const splits = upC.split(":");
            conditions.push({ condition: splits[0], stepIfTrue: splits[1] });
          } else {
            throw new Error("Invalid unparsed condition: " + upC);
          }
        }
        const workflow: Workflow = {
          id: workFlowId,
          conditions: conditions,
          passedResult: unparsedConditions[unparsedConditions.length - 1]
        };
        workflowMap.set(workflow.id, workflow);
      } else if (l !== "") {
        const xmasValues = getAllNumbersInString(l);
        parts.push({ x: xmasValues[0], m: xmasValues[1], a: xmasValues[2], s: xmasValues[3] });
      } else if (l === "") {
        //Skip
      } else throw new Error("Invalid line in input");
    });

  return [parts, workflowMap];
}

export function SolvePartOne(): number {
  const [parts, workflowMap] = parseInput();
  return parts
    .map((p) => {
      if (isPartAccepted(p, workflowMap)) {
        return p.x + p.m + p.a + p.s;
      } else return 0;
    })
    .reduce((prev, current) => (current = prev + current));
}

function isPartAccepted(part: Part, workflowMap: Map<string, Workflow>): boolean {
  let currentWorkflow = workflowMap.get("in");
  if (currentWorkflow === undefined) throw new Error("Workflow not found");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let index = 0; index < currentWorkflow!.conditions.length; index++) {
      const c = currentWorkflow!.conditions[index];
      if (c.condition[0] === "x" && eval(part.x + c.condition.substring(1))) {
        if (c.stepIfTrue === "A") return true;
        if (c.stepIfTrue === "R") return false;
        currentWorkflow = workflowMap.get(c.stepIfTrue);
        break;
      } else if (c.condition[0] === "m" && eval(part.m + c.condition.substring(1))) {
        if (c.stepIfTrue === "A") return true;
        if (c.stepIfTrue === "R") return false;
        currentWorkflow = workflowMap.get(c.stepIfTrue);
        break;
      } else if (c.condition[0] === "a" && eval(part.a + c.condition.substring(1))) {
        if (c.stepIfTrue === "A") return true;
        if (c.stepIfTrue === "R") return false;
        currentWorkflow = workflowMap.get(c.stepIfTrue);
        break;
      } else if (c.condition[0] === "s" && eval(part.s + c.condition.substring(1))) {
        if (c.stepIfTrue === "A") return true;
        if (c.stepIfTrue === "R") return false;
        currentWorkflow = workflowMap.get(c.stepIfTrue);
        break;
      } else {
        //Final Check only if all conditions have been evaluated
        if (index === currentWorkflow!.conditions.length - 1) {
          if (currentWorkflow!.passedResult === "A") {
            return true;
          } else if (currentWorkflow!.passedResult === "R") {
            return false;
          } else {
            currentWorkflow = workflowMap.get(currentWorkflow!.passedResult);
            break;
          }
        }
      }
    }
  }
}

export function SolvePartTwo(): number {
  const [, workflowMap] = parseInput();
  parseRanges(workflowMap);

  return 0;
}

function parseRanges(workflowMap: Map<string, Workflow>) {
  const ranges = new Map<string, number[]>([
    ["x", [1, 4000]],
    ["m", [1, 4000]],
    ["a", [1, 4000]],
    ["s", [1, 4000]]
  ]);

  return getPossibleCombinations("in", workflowMap, cloneDeep(ranges));
}

function getPossibleCombinations(node: string, workflowMap: Map<string, Workflow>, ranges: Map<string, number[]>): number {
  console.log("At node: " + node);
  let combinationsCount: number = 0;
  const tRanges = cloneDeep(ranges);

  //End reached, get sum, should be reached 7 times (?)
  if (node === "A") {
    const rangesList: number[][] = [];
    tRanges.forEach((v) => rangesList.push(v));
    const sum = rangesList.reduce((prev, cur) => {
      return prev * (cur[1] - cur[0] + 1);
    }, 1);
    console.log(sum);
    return sum;
  }

  //No result, no combinations
  if (node === "R") {
    return 0;
  }

  const workflow = workflowMap.get(node)!;
  for (let i = 0; i < workflow.conditions.length; i++) {
    const conditionEdge = workflow.conditions[i];
    const oldRanges = tRanges.get(conditionEdge.condition[0])!;
    if (
      conditionEdge.condition[0] === "x" ||
      conditionEdge.condition[0] === "m" ||
      conditionEdge.condition[0] === "a" ||
      conditionEdge.condition[0] === "s"
    ) {
      //Check for condition and set it if its a new boundary
      const cost = getAllNumbersInString(conditionEdge.condition);
      if (conditionEdge.condition.includes(">") && cost[0] < oldRanges[1]) {
        if (cost[0] > oldRanges[0]) oldRanges[0] = cost[0];
      }
      if (conditionEdge.condition.includes("<") && cost[0] > oldRanges[0]) {
        if (cost[0] < oldRanges[1]) oldRanges[1] = cost[0];
      }
    }
    tRanges.set(conditionEdge.condition[0], oldRanges);
    //Go to the neighbour which range we just got
    combinationsCount += getPossibleCombinations(conditionEdge.stepIfTrue, workflowMap, cloneDeep(tRanges));
  }
  //No ranges modified, just move to the node
  combinationsCount += getPossibleCombinations(workflow.passedResult, workflowMap, cloneDeep(tRanges));
  return combinationsCount;
}
