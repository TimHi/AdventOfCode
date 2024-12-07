import * as fs from "fs";

const isSample = true;
interface Equation {
  target: number;
  nums: number[];
  possibilities: number;
}

function permute(ops: string[], size: number): string[][] {
  const results: string[][] = [];

  function backtrack(current: string[]) {
    if (current.length === size) {
      results.push([...current]); // Add a copy of the current combination
      return;
    }

    for (const op of ops) {
      current.push(op); // Add the current operator
      backtrack(current); // Recursively build the next part of the permutation
      current.pop(); // Backtrack to explore other options
    }
  }

  backtrack([]);
  return results;
}

function getPermutations(nums: number[]): string[][] {
  const r: string[][] = [];
  for (let i = 0; i < 1 << (nums.length - 1); i++) {
    const c: string[] = [];
    for (let j = 0; j < nums.length - 1; j++) {
      c.push(i & (1 << j) ? "+" : "*");
    }
    r.push(c);
  }
  return r;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day07/sample.txt" : "/src/days/day07/full.txt";
  const equations = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const split = l.split(": ");
      const num = split[1].split(" ").map((s) => Number(s));
      return { target: Number(split[0]), nums: num, possibilities: 0 };
    });
  let possibleCombinations = 0;
  equations.forEach((eq) => {
    const permutations = getPermutations(eq.nums);

    let isAdded = false;

    permutations.forEach((p) => {
      let calcedNumber = eq.nums[0];

      p.forEach((operation, index) => {
        if (operation === "+") {
          calcedNumber = calcedNumber + eq.nums[index + 1];
        } else {
          calcedNumber = calcedNumber * eq.nums[index + 1];
        }
      });
      if (calcedNumber === eq.target && !isAdded) {
        isAdded = true;
        possibleCombinations += eq.target;
        return;
      }
    });
  });
  return possibleCombinations;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day07/sample.txt" : "/src/days/day07/full.txt";
  const equations = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const split = l.split(": ");
      const num = split[1].split(" ").map((s) => Number(s));
      return { target: Number(split[0]), nums: num, possibilities: 0 };
    });

  let possibleCombinations = 0;
  equations.forEach((eq) => {
    let isAdded = false;
    const permutations: string[][] = permute(["+", "*", "|"], eq.nums.length - 1);
    //const permutations: string[][] = [["*", "|", "*"]];
    permutations.forEach((permutation) => {
      const strappedPermutation = permutation.slice();
      const editedNums = eq.nums.slice();

      let calcedNumber = editedNums[0];
      strappedPermutation.forEach((operation, index) => {
        if (operation === "+") {
          calcedNumber = calcedNumber + editedNums[index + 1];
        } else if (operation === "|") {
          calcedNumber = Number(String(calcedNumber) + String(editedNums[index + 1]));
          editedNums.splice(index + 1, 1, calcedNumber);
        } else {
          calcedNumber = calcedNumber * editedNums[index + 1];
        }
      });
      //Tested all operations, only add if not present
      if (calcedNumber === eq.target && !isAdded) {
        isAdded = true;
        possibleCombinations += eq.target;
        return;
      }
    });
  });
  return possibleCombinations;
}
