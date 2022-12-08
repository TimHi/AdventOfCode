package day08_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day08"
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
	input := fileutil.GetStringInputs(true, 8)
	result := day08.SolvePartOne(input)
	assert.Equal(t, 21, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 8)
	result := day08.SolvePartTwo(input)
	assert.Equal(t, 8, result, "Result was not matching")
}

var IsCommandTestData = []struct {
	in  string
	out bool
}{
	{"$ cd", true},
	{"$", true},
	{"$ ", true},
	{" $", false},
	{"a$", false},
	{"a $ a", false},
	{"", false},
}

func TestGetCoordinate(t *testing.T) {

}
