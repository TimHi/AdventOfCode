package day01

import (
	"log"
	"strconv"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/pairs"
)

const filePathPrefix = "cmd/day01/"
const sampleFileName = "sampleinput.txt"
const fullFileName = "fullinput.txt"

func Solve(start time.Time) {
	input := fileutil.ReadLines(filePathPrefix + fullFileName)
	elfs := setupElfCalorieMap(input)

	sortedElfs := pairs.SortMapToPairs(elfs)
	log.Printf("Day 01: Part 01 Elf %d with %d Calories", sortedElfs[0].Key, sortedElfs[0].Value)
	elapsed := time.Since(start)
	log.Printf("Day 01: Part 01 took: %s", elapsed)

	topThreeElfCalorieSum := 0
	for i := 0; i < 3; i++ {
		topThreeElfCalorieSum += sortedElfs[i].Value
	}

	log.Printf("Day 01: Part 02 Top three elves carry %d calories", topThreeElfCalorieSum)
	elapsed = time.Since(start)
	log.Printf("Day 01: Part 02 took: %s", elapsed)
}

func setupElfCalorieMap(values []string) map[int]int {
	var elfs = map[int]int{}
	elfId := 0
	for _, element := range values {
		if len(element) == 0 {
			elfId++
			elfs[elfId] = 0
		} else {
			calorie, err := strconv.Atoi(element)
			if err != nil {
				log.Fatal("Converting calorie failed: " + element)
			}

			elfs[elfId] += calorie
		}
	}
	return elfs
}
