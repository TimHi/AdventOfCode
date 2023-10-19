package day10

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	program := loadProgram(input)
	cycleSum := executeProgram(program)
	fmt.Printf("Day 10 Part 01: Sum of Cycles: %d \n", cycleSum)
	elapsed := time.Since(start)
	fmt.Printf("Day 10 finished in: %s \n", elapsed)

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
	crtLine := "                                        "
	cycleSum := 0
	x := 1
	for c := 1; c < len(instructions); c++ {
		if math.Abs(float64(x)) >= 0 && math.Abs(float64(x)) < 40 {
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

		if c == 19 || c == 59 || c == 99 || c == 139 || c == 179 || c == 219 {
			cycleSum = cycleSum + ((c + 1) * x) //Add + 1 to get the "clean" cycle, hacky way
		}

		x += instructions[c]
		if ((c) % 39) == 0 {
			crtLines = append(crtLines, crtLine)
			crtLine = "                                        "
		}
	}
	printCrt(crtLines)
	return cycleSum
}

// Part 2 Simply print the result
func printCrt(crtLines []string) {
	for _, crt := range crtLines {
		fmt.Println(crt)
	}
}
