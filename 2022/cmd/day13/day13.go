package day13

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 13 Part 01: Indece sum of correct signals: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 13 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 13 Part 02: Monkey buisness level: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 13 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	input = append(input, "") // We check for newline manually insert a new one
	sum := 0
	leftSide := ""
	rightSide := ""
	for _, row := range input {
		if row == "" {
			checkSignal(leftSide, rightSide)
			leftSide = ""
			rightSide = ""
		} else {
			if leftSide == "" {
				leftSide = row
			}
			rightSide = row
		}
	}

	return sum
}

func SolvePartTwo(input []string) int {
	return 0
}

type Package struct {
}

func checkSignal(leftSide, rightSide string) bool {

	return true
}

func unMarshalSides(row string, leftSide *[]interface{}, rightSide *[]interface{}) {
	if *leftSide == nil {
		unMarshalUnknown(row, leftSide)
	}
	unMarshalUnknown(row, rightSide)
}

func unMarshalUnknown(value string, dest *[]interface{}) {
	err := json.Unmarshal([]byte(value), &dest)
	if err != nil {
		panic("Tried parsing invalid JSON")
	}
}
