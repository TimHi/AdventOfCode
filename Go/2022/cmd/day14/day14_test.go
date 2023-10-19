package day14_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day14"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
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
	input := fileutil.GetStringInputs(true, 14)
	result := day14.SolvePartOne(input)
	assert.Equal(t, 24, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 14)
	result := day14.SolvePartTwo(input)
	assert.Equal(t, 93, result, "Result was not matching")
}
