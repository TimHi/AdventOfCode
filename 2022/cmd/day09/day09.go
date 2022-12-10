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
	nodes := 10
	instructions := parseInstructions(input)
	visitedFields = nil             //Reset map
	visitedFields = map[Point]int{} //Reset map
	fmt.Println(visitedFields)
	visitedFields[Point{0, 0}] = 1
	ropePoints := setUpRope(nodes)
	fmt.Println(ropePoints)
	for _, instruction := range instructions {
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
				ropePoints[p] = moveTail(instruction.direction, ropePoints[p-1], ropePoints[p], distance)
			}
		}
		p := len(ropePoints) - 1
		if _, ok := visitedFields[ropePoints[p]]; !ok {
			visitedFields[ropePoints[p]] = 1
		}
	}
}

func moveTail(direction string, head, tail Point, distance float64) Point {
	//Head 4:2 T 3:0
	rel_x := head.x - tail.x // 1
	rel_y := head.y - tail.y // 2

	if math.Abs(rel_x) == 2 {
		rel_x = math.Floor(rel_x / 2) // Dont move on top
	}
	if math.Abs(rel_y) == 2 {
		rel_y = math.Floor(rel_y / 2) // Dont move on top
	}

	tail.x = tail.x + rel_x
	tail.y = tail.y + rel_y
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

// Distance between two points in a 2D space
// https://de.serlo.org/mathe/1783/abstand-zweier-punkte-berechnen
func calcPointDistance(head, tail Point) float64 {
	c := math.Round(math.Sqrt(math.Pow((tail.x-head.x), 2) + math.Pow((tail.y-head.y), 2)))
	fmt.Println(c)
	return c
}

func parseInstructions(input []string) []Instruction {
	var instructions = make([]Instruction, 0)
	for _, line := range input {
		split := strings.Split(line, " ")
		instructions = append(instructions, Instruction{split[0], stringutil.ParseFloat64(split[1])})
	}
	return instructions
}
