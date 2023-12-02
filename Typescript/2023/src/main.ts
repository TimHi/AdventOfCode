import { SolvePartOne, SolvePartTwo } from "./days/day01/day01";
import {
  SolvePartOne as SolvePartOneD2,
  SolvePartTwo as SolvePartTwoD2
} from "./days/day02/day02";

const day: number = 2;

if (day === 1) {
  console.log("Day 01 Part 01: " + SolvePartOne());
  console.log("Day 01 Part 02: " + SolvePartTwo());
} else if (day === 2) {
  console.log("Day 02 Part 01: " + SolvePartOneD2());
  console.log("Day 02 Part 02: " + SolvePartTwoD2());
}
