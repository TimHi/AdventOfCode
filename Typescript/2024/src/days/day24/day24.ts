import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day24/sample.txt" : "/src/days/day24/full.txt";
  const keys: string[][] = [];
  const locks: string[][] = [];

  const rawChunks: string[][] = [];
  const chunk: string[] = [];
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      if (line === "") {
        rawChunks.push(chunk);
      }
      rawChunks.push(line.split(""));
    });

  return 0;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day24/sample.txt" : "/src/days/day24/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));
  return 0;
}
