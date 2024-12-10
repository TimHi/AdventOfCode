package day17

import (
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 17 Part 01: Height after 2022 rocks %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 17 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 17 Part 02: Height after a lot of rocks: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 17 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	rocks := buildRocks()
	c := 0
	for i := 0; i < 1; i++ {
		rockToDrop := rocks[i%len(rocks)]
		c = dropRock(cloneRock(rockToDrop), input, c, i)
		//printCave()
	}
	return getHighestPos()
}

func SolvePartTwo(input []string) int {
	Cave = map[Point]rune{}

	rocks := buildRocks()
	c := 0
	for i := 0; i < 9000; i++ {
		rockToDrop := rocks[i%len(rocks)]
		c = dropRock(rockToDrop, input, c, i)
	}

	return -1
}

var RockJetStream map[int]int = map[int]int{}

var Cave map[Point]rune = map[Point]rune{}

type Point struct {
	x int
	y int
}

func dropRock(rock Rock, jetStreams []string, c int, rockIndex int) int {
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
				return false
			}
			_, ok := Cave[Point{coord.x + 1, coord.y}]
			if ok {
				return false
			}
		}
		if stream == '<' {
			if rock.Shape[i].x-1 < 0 {
				return false
			}
			_, ok := Cave[Point{coord.x - 1, coord.y}]
			if ok {
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
