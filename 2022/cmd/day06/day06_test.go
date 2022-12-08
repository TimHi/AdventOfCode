package day06_test

import (
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day06"

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
	input := fileutil.GetStringInputs(true, 6)
	result := day06.SolvePartOne(input)
	assert.Equal(t, 7, result, "Result was not matching")
}

func TestSolvePartTwo(t *testing.T) {
	input := fileutil.GetStringInputs(true, 6)
	result := day06.SolvePartTwo(input)
	assert.Equal(t, 19, result, "Result was not matching")
}

// Test wether the Check Chunks method correctly catches the case when the desired chunk size is bigger than the
// Input
func TestCheckChunksShortInput(t *testing.T) {
	testString := "Test String"
	result := day06.CheckChunks(testString, len(testString)+1)
	assert.Equal(t, -1, result, "Result was not matching")
}

// Test wether the Check Chunks method correctly catches the case when there is no match
func TestCheckChunksNoMatch(t *testing.T) {
	testString := "aaaaaaaaaaaaa"
	result := day06.CheckChunks(testString, 2)
	assert.Equal(t, -1, result, "Result was not matching")
}

var CheckChunkSuccess = []struct {
	in        string
	chunkSize int
	out       int
}{
	{"mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4, 7},
	{"bvwbjplbgvbhsrlpgdmjqwftvncz", 4, 5},
	{"nppdvjthqldpwncqszvftbrmjlhg", 4, 6},
	{"nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4, 10},
	{"zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4, 11},
	{"mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14, 19},
	{"bvwbjplbgvbhsrlpgdmjqwftvncz", 14, 23},
	{"nppdvjthqldpwncqszvftbrmjlhg", 14, 23},
	{"nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14, 29},
	{"zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14, 26},
}

// Test wether the sample input is correctly handled
func TestFlagParser(t *testing.T) {
	for _, testData := range CheckChunkSuccess {
		r := day06.CheckChunks(testData.in, testData.chunkSize)
		assert.Equal(t, testData.out, r, "Result was not matching")
	}
}

var IsMarkerTestData = []struct {
	in  string
	out bool
}{
	{"mjqjpqmgbljsphdztnvjfqwrcgsmlb", false},
	{"aa", false},
	{"", false},
	{"abcd", true},
	{"aabcd", false},
	{"abcdd", false},
}

func TestIsMarker(t *testing.T) {
	for _, testData := range IsMarkerTestData {
		r := day06.IsMarker(testData.in)
		assert.Equal(t, testData.out, r, "IsMarker returned the wrong value for: "+testData.in)
	}
}
