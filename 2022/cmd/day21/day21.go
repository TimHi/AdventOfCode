package day21

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 21 Part 01: root yells: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 21 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 21 Part 02: TBD: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 21 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	boing := map[string]bool{}
	for _, v := range input {
		split := strings.Split(v, ":")
		_, ok := boing[split[0]]
		if !ok {
			boing[split[0]] = true
		} else {
			fmt.Println("Boioioiong")
		}
	}

	return 0
}

func SolvePartTwo(input []string) int {
	return 0
}
