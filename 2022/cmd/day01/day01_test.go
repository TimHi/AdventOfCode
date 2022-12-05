package day01_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day01"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/pairs"
	"github.com/stretchr/testify/assert"
)

func init() {
	_, filename, _, _ := runtime.Caller(0)
	// The ".." may change depending on you folder structure
	dir := path.Join(path.Dir(filename), "../..")
	err := os.Chdir(dir)
	if err != nil {
		panic(err)
	}
}

func TestSolvePartOne(t *testing.T) {
	//	log.Printf("Day 01: Part 01 Elf %d with %d Calories", sortedElfs[0].Key, sortedElfs[0].Value)

	input := fileutil.GetPuzzleInput(true, 1)
	result := day01.SolvePartOne(input)
	assert.Equal(t, pairs.Pair{Key: 3, Value: 24000}, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetPuzzleInput(true, 1)
	result := day01.SolvePartTwo(input)
	assert.Equal(t, 45000, result, "Result was not matching")
}
