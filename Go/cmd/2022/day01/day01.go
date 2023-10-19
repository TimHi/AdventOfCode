package day01

import (
	"fmt"
	"log"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/pairs"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	sortedElf := SolvePartOne(input)
	log.Printf("Day 01: Part 01 Elf %d with %d Calories", sortedElf.Key, sortedElf.Value)
	elapsed := time.Since(start)
	log.Printf("Day 01: Part 01 took: %s", elapsed)
	topThreeElfCalorieSum := SolvePartTwo(input)
	log.Printf("Day 01: Part 02 Top three elves carry %d calories", topThreeElfCalorieSum)
	elapsed = time.Since(start)
	log.Printf("Day 01: Part 02 took: %s", elapsed)
}

func SolvePartOne(input []string) pairs.Pair {
	elfs := setupElfCalorieMap(input)
	return pairs.SortMapToPairs(elfs)[0]
}

func SolvePartTwo(input []string) int {
	elfs := setupElfCalorieMap(input)
	fmt.Println(elfs)
	sortedElfs := pairs.SortMapToPairs(elfs)
	topThreeElfCalorieSum := 0
	for i := 0; i < 3; i++ {
		topThreeElfCalorieSum += sortedElfs[i].Value
	}
	return topThreeElfCalorieSum
}

func setupElfCalorieMap(values []string) map[int]int {
	var elfs = map[int]int{}
	elfId := 0
	for _, element := range values {
		if len(element) == 0 {
			elfId++
			elfs[elfId] = 0
		} else {
			elfs[elfId] += stringutil.ParseNumber(element)
		}
	}
	return elfs
}
