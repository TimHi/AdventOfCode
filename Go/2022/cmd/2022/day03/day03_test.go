package day03_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/2022/day03"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/stretchr/testify/assert"
)

func init() {
	_, filename, _, _ := runtime.Caller(0)
	// The ".." may change depending on you folder structure
	dir := path.Join(path.Dir(filename), "../../..")
	err := os.Chdir(dir)
	if err != nil {
		panic(err)
	}
}

func TestSolvePartOne(t *testing.T) {
	input := fileutil.GetStringInputs(true, 3, 2022)
	result := day03.SolvePartOne(input)
	assert.Equal(t, 157, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 3, 2022)
	result := day03.SolvePartTwo(input)
	assert.Equal(t, 70, result, "Result was not matching")
}
