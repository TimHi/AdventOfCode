package day09

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

type Instruction struct {
	direction string
	length    float64
}

type Point struct {
	x float64
	y float64
}

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 09 Part 01: Fields visited by the Tail at least once: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 09 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 0 Part 02: Fields visited by the Tail at least once: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 09 Part 02: finished in: %s \n", elapsed)
}

var visitedFields = map[Point]int{}

func SolvePartOne(input []string) int {
	nodes := 2
	instructions := parseInstructions(input)

	visitedFields[Point{0, 0}] = 1
	ropePoints := setUpRope(nodes)
	for _, instruction := range instructions {
		fmt.Printf("Move %s %f\n", instruction.direction, instruction.length)
		moveRope(instruction, ropePoints)
	}
	return len(visitedFields)
}

func SolvePartTwo(input []string) int {
	nodes := 9
	instructions := parseInstructions(input)
	visitedFields = nil             //Reset map
	visitedFields = map[Point]int{} //Reset map
	fmt.Println(visitedFields)
	visitedFields[Point{0, 0}] = 1
	ropePoints := setUpRope(nodes)
	fmt.Println(ropePoints)
	for _, instruction := range instructions {
		fmt.Printf("Move %s %f\n", instruction.direction, instruction.length)
		moveRope(instruction, ropePoints)
	}
	return len(visitedFields)
}

func moveRope(instruction Instruction, ropePoints []Point) {
	for i := 0; i < int(instruction.length); i++ {
		ropePoints[0] = movePoint(instruction.direction, ropePoints[0])
		for p := 1; p < len(ropePoints); p++ { //Check tail points
			distance := calcPointDistance(ropePoints[p-1], ropePoints[p])
			if distance > 1 {
				ropePoints[p] = moveTail(instruction.direction, ropePoints[p-1], ropePoints[p])
				if p == len(ropePoints)-1 {
					if value, ok := visitedFields[ropePoints[p]]; ok {
						visitedFields[ropePoints[p]] = value + 1
					} else {
						visitedFields[ropePoints[p]] = 1
					}
				}
			}
		}
		fmt.Println(ropePoints)

	}
}

func moveTail(direction string, head, tail Point) Point {
	switch direction {
	case "R":
		tail.x = tail.x + 1
		if tail.x != head.x {
			tail.y = head.y
		} else {
			tail.y = head.y - 1
		}
	case "L":
		tail.x = tail.x - 1
		if tail.x != head.x {
			tail.y = head.y
		} else {
			tail.y = head.y + 1
		}
	case "U":
		tail.y = tail.y + 1
		if tail.y != head.y {
			tail.x = head.x
		} else {
			tail.x = head.x - 1
		}
	case "D":
		tail.y = tail.y - 1
		if tail.y != head.y {
			tail.x = head.x
		} else {
			tail.x = head.x + 1
		}
	default:
		panic("Direction not recognized")
	}

	return tail
}

func movePoint(direction string, point Point) Point {
	switch direction {
	case "R":
		point.x = point.x + 1
	case "L":
		point.x = point.x - 1
	case "U":
		point.y = point.y + 1
	case "D":
		point.y = point.y - 1
	default:
		panic("Direction not recognized")
	}
	return point
}

func setUpRope(nodes int) []Point {
	ropePoints := []Point{}
	for i := 0; i < nodes; i++ {
		ropePoints = append(ropePoints, Point{0, 0})
	}
	return ropePoints
}

func calcPointDistance(head, tail Point) float64 {
	return math.Round(math.Sqrt(math.Pow((tail.x-head.x), 2) + math.Pow((tail.y-head.y), 2)))
}

func parseInstructions(input []string) []Instruction {
	var instructions = make([]Instruction, 0)
	for _, line := range input {
		split := strings.Split(line, " ")
		instructions = append(instructions, Instruction{split[0], stringutil.ParseFloat64(split[1])})
	}
	return instructions
}
