package day06

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetPuzzleInput(useSampleFlag, day)
	fmt.Printf("Day 06 Part 01: Datastream marker at Position: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 06 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 06 Part 02: Message marker at Position: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 06 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	dataStream := input[0]
	return checkChunks(dataStream, 4)
}

func SolvePartTwo(input []string) int {
	dataStream := input[0]
	return checkChunks(dataStream, 14)
}

func checkChunks(data string, chunkSize int) int {
	for i := 0; i < len(data); i++ {
		if i+chunkSize < len(data) {
			dataChunk := data[i : i+chunkSize]
			if isMarker(dataChunk) {
				return i + chunkSize // +chunkSize to get the end of the marker
			}
		}
	}
	return -1
}

func isMarker(data string) bool {
	if len(data) == 0 {
		return false
	}
	for _, r := range data {
		if strings.Count(data, string(r)) > 1 {
			return false
		}
	}
	return true
}
