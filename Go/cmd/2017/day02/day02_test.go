package day02_2017_test

import (
	"os"
	"path"
	"runtime"
)

func init() {
	_, filename, _, _ := runtime.Caller(0)
	// The ".." may change depending on you folder structure
	dir := path.Join(path.Dir(filename), "../../../../")
	err := os.Chdir(dir)
	if err != nil {
		panic(err)
	}
}

// func TestSolvePartOne(t *testing.T) {
// 	input := fileutil.GetStringInput(true, 2, 2017)
// 	digits := stringutil.ParseDigitsFromString(input)
// 	result := day02_2017.SolvePartOne(digits)
// 	assert.Equal(t, 3, result, "Result was not matching")
// }

// func TestSolvePartTwo(t *testing.T) {
// 	input := fileutil.GetStringInput(true, 2, 2017)
// 	digits := stringutil.ParseDigitsFromString(input)
// 	result := day02_2017.SolvePartTwo(digits)
// 	assert.Equal(t, 0, result, "Result was not matching")
// }
