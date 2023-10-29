package day19_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/2022/day19"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
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
	input := fileutil.GetStringInputs(true, 19, 2022)
	day19.SolvePartOne(input)
	//assert.Equal(t, 12, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 19, 2022)
	day19.SolvePartTwo(input)
	//assert.Equal(t, 58, result, "Result was not matching")
}
