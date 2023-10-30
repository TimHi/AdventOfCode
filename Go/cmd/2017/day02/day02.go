package day02_2017

import (
	"slices"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
	"github.com/charmbracelet/log"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	log.Info("Day 02 Part 01:", "Checksum", SolvePartOne(useSampleFlag, day))
	log.Info("Day 02 Part 02:", "Checksum", SolvePartTwo(useSampleFlag, day))
}

func SolvePartOne(useSampleFlag bool, day int) int {
	lines := fileutil.GetStringInputs(useSampleFlag, day, 2017)
	splits := getSplitLines(useSampleFlag, lines)

	checkSum := 0
	for _, stringRow := range splits {
		ints := sliceutil.StringToIntSlice(stringRow)
		checkSum += slices.Max(ints) - slices.Min(ints)
	}

	return checkSum
}

func SolvePartTwo(useSampleFlag bool, day int) int {
	lines := fileutil.GetStringInputs(useSampleFlag, day, 2017)
	return CalculateDividingChecksum(lines, useSampleFlag)
}

func CalculateDividingChecksum(rows []string, useSampleFlag bool) int {
	splits := getSplitLines(useSampleFlag, rows)
	checksum := 0
	for _, stringRow := range splits {
		ints := sliceutil.StringToIntSlice(stringRow)
		for i, dividend := range ints {
			for j, divisor := range ints {
				if i != j && dividend%divisor == 0 {
					checksum += dividend / divisor
				}
			}
		}
	}
	return checksum
}

func getSplitLines(useSpaceSeperator bool, lines []string) [][]string {
	var result = make([][]string, 0)
	if useSpaceSeperator {
		result = sliceutil.SplitSliceBySeperator(lines, " ")
	} else {
		result = sliceutil.SplitSliceBySeperator(lines, "	")
	}
	return result
}
