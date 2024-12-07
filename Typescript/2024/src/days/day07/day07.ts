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
    const permutations = permute(["+", "*", "|"], eq.nums.length - 1);

    let isAdded = false;
    for (let i = 0; i < permutations.length; i++) {
      const preppedNums = [...eq.nums];
      const preppedOps = [...permutations[i]];
      for (let o = 0; o < permutations[i].length; o++) {
        const operation = permutations[i][o];
        if (operation === "|") {
          //Hier verkackt das sample 7290: 6 8 6 15, schlaueren weg finden
          const newNum = Number(String(preppedNums[o]) + String(preppedNums[o + 1]));
          const firstOp = preppedOps.findIndex((o) => "|");

          preppedNums.splice(o, 2, newNum);
          preppedOps.splice(firstOp, 1);
        }
      }

      let calcedNumber = preppedNums[0];
      preppedOps.forEach((operation, index) => {
        if (operation === "+") {
          calcedNumber = calcedNumber + preppedNums[index + 1];
        } else if (operation === "*") {
          calcedNumber = calcedNumber * preppedNums[index + 1];
        } else {
          throw new Error("Fuck");
        }
      });

      if (calcedNumber === eq.target && !isAdded) {
        console.log("ADDING: " + eq.target);
        isAdded = true;
        possibleCombinations += eq.target;
        return;
      }
    }
  });
  return possibleCombinations;
}
