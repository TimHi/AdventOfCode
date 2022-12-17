package day17

import (
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 17 Part 01: Height after 2022 rocks %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 15 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 15 Part 02: Beacon frequency: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 15 Part 02: finished in: %s \n", elapsed)
}

/*
The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from
 the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
*/

func SolvePartOne(input []string) int {
	rockShape := 0
	for i := 0; i < 2022; i++ { // 2022 given by puzzle as
		dropRock(Rocks[rockShape%5], input)
		rockShape++
	}
	//Get Height
	return 0
}

var Cave map[Point]rune = map[Point]rune{}

type Point struct {
	x int
	y int
}

func dropRock(rock string, jetStreams []string) {
	isFalling := true
	jetCounter := 0
	rockPosition := Point{0, 0} //Hardcode startposition of Rock shapes, maybe create struct with the info
	for isFalling {
		for _, stream := range jetStreams {
			if !isHittingWall(stream, rockPosition) {
				rockPosition = moveRock(stream, rockPosition)
			}
		}

		jetCounter++
	}

}

func moveRock(stream string, rockPosition Point) Point {
	panic("unimplemented")
}

func isHittingWall(stream string, rockPosition Point) bool {
	return false
}

func SolvePartTwo(input []string) int {

	return 0
}

var Rocks = []string{
	`####`,
	`.#.
###
.#.`,
	`..#
..#
###`,
	`#
#
#
#`,
	`##
##`,
}
