package day02

import (
	"log"
	"regexp"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2023)
	possibleGamesSum := SolvePartOne(input)
	log.Printf("Day 02: Part 01 %d", possibleGamesSum)
	elapsed := time.Since(start)
	log.Printf("Day 02: Part 01 took: %s", elapsed)

	log.Printf("Day 02: Part 02 took: %s", elapsed)
}

func SolvePartOne(input []string) int {
	r := regexp.MustCompile(`(\d+) green`)
	for _, line := range input {
		match := r.FindAllString(line, -1)
		log.Println(match)
	}
	return 0
}
