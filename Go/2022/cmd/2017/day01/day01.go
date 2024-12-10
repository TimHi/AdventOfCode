package day01_2017

import (
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
	"github.com/charmbracelet/log"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInput(useSampleFlag, day, 2017)
	digits := stringutil.ParseDigitsFromString(input)
	log.Info("Day 01 Part 01:", "Captcha", SolvePartOne(digits))
	log.Info("Day 01 Part 02:", "Captcha", SolvePartTwo(digits))
}

func SolvePartOne(digits []int) int {
	captcha_sum := 0
	for i, digit := range digits {
		if i == len(digits)-1 {
			if digit == digits[0] {
				captcha_sum += digit
			}
		} else {
			if digit == digits[i+1] {
				captcha_sum += digit
			}
		}
	}
	return captcha_sum
}

func SolvePartTwo(digits []int) int {
	captcha_sum := 0
	num_elements := len(digits)
	skip_ahead := num_elements / 2
	for i, digit := range digits {
		index := (i + skip_ahead) % num_elements
		if digit == digits[index] {
			captcha_sum += digit
		}
	}
	return captcha_sum
}
