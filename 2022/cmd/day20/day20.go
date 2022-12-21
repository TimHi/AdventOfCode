package day20

import (
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 20 Part 01: Highest quality level: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 20 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 20 Part 02: TBD: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 20 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	numberList := sliceutil.StringToIntSlice(input)
	mixedList, indexList := mix(numberList, 1)
	sum := getSumAfterN(mixedList, indexList)
	return sum
}

func getSumAfterN(numberList []int, indexList []int) int {
	fmt.Println(numberList)
	fmt.Println(indexList)
	zeroIndex := sliceutil.GetIndexOfInt(5, indexList) // 5 is mapped to 0
	sum := 0
	// After 0 means taking the 0 index + the nth number
	for _, v := range []int{1000, 2000, 3000} {
		afterZero := zeroIndex + v
		afterZeroMod := afterZero % len(indexList)
		//index := sliceutil.GetIndexOfInt(afterZeroMod, indexList)
		value := numberList[afterZeroMod]
		fmt.Printf("Index: %d Value: %d \n", afterZeroMod, value)
		sum += value
	}
	// 4, -3, 2 = 3
	return sum
}

func mix(numberList []int, times int) ([]int, []int) {
	indexSlice := sliceutil.BloatSlice(0, len(numberList)-1)
	for i := 0; i < len(numberList); i++ {
		index := sliceutil.GetIndexOfInt(i, indexSlice)
		from := index
		to := index + numberList[index]
		valueToMove := numberList[index]
		if valueToMove < 0 {
			to -= 1 // idk why
		}

		numberList = moveInt(numberList, from, to)
		indexSlice = moveInt(indexSlice, from, to)
	}
	fmt.Println(numberList)
	fmt.Println(indexSlice)
	return numberList, indexSlice
}

func SolvePartTwo(input []string) int {
	return 0
}

func moveInt(array []int, srcIndex int, dstIndex int) []int {
	srcIndex = srcIndex % len(array)
	dstIndex = dstIndex % len(array) //TODO
	if srcIndex >= len(array) {
		srcIndex = srcIndex % len(array)
	}
	if dstIndex >= len(array) {
		dstIndex = dstIndex%len(array) + 1
	}
	if dstIndex < 0 {
		dstIndex = dstIndex + len(array)
	}
	value := array[srcIndex]
	return sliceutil.InsertInt(sliceutil.Remove(array, srcIndex), value, dstIndex)
}

//srcI =  1
//dstI = -2
