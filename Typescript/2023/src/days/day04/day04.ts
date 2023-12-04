import * as fs from "fs";
import _ from "lodash";

const isSample = false;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day04/sample.txt" : "/src/days/day04/full.txt";
  const numReg = new RegExp("[0-9]+", "g");
  let sum = 0;
  const scratchboards = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.substring(line.indexOf(":"), line.length))
    .map((line) => line.split("|"))
    .map((nums) => {
      const winningNumbers = nums[0].match(numReg)?.map((v) => Number(v));
      const matches = nums[1].match(numReg);
      const ownNumbers = matches?.map((v) => Number(v));
      return [winningNumbers, ownNumbers];
    });
  scratchboards.forEach((game) => {
    const intersection = _.intersection(game[0], game[1]);
    let points = 0;
    intersection.forEach((_, index) => {
      if (index === 0) {
        points = 1;
      } else {
        points = points * 2;
      }
    });
    sum += points;
  });

  return sum;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
