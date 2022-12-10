package day10

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 10 Part 01: Sum of Cycles: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 10 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 10 Part 02: Fields visited by the Tail at least once: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 10 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	program := loadProgram(input)
	cycleSum := executeProgram(program)
	return cycleSum
}

func loadProgram(input []string) []int {
	instructions := []int{}
	for _, line := range input {
		instruction := strings.Split(line, " ")
		if len(instruction) > 1 {
			instructions = append(instructions, 0) // add takes two cycles, add a empty instruction
			instructions = append(instructions, stringutil.ParseNumber(instruction[1]))
		} else {
			instructions = append(instructions, 0)
		}
	}
	return instructions
}

func executeProgram(instructions []int) int {
	cycleSum := 0
	x := 1
	for c := 0; c < len(instructions); c++ {
		//fmt.Printf("Instruction at instructions[%d] = %d\n", c, instructions[c])
		//if c == 20 || c == 60 || c == 100 || c == 140 || c == 180 || c == 220 {
		if c == 19 || c == 59 || c == 99 || c == 139 || c == 179 || c == 219 {
			cycleSum = cycleSum + ((c + 1) * x)
			fmt.Printf("Cycle %d Cyclesum %d x %d\n", c, cycleSum, x)
		}
		x += instructions[c]
	}
	return cycleSum //13.140
}

/*
During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420. (The 20th cycle occurs in the middle of the second addx -1, so the value of register X is the starting value, 1, plus all of the other addx values up to that point: 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.)
During the 60th cycle, register X has the value 19, so the signal strength is 60 * 19 = 1140.
During the 100th cycle, register X has the value 18, so the signal strength is 100 * 18 = 1800.
During the 140th cycle, register X has the value 21, so the signal strength is 140 * 21 = 2940.
During the 180th cycle, register X has the value 16, so the signal strength is 180 * 16 = 2880.
During the 220th cycle, register X has the value 18, so the signal strength is 220 * 18 = 3960.
*/
func SolvePartTwo(input []string) int {
	return 0
}
