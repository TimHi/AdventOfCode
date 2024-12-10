package day02_2017_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	day02_2017 "github.com/TimHi/AdventOfCode/m/v2/cmd/2017/day02"
	"github.com/bmizerany/assert"
)

func init() {
	_, filename, _, _ := runtime.Caller(0)
	// The ".." may change depending on you folder structure
	dir := path.Join(path.Dir(filename), "../../../")
	err := os.Chdir(dir)
	if err != nil {
		panic(err)
	}
}

func TestSolvePartOne(t *testing.T) {
	result := day02_2017.SolvePartOne(true, 2)
	assert.Equal(t, 18, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	rows := []string{"5 9 2 8", "9 4 7 3", "3 8 6 5"}
	result := day02_2017.CalculateDividingChecksum(rows, true)
	assert.Equal(t, 9, result, "Result was not matching")
}
