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

	for _, v := range numberList {
		if isDuplicate(numberList, v) {
			fmt.Println(v)
			panic("Yea this doesnt work")
		}
	}

	mcHammerSlice := sliceutil.CopySlice(numberList)
	numberList = mix(mcHammerSlice, numberList, len(mcHammerSlice))
	fmt.Println(numberList)
	return 0
}

func isDuplicate(s []int, num int) bool {
	count := 0
	for _, i := range s {
		if i == num {
			count += 1
		}
	}
	return count > 1
}

func mix(mcHammerSlice, numberList []int, times int) []int {
	anotherTempSlice := sliceutil.BloatSlice(0, len(mcHammerSlice))
	fmt.Println(mcHammerSlice)
	fmt.Println(anotherTempSlice)
	for i := 0; i < times; i++ {
		fmt.Printf("Moving %d \n", mcHammerSlice[i])
		numberList = moveInt(numberList, i, mcHammerSlice[i]+anotherTempSlice)
		fmt.Println(numberList)
	}
	return numberList
}

func SolvePartTwo(input []string) int {
	return 0
}

func insertInt(array []int, value int, index int) []int {
	return append(array[:index], append([]int{value}, array[index:]...)...)
}

func removeInt(array []int, index int) []int {
	return append(array[:index], array[index+1:]...)
}

func moveInt(array []int, srcIndex int, dstIndex int) []int {
	if srcIndex == len(array) {
		srcIndex = srcIndex % len(array)
	}
	if dstIndex == len(array) {
		dstIndex = dstIndex % len(array)
	}
	value := array[srcIndex]
	return insertInt(removeInt(array, srcIndex), value, dstIndex)
}
