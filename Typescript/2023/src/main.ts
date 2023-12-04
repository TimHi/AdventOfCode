import { SolvePartOne, SolvePartTwo } from "./days/day01/day01";
import { SolvePartOne as SolvePartOneD2, SolvePartTwo as SolvePartTwoD2 } from "./days/day02/day02";
import { SolvePartOne as SolvePartOneD3, SolvePartTwo as SolvePartTwoD3 } from "./days/day03/day03";
import { SolvePartOne as SolvePartOneD4, SolvePartTwo as SolvePartTwoD4 } from "./days/day04/day04";

const day: number = 4;

if (day === 1) {
  console.log("Day 01 Part 01: " + SolvePartOne());
  console.log("Day 01 Part 02: " + SolvePartTwo());
} else if (day === 2) {
  console.log("Day 02 Part 01: " + SolvePartOneD2());
  console.log("Day 02 Part 02: " + SolvePartTwoD2());
} else if (day === 3) {
  console.log("Day 03 Part 01: " + SolvePartOneD3());
  console.log("Day 03 Part 02: " + SolvePartTwoD3());
} else if (day === 4) {
  console.log("Day 04 Part 01: " + SolvePartOneD4());
  console.log("Day 04 Part 02: " + SolvePartTwoD4());
}
