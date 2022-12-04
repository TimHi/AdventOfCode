package day03

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
)

const filePathPrefix = "cmd/day03/"
const sampleFileName = filePathPrefix + "sampleinput.txt"
const fullFileName = filePathPrefix + "fullinput.txt"

var alphabet = map[string]int{"a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15, "p": 16, "q": 17, "r": 18, "s": 19, "t": 20, "u": 21, "v": 22, "w": 23, "x": 24, "y": 25, "z": 26,
	"A": 27, "B": 28, "C": 29, "D": 30, "E": 31, "F": 32, "G": 33, "H": 34, "I": 35, "J": 36, "K": 37, "L": 38, "M": 39, "N": 40, "O": 41, "P": 42, "Q": 43, "R": 44, "S": 45, "T": 46, "U": 47, "V": 48, "W": 49, "X": 50, "Y": 51, "Z": 52}

func Solve(start time.Time) {
	input := fileutil.ReadLines(fullFileName)
	fmt.Printf("Day 03 Part 01: Priority is: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 03 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 03 Part 02: Priority is %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 03 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	prio := 0
	for _, rucksack := range input {
		compOne := strings.Split(rucksack[0:(len(rucksack)/2)], "")
		compTwo := strings.Split(rucksack[len(rucksack)/2:], "")
		subs := sliceutil.Intersection(compOne, compTwo)
		for _, sub := range subs {
			prio += alphabet[sub]
		}
	}
	return prio
}

func SolvePartTwo(input []string) int {
	prio := 0
	comp := []string{}
	//Had no time here, loop can be improved
	for i, content := range input {
		if len(comp) == 3 {
			subOneTwo := sliceutil.Intersection(strings.Split(comp[0], ""), strings.Split(comp[1], ""))
			subsOneThree := sliceutil.Intersection(strings.Split(comp[0], ""), strings.Split(comp[2], ""))
			subs := sliceutil.Intersection(subOneTwo, subsOneThree)
			for _, sub := range subs {
				prio += alphabet[sub]
			}
			comp = []string{}
			comp = append(comp, content)
		} else if i == len(input)-1 {
			comp = append(comp, content)
			subOneTwo := sliceutil.Intersection(strings.Split(comp[0], ""), strings.Split(comp[1], ""))
			subsOneThree := sliceutil.Intersection(strings.Split(comp[0], ""), strings.Split(comp[2], ""))
			subs := sliceutil.Intersection(subOneTwo, subsOneThree)
			for _, sub := range subs {
				prio += alphabet[sub]
			}
		} else {
			comp = append(comp, content)
		}
	}
	return prio
}
