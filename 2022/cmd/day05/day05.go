package day05

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

const filePathPrefix = "cmd/day05/"
const sampleFileName = filePathPrefix + "sampleinput.txt"
const fullFileName = filePathPrefix + "fullinput.txt"

type instruction struct {
	Amount      int
	Origin      int
	Destination int
}

func Solve(start time.Time) {
	input := fileutil.ReadLines(sampleFileName)
	firstPartCrates, instructions := parseInput(input)
	secondPartCrates := make([]string, len(firstPartCrates))
	copy(secondPartCrates, firstPartCrates)
	fmt.Printf("Day 05 Part 01: Top Crates are: %s \n", MoveCrates(firstPartCrates, instructions, false))
	elapsed := time.Since(start)
	fmt.Printf("Day 05 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 05 Part 02: Top Crates are %s \n", MoveCrates(secondPartCrates, instructions, true))
	elapsed = time.Since(start)
	fmt.Printf("Day 05 Part 02: finished in: %s \n", elapsed)
}

// TODO: Check string handling here, should be a more pleasant way to pop chars
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

func isNumber(s string) bool {
	_, err := strconv.Atoi(s)
	return err == nil
}

func parseInput(input []string) ([]string, []instruction) {
	crates := []string{}
	instructions := []instruction{}
	crateString := ""
	for i := 1; i < len(input[0]); i += 4 {
		for j := 0; j < len(input); j++ {
			if isNumber(string([]rune(input[j])[i])) {
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
			amount, err := strconv.Atoi(words[1])
			if err != nil {
				log.Fatal(err)
			}
			origin, err := strconv.Atoi(words[3])
			if err != nil {
				log.Fatal(err)
			}
			destination, err := strconv.Atoi(words[5])
			if err != nil {
				log.Fatal(err)
			}
			instructions = append(instructions, instruction{Amount: amount, Origin: origin, Destination: destination})
		}
	}
	return crates, instructions
}
