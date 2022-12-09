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
	fmt.Printf("Day 0 Part 02: Highest Scenic View Score: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 09 Part 02: finished in: %s \n", elapsed)
}

var visitedFields = map[Point]int{}

func SolvePartOne(input []string) int {

	instructions := parseInstructions(input)
	head := Point{0, 0}
	tail := Point{0, 0}
	visitedFields[Point{0, 0}] = 1
	for _, instruction := range instructions {
		head, tail = moveRope(instruction, head, tail)
	}
	return len(visitedFields)
}

func moveTail(instruction Instruction, head, tail Point) Point {
	switch instruction.direction {
	case "R":
		tail.x = head.x - 1
		tail.y = head.y
	case "L":
		tail.x = head.x + 1
		tail.y = head.y
	case "U":
		tail.x = head.x
		tail.y = head.y - 1
	case "D":
		tail.x = head.x
		tail.y = head.y + 1
	default:
		panic("Direction not recognized")
	}

	if value, ok := visitedFields[tail]; ok {
		visitedFields[tail] = value + 1
	} else {
		visitedFields[tail] = 1
	}

	return tail
}

func calcPointDistance(head, tail Point) float64 {
	return math.Round(math.Sqrt(math.Pow((tail.x-head.x), 2) + math.Pow((tail.y-head.y), 2)))
}

func SolvePartTwo(input []string) int {
	return 0
}

func moveRope(instruction Instruction, head Point, tail Point) (Point, Point) {
	switch instruction.direction {
	case "R":
		for i := 0; i < int(instruction.length); i++ {
			head.x += 1
			tail = moveTailIfNeeded(instruction, head, tail)
		}
	case "L":
		for i := 0; i < int(instruction.length); i++ {
			head.x -= 1
			tail = moveTailIfNeeded(instruction, head, tail)
		}
	case "U":
		for i := 0; i < int(instruction.length); i++ {
			head.y += 1
			tail = moveTailIfNeeded(instruction, head, tail)
		}
	case "D":
		for i := 0; i < int(instruction.length); i++ {
			head.y -= 1
			tail = moveTailIfNeeded(instruction, head, tail)
		}
	default:
		panic("Direction not recognized")
	}
	return head, tail
}

func moveTailIfNeeded(instruction Instruction, head, tail Point) Point {
	distanceHeadTail := calcPointDistance(head, tail)
	if distanceHeadTail > 1 {
		tail = moveTail(instruction, head, tail)
	}
	return tail
}

func parseInstructions(input []string) []Instruction {
	var instructions = make([]Instruction, 0)
	for _, line := range input {
		split := strings.Split(line, " ")
		instructions = append(instructions, Instruction{split[0], stringutil.ParseFloat64(split[1])})
	}
	return instructions
}
