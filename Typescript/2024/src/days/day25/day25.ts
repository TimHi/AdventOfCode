import * as fs from "fs";

const isSample = false;

function checkKey(key: number[], locks: number[][]): number {
  let validKey = 0;
  locks.forEach((lock) => {
    let tV = true;
    if (lock.length !== key.length) throw new Error("Invalid lock key");
    for (let i = 0; i < lock.length; i++) {
      const lV = lock[i];
      const kV = key[i];
      //check if overlap, revert how key is counted?
      if (lock.length - kV < lV) {
        tV = false;
      }
    }
    if (tV) {
      validKey++;
    }
  });
  return validKey;
}

function convertKey(key: string[][]) {
  const cKey: number[] = [];
  for (let x = 0; x < key[0].length; x++) {
    let rowCount = 0;
    for (let y = 0; y < key.length - 1; y++) {
      if (key[y][x] === "#") {
        rowCount++;
      }
    }
    cKey.push(rowCount);
  }
  return cKey;
}

function convertLock(lock: string[][]) {
  const cLock: number[] = [];
  for (let x = 0; x < lock[0].length; x++) {
    let rowCount = 0;
    for (let y = lock.length - 1; y > 0; y--) {
      if (lock[y][x] === "#") {
        rowCount++;
      }
    }
    cLock.push(rowCount);
  }
  return cLock;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day25/sample.txt" : "/src/days/day25/full.txt";
  const keys: string[][][] = [];
  const locks: string[][][] = [];

  const rawChunks: string[][][] = [];
  let chunk: string[][] = [];
  const lines = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line: string) => line.trim());

  lines.forEach((line) => {
    if (line === "") {
      rawChunks.push(chunk);
      chunk = [];
    } else {
      chunk.push(line.split(""));
    }
  });

  rawChunks.forEach((chunk) => {
    if (chunk[0][0] !== ".") {
      locks.push(chunk);
    } else {
      keys.push(chunk);
    }
  });

  const cKey = keys.map((key) => convertKey(key));
  const cLock: number[][] = locks.map((lock) => convertLock(lock));
  let foundKeys = 0;
  cKey.forEach((key) => {
    foundKeys += checkKey(key, cLock);
  });
  return foundKeys;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day25/sample.txt" : "/src/days/day25/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));
  return 0;
}
