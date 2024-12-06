type Solver = {
  SolvePartOne: () => void;
  SolvePartTwo: () => void;
};

const solvers: Solver[] = [];
const day: number = 6;

async function loadSolvers() {
  for (let i = 1; i <= day; i++) {
    const module = await import(`./days/day${i.toString().padStart(2, "0")}/day${i.toString().padStart(2, "0")}.js`);
    solvers[i] = module.default || module;
  }
}

loadSolvers()
  .then(() => {
    if (day >= 1 && day <= 25) {
      const solvePartOne = solvers[day].SolvePartOne;
      const solvePartTwo = solvers[day].SolvePartTwo;
      console.log(`Day ${day} Part 01: ${solvePartOne()}`);
      console.log(`Day ${day} Part 02: ${solvePartTwo()}`);
    } else {
      console.log("Invalid day input");
    }
  })
  .catch((error) => {
    console.error("Error loading solvers:", error);
  });
