package day08_test

import (
	"fmt"
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

var GetCoordinateTestData = []struct {
	row    int
	column int
	out    int
}{
	{0, 0, 3},
	{0, 4, 3},
	{1, 4, 2},
	{2, 0, 6},
	{3, 3, 4},
	{3, 4, 9},
	{4, 1, 5},
}

func TestGetCoordinate(t *testing.T) {
	input := fileutil.GetStringInputs(true, 8)
	for _, testData := range GetCoordinateTestData {
		r := day08.GetCoordinate(testData.row, testData.column, &input)
		m := fmt.Sprintf("GetCoordinate: [%d][%d] Expected: %d, Got: %d", testData.row, testData.column, r, testData.out)
		assert.Equal(t, testData.out, r, m)
	}
}
