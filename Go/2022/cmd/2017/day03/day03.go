package day03_2017

import (
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
	"github.com/charmbracelet/log"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	log.Info("Day 03 Part 01:", "Checksum", SolvePartOne(useSampleFlag, day))
	log.Info("Day 03 Part 02:", "Checksum", SolvePartTwo(useSampleFlag, day))
}

func SolvePartOne(useSampleFlag bool, day int) float64 {
	num := stringutil.ParseNumber(fileutil.GetStringInput(useSampleFlag, day, 2017))
	floatN := float64(num)
	//Ulam Spiral. Get Coordinates
	return floatN
}

func SolvePartTwo(useSampleFlag bool, day int) int {
	return 0
}
