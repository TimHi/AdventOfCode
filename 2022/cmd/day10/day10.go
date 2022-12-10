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
	crtLines := []string{}
	crtLine := "........................................"
	cycleSum := 0
	x := 1
	for c := 1; c < len(instructions); c++ {
		if x >= 0 && x <= 40 {
			//TODO: Off by one somehow
			crtPrinter := (c) % 40
			if crtPrinter == x-1 {
				crtLine = crtLine[:x-1] + "#" + crtLine[x:]
			}
			if crtPrinter == x {
				crtLine = crtLine[:x] + "#" + crtLine[x+1:]
			}
			if crtPrinter == x+1 {
				crtLine = crtLine[:x+1] + "#" + crtLine[x+2:]
			}
		}

		if ((c)%39) == 0 && c > 0 {
			crtLines = append(crtLines, crtLine)
			crtLine = "........................................"
		}
		if c == 19 || c == 59 || c == 99 || c == 139 || c == 179 || c == 219 {
			cycleSum = cycleSum + ((c + 1) * x) //Add + 1 to get the "clean" cycle, hacky way
			fmt.Printf("Cycle %d Cyclesum %d x %d\n", c, cycleSum, x)
		}
		x += instructions[c]
	}
	printCrt(crtLines)
	return cycleSum
}

func printCrt(crtLines []string) {
	for _, crt := range crtLines {
		fmt.Println(crt)
	}
}

func SolvePartTwo(input []string) int {
	return 0

}
