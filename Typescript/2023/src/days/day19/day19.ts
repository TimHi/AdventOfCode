import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";

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

export function SolvePartOne(): number {
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
  console.log("TBD");
  return 0;
}
