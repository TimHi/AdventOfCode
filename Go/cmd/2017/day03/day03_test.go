package day03_2017_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	day03_2017 "github.com/TimHi/AdventOfCode/m/v2/cmd/2017/day03"
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
	result := day03_2017.SolvePartOne(true, 3)
	assert.Equal(t, 18, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	result := day03_2017.SolvePartTwo(true, 3)
	assert.Equal(t, 12, result, "Result was not matching")
}
