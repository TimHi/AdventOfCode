// Import all solver functions dynamically
const solvers = [];
for (let i = 1; i <= 1; i++) {
  solvers[i] = require(`./days/day${i.toString().padStart(2, "0")}/day${i.toString().padStart(2, "0")}`);
}

const day: number = 1;

if (day >= 1 && day <= 25) {
  const solvePartOne = solvers[day].SolvePartOne;
  const solvePartTwo = solvers[day].SolvePartTwo;

  console.log(`Day ${day} Part 01: ${solvePartOne()}`);
  console.log(`Day ${day} Part 02: ${solvePartTwo()}`);
} else {
  console.log("Invalid day input");
}
