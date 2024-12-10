package day04_2017

import (
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/charmbracelet/log"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	log.Info("Day 04 Part 01:", "Valid passphrases", SolvePartOne(useSampleFlag, day))
	log.Info("Day 04 Part 02:", "Valid passphrases", SolvePartTwo(useSampleFlag, day))
}

func SolvePartOne(useSampleFlag bool, day int) int {
	passphrases := fileutil.GetStringInputs(useSampleFlag, day, 2017)
	validPasswords := 0
	for _, passpassphrase := range passphrases {
		wordmap := map[string]int{}
		isValid := true
		words := strings.Split(passpassphrase, " ")

		for _, word := range words {
			v, ok := wordmap[word]
			if ok {
				isValid = false
				wordmap[word] = 0
			}
			wordmap[word] = v + 1
		}

		if isValid {
			validPasswords += 1
		}
	}

	return validPasswords
}

func SolvePartTwo(useSampleFlag bool, day int) int {
	return 0
}
