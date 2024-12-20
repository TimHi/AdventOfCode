import { getAllNumbersInString, Point } from "aoc-util";
import * as fs from "fs";
const isSample = true;

class Node {
  CHAR_SIZE: number = 26; // Supports lowercase English characters 'a' to 'z'
  exist: boolean; // Indicates if the node is a leaf
  next: (Node | null)[];

  constructor() {
    this.exist = false;
    this.next = Array(this.CHAR_SIZE).fill(null); // Initialize child nodes as null
  }
}

//https://www.techiedelight.com/word-break-problem-using-trie/
function insertTrie(head: Node, s: string): void {
  let node = head;

  // Iterate over each character in the string
  for (const char of s) {
    const index = char.charCodeAt(0) - "a".charCodeAt(0);

    // Create a new node if the path doesn't exist
    if (node.next[index] === null) {
      node.next[index] = new Node();
    }

    // Move to the next node
    node = node.next[index]!;
  }

  // Mark the last node as a leaf
  node.exist = true;
}

// Function to determine if a string can be segmented into space-separated
// sequence of one or more dictionary words
function wordBreak(head: Node, s: string): boolean {
  const good: boolean[] = Array(s.length + 1).fill(false);
  good[0] = true; // Base case

  for (let i = 0; i < s.length; i++) {
    if (good[i]) {
      let node = head;

      for (let j = i; j < s.length; j++) {
        const index = s.charCodeAt(j) - "a".charCodeAt(0);

        if (!node.next[index]) {
          break;
        }

        node = node.next[index]!;

        // If a valid word ends here, mark `good[j + 1]` as true
        if (node.exist) {
          good[j + 1] = true;
        }
      }
    }
  }

  // Return true if all characters of `s` can be segmented
  return good[s.length];
}

function checkCombination(combination: string, towels: string[], primeMap: Map<string, number>): boolean {
  const t = new Node();
  for (const word of towels) {
    insertTrie(t, word);
  }
  const result = wordBreak(t, combination);
  return result;
}

function isPrime(num: number): boolean {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

function buildPrimeMap(towels: string[]): Map<string, number> {
  const primeMap = new Map<string, number>();
  let lastUsedPrime = 0;

  for (const towel of towels) {
    const splits = towel.split("");
    for (const s of splits) {
      if (!primeMap.has(s)) {
        let newPrime = lastUsedPrime + 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (isPrime(newPrime)) {
            primeMap.set(s, newPrime);
            lastUsedPrime = newPrime;
            break;
          } else {
            newPrime++;
          }
        }
      }
    }
  }
  return primeMap;
}

function checkTowels(availableTowels: string[], combinations: string[]): number {
  let possibleTowels = 0;

  const primeMap = buildPrimeMap(availableTowels);

  combinations.forEach((combination) => {
    if (!checkCombination(combination, availableTowels, primeMap)) {
      return;
    }
    possibleTowels++;
  });
  return possibleTowels;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day19/sample.txt" : "/src/days/day19/full.txt";
  const combinations: string[] = [];
  const availableTowels: string[] = [];
  let isCombinations = false;
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .forEach((line) => {
      if (line === "" || line === "\r") {
        isCombinations = true;
      } else if (isCombinations) {
        combinations.push(line);
      } else {
        const towels = line.split(", ");
        availableTowels.push(...towels);
      }
    });

  const possibleCombinations = checkTowels(availableTowels, combinations);
  return possibleCombinations;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day18/sample.txt" : "/src/days/day18/full.txt";
  const points: Point[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      return { X: nums[0], Y: nums[1] };
    });
  return 0;
}
