import * as fs from "fs";

const isSample = false;

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
function insertTrie(head: Node, word: string): void {
  let node = head;

  // Iterate over each character in the string
  for (const char of word) {
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

function findAllCombinations(head: Node, wordToFind: string): string[][] {
  const wordLength = wordToFind.length;
  const dp: string[][][] = Array(wordLength + 1)
    .fill(null)
    .map(() => []);

  dp[0].push([]); // Base case: empty list for the starting point

  for (let i = 0; i < wordLength; i++) {
    if (dp[i].length > 0) {
      let node = head;
      for (let j = i; j < wordLength; j++) {
        //The Unicode code point of 'a' is 97. Subtracting this value normalizes the result to start from 0:
        //This gives the index of the character in the range a–z (0 for 'a', 1 for 'b', ..., 25 for 'z').
        //Used to find the child node
        const index = wordToFind.charCodeAt(j) - "a".charCodeAt(0);

        if (!node.next[index]) {
          break;
        }

        node = node.next[index]!;

        if (node.exist) {
          const word = wordToFind.slice(i, j + 1);
          for (const combination of dp[i]) {
            dp[j + 1].push([...combination, word]);
          }
        }
      }
    }
  }

  return dp[wordLength];
}

function checkCombination(combination: string, towels: string[]): boolean {
  const t = new Node();
  for (const word of towels) {
    insertTrie(t, word);
  }
  return wordBreak(t, combination);
}

function checkTowels(availableTowels: string[], combinations: string[]): number {
  let possibleTowels = 0;

  combinations.forEach((combination) => {
    if (!checkCombination(combination, availableTowels)) {
      return;
    }
    possibleTowels++;
  });
  return possibleTowels;
}

function checkAllTowels(availableTowels: string[], combinations: string[]): number {
  let possibleTowels = 0;

  combinations.forEach((combination) => {
    const t = new Node();
    for (const word of availableTowels) {
      insertTrie(t, word);
    }
    possibleTowels += findAllCombinations(t, combination).length;
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

  return checkTowels(availableTowels, combinations);
}

export function SolvePartTwo(): number {
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

  return checkAllTowels(availableTowels, combinations);
}
