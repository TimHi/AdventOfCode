package day11

import (
	"2024/util"
	"fmt"
	"os"
	"path/filepath"
)

func blink(stones []uint64, step int, max int, cache map[uint64]int) int {
	return 0
}

func SolvePartTwo() int {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := filepath.Dir(ex)
	fmt.Println(exPath)
	rawData := util.GetInputDataFromFile("C:\\Users\\TimHi\\Documents\\GitHub\\AdventOfCode\\Go\\2024\\day11\\full.txt")
	fmt.Println(rawData)
	return 0
}
