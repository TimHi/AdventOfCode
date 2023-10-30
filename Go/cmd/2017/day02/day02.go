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
	//log.Info("Day 01 Part 02:", "Captcha", SolvePartTwo(digits))
}

func SolvePartOne(useSampleFlag bool, day int) int {
	lines := fileutil.GetStringInputs(useSampleFlag, day, 2017)
	var result = make([][]string, 0)
	if useSampleFlag {
		result = sliceutil.SplitSliceBySeperator(lines, " ")
	} else {
		result = sliceutil.SplitSliceBySeperator(lines, "	")
	}

	checkSum := 0
	for _, stringRow := range result {
		ints := sliceutil.StringToIntSlice(stringRow)
		checkSum += slices.Max(ints) - slices.Min(ints)
	}

	return checkSum
}
