package day20

import (
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/numbers"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 20 Part 01: Highest quality level: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 20 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 20 Part 02: Highest quality level with encryption key: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 20 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	numberList := sliceutil.StringToIntSlice(input)
	mcHammer := make([]int, len(numberList))
	copy(mcHammer, numberList)
	mixedList, indexList := mix(numberList, 1)
	sum := getSumAfterN(mixedList, indexList, mcHammer)
	return sum
}

func getSumAfterN(numberList []int, indexList []int, mcHammer []int) int {
	originalZeroIndex := sliceutil.GetIndexOfInt(0, mcHammer)
	zeroIndex := sliceutil.GetIndexOfInt(originalZeroIndex, indexList)
	sum := 0
	// After 0 means taking the 0 index + the nth number
	for _, v := range []int{1000, 2000, 3000} {
		afterZero := zeroIndex + v
		afterZeroMod := afterZero % len(indexList)
		value := numberList[afterZeroMod]
		sum += value
	}
	return sum
}

func mix(numberList []int, times int) ([]int, []int) {
	indexSlice := sliceutil.BloatSlice(0, len(numberList)-1)
	for t := 0; t < times; t++ {
		for i := 0; i < len(numberList); i++ {
			index := sliceutil.GetIndexOfInt(i, indexSlice)
			value := numberList[index]
			if value == 0 {
				continue
			}
			destination := (index + (value))
			if destination == 0 {
				destination = len(numberList) - 1
			}
			numberList = moveInt(numberList, index, destination)
			indexSlice = moveInt(indexSlice, index, destination)
		}
	}
	return numberList, indexSlice
}

func SolvePartTwo(input []string) int {
	numberList := sliceutil.StringToIntSlice(input)
	for i, v := range numberList {
		v *= 811589153
		numberList[i] = v
	}
	mcHammer := make([]int, len(numberList))
	copy(mcHammer, numberList)
	mixedList, indexList := mix(numberList, 10)
	sum := getSumAfterN(mixedList, indexList, mcHammer)
	return sum
}

func moveInt(array []int, srcIndex int, dstIndex int) []int {
	if srcIndex > len(array)-1 {
		srcIndex = int(numbers.Mod(int64(srcIndex), int64(len(array)-1)))
	}

	if dstIndex > len(array)-1 {
		dstIndex = int(numbers.Mod(int64(dstIndex), int64(len(array)-1)))
	}
	if dstIndex < 0 {
		dstIndex = int(numbers.Mod(int64(dstIndex), int64(len(array)-1)))
	}
	value := array[srcIndex]
	return sliceutil.InsertInt(sliceutil.Remove(array, srcIndex), value, dstIndex)
}
