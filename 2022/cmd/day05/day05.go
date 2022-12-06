package day05

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

type instruction struct {
	Amount      int
	Origin      int
	Destination int
}

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetPuzzleInput(useSampleFlag, day)
	fmt.Printf("Day 05 Part 01: Top crates from the CrateMover 9000 are: %s \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 05 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 05 Part 02: Top crates from the CrateMover 9001 are %s \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 05 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) string {
	crates, instructions := parseInput(input)
	return MoveCrates(crates, instructions, false)
}

func SolvePartTwo(input []string) string {
	crates, instructions := parseInput(input)
	return MoveCrates(crates, instructions, true)
}

func MoveCrates(crates []string, instructions []instruction, canMoveMultiple bool) string {
	for _, instruction := range instructions {
		origin := crates[instruction.Origin-1]
		payload := origin[0:instruction.Amount]
		origin = origin[instruction.Amount:]
		crates[instruction.Origin-1] = origin
		dest := crates[instruction.Destination-1]
		if canMoveMultiple {
			dest = payload + dest
		} else {
			dest = stringutil.Reverse(payload) + dest
		}
		crates[instruction.Destination-1] = dest
	}
	result := ""
	for _, c := range crates {
		if len(c) > 0 {
			result += string([]rune(c)[0])
		}
	}
	return result
}

func parseInput(input []string) ([]string, []instruction) {
	crates := []string{}
	instructions := []instruction{}
	crateString := ""
	for i := 1; i < len(input[0]); i += 4 {
		for j := 0; j < len(input); j++ {
			if stringutil.IsNumber(string([]rune(input[j])[i])) {
				crates = append(crates, crateString)
				crateString = ""
				break
			}
			if string([]rune(input[j])[i]) != " " {
				crateString = crateString + string([]rune(input[j])[i])
			}
		}
	}

	for _, line := range input {
		if len(line) > 0 && line[0:1] == "m" {
			words := strings.Split(line, " ")
			amount := stringutil.ParseNumber(words[1])
			origin := stringutil.ParseNumber(words[3])
			destination := stringutil.ParseNumber(words[5])
			instructions = append(instructions, instruction{Amount: amount, Origin: origin, Destination: destination})
		}
	}
	return crates, instructions
}
