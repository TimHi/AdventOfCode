package day08

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 08 Part 01: Visible Trees: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 08 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 08 Part 02: Highest Scenic View Score: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 08 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	visibleTrees := 0
	for row, line := range input {
		if row != 0 && len(input)-1 != row {
			for column := 1; column < len(line)-1; column++ {
				value := stringutil.ParseNumber(string(line[column]))
				if isTreeVisible(row, column, value, &input) {
					visibleTrees++
				}
			}
		}
	}
	visibleTrees += addEdges(&input)
	return visibleTrees
}

func addEdges(input *[]string) int {
	column := len((*input))
	row := len((*input)[0])
	edges := 2*(column+row) - 4
	return edges
}

func SolvePartTwo(input []string) int {
	highestScenicView := 0
	for row, line := range input {
		for column := 0; column < len(line); column++ {
			value := stringutil.ParseNumber(string(line[column]))
			scenicViewScore := getScenicViewscore(row, column, value, &input)
			if scenicViewScore > highestScenicView {
				highestScenicView = scenicViewScore
			}
		}
	}
	return highestScenicView
}

func getScenicViewscore(row, column, value int, input *[]string) int {
	edge := len((*input)[0])
	bottom := len(*input)
	rightScore := getRightScore(row, column, edge, bottom, value, input)

	leftScore := getLeftScore(row, column, edge, bottom, value, input)

	upScore := getUpScore(row, column, edge, bottom, value, input)

	downScore := getDownScore(row, column, edge, bottom, value, input)

	return rightScore * leftScore * upScore * downScore
}

func getRightScore(row, column, edge, bottom, value int, input *[]string) int {
	score := 0
	for cColumn := column; cColumn < edge; cColumn++ {
		if cColumn+1 < edge {
			treeHeight := getCoordinate(row, cColumn+1, input)
			if treeHeight >= value {
				score++
				break
			}
			if treeHeight < value {
				score++
			}
		}
	}
	return score
}

func getLeftScore(row, column, edge, bottom, value int, input *[]string) int {
	score := 0
	for cColumn := column; cColumn >= 0; cColumn-- {
		if cColumn-1 >= 0 {
			treeHeight := getCoordinate(row, cColumn-1, input)
			if treeHeight >= value {
				score++
				break
			}
			if treeHeight < value {
				score++
			}
		}
	}
	return score
}

func getUpScore(row, column, edge, bottom, value int, input *[]string) int {
	score := 0
	for rRow := row; rRow >= 0; rRow-- {
		if rRow-1 >= 0 {
			treeHeight := getCoordinate(rRow-1, column, input)
			if treeHeight >= value {
				score++
				break
			}
			if treeHeight < value {
				score++
			}
		}
	}
	return score
}

func getDownScore(row, column, edge, bottom, value int, input *[]string) int {
	score := 0
	for rRow := row; rRow < bottom; rRow++ {
		if rRow+1 < bottom {
			treeHeight := getCoordinate(rRow+1, column, input)
			if treeHeight >= value {
				score++
				break
			}
			if treeHeight < value {
				score++
			}
		}
	}
	return score
}

func isTreeVisible(row int, column int, value int, input *[]string) bool {
	edge := len((*input)[0])
	bottom := len(*input)
	isVisible := false
	isVisible = visibleRight(row, column, edge, bottom, value, input)
	if isVisible {
		return isVisible
	}
	isVisible = visibleLeft(row, column, edge, bottom, value, input)
	if isVisible {
		return isVisible
	}
	isVisible = visibleUp(row, column, edge, bottom, value, input)
	if isVisible {
		return isVisible
	}
	isVisible = visibleDown(row, column, edge, bottom, value, input)
	if isVisible {
		return isVisible
	}
	return false
}

func visibleRight(row int, column int, edge int, bottom int, value int, input *[]string) bool {
	isVisible := false
	for cColumn := column; cColumn < edge; cColumn++ {
		if cColumn+1 < edge {
			treeHeight := getCoordinate(row, cColumn+1, input)
			if treeHeight >= value {
				isVisible = false
				break
			}
			if treeHeight < value {
				isVisible = true
			}
		}
	}
	return isVisible
}

func visibleLeft(row int, column int, edge int, bottom int, value int, input *[]string) bool {
	isVisible := false
	for cColumn := column; cColumn >= 0; cColumn-- {
		if cColumn-1 >= 0 {
			treeHeight := getCoordinate(row, cColumn-1, input)
			if treeHeight >= value {
				isVisible = false
				break
			}
			if treeHeight < value {
				isVisible = true
			}
		}
	}
	return isVisible
}

func visibleUp(row int, column int, edge int, bottom int, value int, input *[]string) bool {
	isVisible := false
	for rRow := row; rRow >= 0; rRow-- {
		if rRow-1 >= 0 {
			treeHeight := getCoordinate(rRow-1, column, input)
			if treeHeight >= value {
				isVisible = false
				break
			}
			if treeHeight < value {
				isVisible = true
			}
		}
	}
	return isVisible
}

func visibleDown(row int, column int, edge int, bottom int, value int, input *[]string) bool {
	isVisible := false
	for rRow := row; rRow < bottom; rRow++ {
		if rRow+1 < bottom {
			treeHeight := getCoordinate(rRow+1, column, input)
			if treeHeight >= value {
				isVisible = false
				break
			}
			if treeHeight < value {
				isVisible = true
			}
		}
	}
	return isVisible
}

func getCoordinate(row int, column int, input *[]string) int {
	return stringutil.ParseNumber(string(strings.Split((*input)[row], "")[column]))
}
