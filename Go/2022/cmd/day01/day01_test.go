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

	input := fileutil.GetStringInputs(true, 1)
	result := day01.SolvePartOne(input)
	assert.Equal(t, pairs.Pair{Key: 3, Value: 24000}, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 1)
	result := day01.SolvePartTwo(input)
	assert.Equal(t, 45000, result, "Result was not matching")
}

var CalorieMapTestData = []struct {
	in  []string
	out map[int]int
}{
	{[]string{"1000", "2000", "3000", "", "4000", "", "5000", "6000", "", "7000", "8000", "9000", "", "10000"}, map[int]int{0: 6000, 1: 4000, 2: 11000, 3: 24000, 4: 10000}},
	{[]string{}, map[int]int{}},
}

func TestSetupElfCalorieMap(t *testing.T) {
	for _, testData := range CalorieMapTestData {
		r := day01.SetupElfCalorieMap(testData.in)
		assert.Equal(t, testData.out, r, "Map was constructed wron")
	}
}
