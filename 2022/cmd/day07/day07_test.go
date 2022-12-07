package day07_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day07"
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
	input := fileutil.GetPuzzleInput(true, 7)
	result := day07.SolvePartOne(input)
	var expected int64 = 95437
	assert.Equal(t, expected, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetPuzzleInput(true, 7)
	result := day07.SolvePartTwo(input)
	var expected int64 = 24933642
	assert.Equal(t, expected, result, "Result was not matching")
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

// Test wether the IsCommand function correctly detects commands
func TestIsCommand(t *testing.T) {
	for _, testData := range IsCommandTestData {
		r := day07.IsCommand(testData.in)
		assert.Equal(t, testData.out, r, "IsCommand returned the wrong value for: "+testData.in)
	}
}

var IsCdCommandTestData = []struct {
	in  string
	out bool
}{
	{"$ cd d", true},
	{"$ cd", true},
	{"$ cd ", true},
	{"$", false},
	{"$ c", false},
	{" $ cd", false},
	{"a$ cd", false},
	{"a $ cda", false},
	{"", false},
}

// Test wether the IsCdCommand function correctly detects commands
func TestIsCdCommand(t *testing.T) {
	for _, testData := range IsCdCommandTestData {
		r := day07.IsCdCommand(testData.in)
		assert.Equal(t, testData.out, r, "IsCdCommand returned the wrong value for: "+testData.in)
	}
}

var GetTargetDirectoryTestData = []struct {
	in  string
	out string
}{
	{"$ cd d", "d"},
	{"$ cd longDirectory", "longDirectory"},
	{"$ cd perhaps with spaces", "perhaps with spaces"},
}

// Test wether the IsCdCommand function correctly detects commands
func TestGetTargetDirectory(t *testing.T) {
	for _, testData := range GetTargetDirectoryTestData {
		r := day07.GetTargetDirectory(testData.in)
		assert.Equal(t, testData.out, r, "GetTargetDirectory returned the wrong value for: "+testData.in)
	}
}

var IsLsOutputTestData = []struct {
	in  string
	out bool
}{
	{"14848514 b.txt", true},
	{"14848514 b", true},
	{"1 b.txt", true},
	{"14848514", false},
	{"$ ls ", false},
	{" $ ls", false},
	{"$ls", false},
	{"a$ ls", false},
	{"$ ls s", false},
	{"", false},
}

// Test wether the IsLsCommand function correctly detects commands
func TestIsLsCommand(t *testing.T) {
	for _, testData := range IsLsOutputTestData {
		r := day07.IsLsOutput(testData.in)
		assert.Equal(t, testData.out, r, "IsCdCommand returned the wrong value for: "+testData.in)
	}
}
