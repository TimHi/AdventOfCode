package day11_test

import (
	"fmt"
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/2022/day11"
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
	input := fileutil.GetStringInputs(true, 11)
	result := day11.SolvePartOne(input)
	assert.Equal(t, 10605, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 11)
	result := day11.SolvePartTwo(input)
	assert.Equal(t, 2713310158, result, "Result was not matching")
}

var WorryLevelTestData = []struct {
	op1     string
	op2     string
	operand string
	level   int
	out     int
}{
	{"old", "old", "+", 5, 10},
	{"old", "old", "*", 5, 25},
	{"1", "old", "+", 5, 6},
	{"old", "1", "+", 5, 6},
	{"old", "2", "*", 5, 10},
	{"2", "2", "+", 5, 4},
	{"2", "8", "*", 5, 16},
}

func TestCalculateWorryLevel(t *testing.T) {
	for _, testData := range WorryLevelTestData {
		r := day11.CalculateWorryLevel(testData.op1, testData.op2, testData.operand, testData.level)
		m := fmt.Sprintf("CalculateWorryLevel: %s %s %s Expected %d", testData.op1, testData.operand, testData.op2, testData.out)
		assert.Equal(t, testData.out, r, m)
	}
}
