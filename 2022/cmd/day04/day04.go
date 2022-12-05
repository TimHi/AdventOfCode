package day04

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
	"github.com/juliangruber/go-intersect"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetPuzzleInput(useSampleFlag, day)
	fmt.Printf("Day 04 Part 01: Full overlaps: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 04 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 04 Part 02: Partial overlaps %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 04 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	fullOverlap := 0
	for _, assignments := range input {
		firstElf, secondElf := setupElfSlices(strings.Split(assignments, ","))
		fullOverlap += isFullOverlap(firstElf, secondElf)
	}
	return fullOverlap
}

func SolvePartTwo(input []string) int {
	partialOverlap := 0
	for _, assignments := range input {
		firstElf, secondElf := setupElfSlices(strings.Split(assignments, ","))
		partialOverlap += isOverlap(firstElf, secondElf)
	}
	return partialOverlap
}

func setupElfSlices(elfs []string) ([]int, []int) {
	firstElf := sliceutil.StringToIntSlice(strings.Split(elfs[0], "-"))
	secondElf := sliceutil.StringToIntSlice(strings.Split(elfs[1], "-"))
	return firstElf, secondElf
}

func isFullOverlap(firstElf, secondElf []int) int {
	if firstElf[0] <= secondElf[0] && firstElf[1] >= secondElf[1] {
		return 1
	}
	if firstElf[0] >= secondElf[0] && firstElf[1] <= secondElf[1] {
		return 1
	}
	if secondElf[0] <= firstElf[0] && secondElf[1] >= firstElf[1] {
		return 1
	}
	return 0
}

func isOverlap(firstElf, secondElf []int) int {
	result := intersect.Hash(sliceutil.BloatSlice(firstElf[0], firstElf[1]), sliceutil.BloatSlice(secondElf[0], secondElf[1]))
	if len(result) > 0 {
		return 1
	}
	return 0
}
