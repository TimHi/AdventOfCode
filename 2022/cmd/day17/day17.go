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
	rocks := buildRocks()
	c := 0
	for i := 0; i < 2022; i++ {
		rockToDrop := rocks[i%len(rocks)]
		c = dropRock(cloneRock(rockToDrop), input, c)
		//printCave()
	}
	return getHighestPos()
}

func SolvePartTwo(input []string) int {

	rocks := buildRocks()
	c := 0
	intervalHeight := 10600
	max := 1000000000000
	interval := 7000
	for i := 0; i <= interval; i++ {
		rockToDrop := rocks[i%len(rocks)]
		c = dropRock(rockToDrop, input, c)
	}

	skipped := max / interval
	todo := skipped * interval

	for i := todo; i < max; i++ {
		rockToDrop := rocks[i%len(rocks)]
		c = dropRock(rockToDrop, input, c)
	}

	return 1514285714288 - getHighestPos() + skipped*intervalHeight
}

//1514285714288
//1514285708262

var Cave map[Point]rune = map[Point]rune{}

type Point struct {
	x int
	y int
}

func dropRock(rock Rock, jetStreams []string, c int) int {
	isFalling := true
	rock = offsetToSpawn(rock)
	//fmt.Printf("A new Rock drops, c: %d \n", c)
	for isFalling {
		if c >= len(jetStreams[0]) {
			c = 0
		}
		stream := rune(jetStreams[0][c])
		if canPushRock(stream, rock) {
			moveRock(stream, rock)
		}
		if canRockFall(rock) {
			moveRock('v', rock)
		} else {
			isFalling = false
		}
		c++
	}
	return c
}

func offsetToSpawn(rock Rock) Rock {
	y := getHighestPos()
	y = y + 3 + rock.height
	for i := 0; i < len(rock.Shape); i++ {
		rock.Shape[i].x += 2
		rock.Shape[i].y += y
	}
	return rock
}

func getHighestPos() int {
	y := 0
	if len(Cave) == 0 {
		return y
	}
	for key := range Cave {
		if key.y > y {
			y = key.y
		}
	}
	return y + 1
}

func cloneRock(rock Rock) Rock {
	clone := Rock{}
	clone.height = rock.height
	clone.lowest = rock.lowest
	clone.Shape = append(clone.Shape, rock.Shape...)
	return clone
}

func canRockFall(rock Rock) bool {
	for _, v := range rock.Shape {
		_, ok := Cave[Point{v.x, v.y - 1}]
		if ok {
			for _, v := range rock.Shape {
				Cave[v] = '#' //fall check is one line deeper so jump back up
			}
			return false
		}
		if v.y == 0 {
			for _, v := range rock.Shape {
				Cave[v] = '#'
			}
			return false
		}
	}
	return true
}

func moveRock(stream rune, rock Rock) {
	if stream == '>' {
		//fmt.Printf("Jet of gas pushes rock right \n")
	}
	if stream == '<' {
		//fmt.Printf("Jet of gas pushes rock left \n")
	}
	if stream == 'v' {
		//fmt.Printf("Rock falls 1 unit \n")
	}
	for i := 0; i < len(rock.Shape); i++ {
		if stream == '>' {
			rock.Shape[i].x += 1
		}
		if stream == '<' {
			rock.Shape[i].x -= 1
		}
		if stream == 'v' {
			rock.Shape[i].y -= 1
		}
	}
}

func canPushRock(stream rune, rock Rock) bool {
	for i := 0; i < len(rock.Shape); i++ {
		coord := rock.Shape[i]
		if stream == '>' {
			if rock.Shape[i].x+1 > 6 {
				//fmt.Printf("Stream %c pushes rock right but nothing happens \n", stream)
				return false
			}
			_, ok := Cave[Point{coord.x + 1, coord.y}]
			if ok {
				//fmt.Printf("Stream %c pushes rock right but nothing happens (Rock hits other rock) \n", stream)
				return false
			}
		}
		if stream == '<' {
			if rock.Shape[i].x-1 < 0 {
				//fmt.Printf("Stream %c pushes rock left but nothing happens \n", stream)
				return false
			}
			_, ok := Cave[Point{coord.x - 1, coord.y}]
			if ok {
				//fmt.Printf("Stream %c pushes rock left but nothing happens (Rock hits other rock) \n", stream)
				return false
			}
		}
	}
	return true
}

type Rock struct {
	Shape  []Point //Shape is formed from the spawnpos (index 0)
	lowest int
	height int //height offset if shaps most left pos is not on the lowest line
}

func buildRocks() []Rock {
	rocks := []Rock{}

	//####
	rocks = append(rocks, Rock{Shape: []Point{{0, 0}, {1, 0}, {2, 0}, {3, 0}}, lowest: 0, height: 0})
	// .#.
	// ###
	// .#.
	rocks = append(rocks, Rock{Shape: []Point{{0, 0}, {1, 0}, {2, 0}, {1, 1}, {1, -1}}, lowest: -1, height: 1})
	// ..#
	// ..#
	// ###
	rocks = append(rocks, Rock{Shape: []Point{{0, 0}, {1, 0}, {2, 0}, {2, 1}, {2, 2}}, lowest: 0, height: 0})
	// #
	// #
	// #
	// #
	rocks = append(rocks, Rock{Shape: []Point{{0, 0}, {0, 1}, {0, 2}, {0, 3}}, lowest: 0, height: 0})
	// ##
	// ##
	rocks = append(rocks, Rock{Shape: []Point{{0, 0}, {1, 0}, {0, 1}, {1, 1}}, lowest: 0, height: 0})
	return rocks
}
func printCave() {

	fmt.Println("-----------")
	for column := getHighestPos(); column >= 0; column-- {
		for row := 0; row < 7; row++ {
			char, ok := Cave[Point{row, column}]
			if ok {
				fmt.Printf("%c", char)
			} else {
				fmt.Printf(".")
			}
		}
		fmt.Printf("\n")
	}
	fmt.Println("-----------")
}
