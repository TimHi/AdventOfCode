import * as fs from "fs";

const isSample = true;

function getSets(lines: string[][]) {
  const cons = new Map<string, string[]>();
  const tMap = new Map<string, string[]>();
  for (const line of lines) {
    if (cons.has(line[0])) {
      const old = cons.get(line[0]);
      old!.push(line[1]);
      cons.set(line[0], old!);
    } else {
      cons.set(line[0], [line[1]]);
    }

    if (line[0].startsWith("t")) {
      if (tMap.has(line[0])) {
        const old = tMap.get(line[0])!;
        old.push(line[1]);
        tMap.set(line[0], old!);
      } else {
        tMap.set(line[0], [line[1]]);
      }
    }
    if (line[1].startsWith("t")) {
      if (tMap.has(line[1])) {
        const old = tMap.get(line[1])!;
        old.push(line[0]);
        tMap.set(line[1], old!);
      } else {
        tMap.set(line[1], [line[0]]);
      }
    }
  }
  return [cons, tMap];
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day23/sample.txt" : "/src/days/day23/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => line.split("-"));
  const maps = getSets(secrets);
  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day23/sample.txt" : "/src/days/day23/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));
  return 0;
}
