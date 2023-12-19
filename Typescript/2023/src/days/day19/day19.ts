import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";
import { Queue } from "data-structure-typed";
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

interface WorkflowEdge {
  variable: string;
  condition: string;
  destination: string;
}

interface WorkflowNode {
  id: string;
  edges: Map<string, WorkflowEdge[]>;
  ranges: number[][];
}

export function SolvePartTwo(): number {
  const [, workflowMap] = parseInput();
  const graph = new Map<string, WorkflowNode>();
  //Manually add Accept and Reject later used for stopping so no real values needed
  workflowMap.set("A", { conditions: [], id: "A", passedResult: "A" });
  workflowMap.set("R", { conditions: [], id: "R", passedResult: "R" });
  workflowMap.forEach((v, k) => {
    // Build endnotes
    const edges = new Map<string, WorkflowEdge[]>();
    v.conditions.forEach((c) => {
      if (edges.has(v.passedResult)) {
        const edgesList = edges.get(v.passedResult)!;
        edgesList.push({ variable: c.condition[0], condition: "IGNORE", destination: v.passedResult });
        edges.set(v.passedResult, edgesList);
      } else {
        edges.set(v.passedResult, [{ variable: c.condition[0], condition: "IGNORE", destination: v.passedResult }]);
      }
      if (edges.has(c.stepIfTrue)) {
        const edgesList = edges.get(c.stepIfTrue)!;
        edgesList.push({ variable: c.condition[0], condition: c.condition, destination: c.stepIfTrue });
        edges.set(c.stepIfTrue, edgesList);
      } else {
        edges.set(c.stepIfTrue, [{ variable: c.condition[0], condition: c.condition, destination: c.stepIfTrue }]);
      }
    });

    const node: WorkflowNode = {
      id: k,
      edges: edges,
      ranges: [
        [1, 4000],
        [1, 4000],
        [1, 4000],
        [1, 4000]
      ]
    };
    graph.set(k, node);
  });
  const ranges = getValidRanges(graph);
  return ranges;
}

function getValidRanges(graph: Map<string, WorkflowNode>) {
  //X-M-A-S nicht verhunzeln
  const ranges = [
    [1, 4000], //0-X
    [1, 4000], //1-M
    [1, 4000], //2-A
    [1, 4000] //3-S
  ];
  const sums: number[] = [];
  const Q = new Queue<[string, number[][]]>();
  Q.enqueue(["in", ranges]);
  while (Q.size > 0) {
    const state = Q.dequeue()!;
    const currentNode = state[0];
    const currentRanges = state[1];
    if (currentNode === "R") {
      continue;
    }
    if (currentNode === "A") {
      sums.push(currentRanges.reduce((a, c) => a * (c[1] - c[0] + 1), 1));
      //console.log(xPerm * mPerm * aPerm * sPerm);
      console.log(currentRanges.reduce((a, c) => a * (c[1] - c[0] + 1), 1));
      continue;
    }

    const children = getChildren(graph.get(currentNode)!, graph, cloneDeep(currentRanges));
    children.forEach((n) => {
      Q.enqueue([n.id, n.ranges]);
    });
  }

  return sums.reduce((prev, current) => (current = prev + current));
}

function getChildren(node: WorkflowNode, graph: Map<string, WorkflowNode>, currentRanges: number[][]): WorkflowNode[] {
  const children: WorkflowNode[] = [];
  node.edges.forEach((edge) => {
    edge.forEach((e) => {
      const child = graph.get(e.destination)!;
      const newRanges = calculateRanges(e, cloneDeep(currentRanges));
      if (newRanges !== undefined) {
        child.ranges = newRanges;
        children.push(child);
      } else {
        console.log("State not possible");
      }
    });
  });
  return children;
}

function calculateRanges(edge: WorkflowEdge, ranges: number[][]): number[][] | undefined {
  const newRanges = ranges;
  if (edge.condition === "IGNORE") return ranges;
  const cost = getAllNumbersInString(edge.condition)[0];
  //xmas SMALLER than
  if (edge.condition.includes("<")) {
    if (edge.variable === "x") {
      newRanges[0][1] = cost - 1;
      return newRanges;
    }
    if (edge.variable === "m") {
      newRanges[1][1] = cost - 1;
      return newRanges;
    }
    if (edge.variable === "a") {
      newRanges[2][1] = cost - 1;
      return newRanges;
    }
    if (edge.variable === "s") {
      newRanges[3][1] = cost - 1;
      return newRanges;
    }
  }
  //xmas BIGGER than
  if (edge.condition.includes(">")) {
    if (edge.variable === "x") {
      newRanges[0][0] = cost + 1;
      return newRanges;
    }
    if (edge.variable === "m") {
      newRanges[1][0] = cost + 1;
      return newRanges;
    }
    if (edge.variable === "a") {
      newRanges[2][0] = cost + 1;
      return newRanges;
    }
    if (edge.variable === "s") {
      newRanges[3][0] = cost + 1;
      return newRanges;
    }
  }
  throw new Error("Should not be reached");
}
