package day14

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/numbers"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 14 Part 01: Sand dropped until abyss: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 14 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 14 Part 02: Sand dropped until {500:0}: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 14 Part 02: finished in: %s \n", elapsed)
}

type Point struct {
	X int
	Y int
}

type Wall struct {
	Start Point
	End   Point
}

var WorldMap map[Point]string

func SolvePartOne(input []string) int {
	WorldMap = map[Point]string{}
	walls := parseWalls(input)
	buildWalls(walls)
	isFalling := false
	droppedSand := 0
	for !isFalling {
		isFalling = dropSandIntoAbyss(Point{500, 0})
		if isFalling {
			break
		}
		droppedSand++
	}

	return droppedSand
}

func SolvePartTwo(input []string) int {
	WorldMap = map[Point]string{}
	walls := parseWalls(input)
	buildWalls(walls)
	isFalling := false
	droppedSand := 0
	for !isFalling {
		droppedSand++
		isFalling = dropSandIntoCave(Point{500, 0})
		if isFalling {
			break
		}
		_, ok := WorldMap[Point{500, 0}]
		if ok {
			break
		}
	}
	return droppedSand
}

func dropSandIntoCave(point Point) bool {
	if canMoveP2(Point{point.X, point.Y + 1}) { //Check down
		//fmt.Printf("Continue dropping down from %d,%d\n", point.X, point.Y)
		return dropSandIntoCave(Point{point.X, point.Y + 1}) // Recursivly drop the sand one field down
	} else { //Can't move down, check diagonal down left
		if canMoveP2(Point{point.X - 1, point.Y + 1}) { // Check if can move left
			//fmt.Printf("Continue dropping diag left from %d,%d\n", point.X, point.Y)
			return dropSandIntoCave(Point{point.X - 1, point.Y + 1})
		} else if canMoveP2(Point{point.X + 1, point.Y + 1}) { //Can't move left, check diagonal down right directly
			//fmt.Printf("Continue dropping diag right from %d,%d\n", point.X, point.Y)
			return dropSandIntoCave(Point{point.X + 1, point.Y + 1})
		} else {
			//fmt.Printf("Finished dropping down sand unit marking %d,%d as o\n", point.X, point.Y)
			WorldMap[point] = "o"
			if point.X == 500 && point.Y == 0 {
				return true
			}
		}
	}
	return false // First corn finished dropping
}

// Part 1: No floor, sand just falls eternally
func dropSandIntoAbyss(point Point) bool {
	//fmt.Printf("Dropping at %d,%d\n", point.X, point.Y)
	if fallingIntoAbyss(Point{point.X, point.Y + 1}) {
		return true
	}

	if canMove(Point{point.X, point.Y + 1}) { //Check down
		//fmt.Printf("Continue dropping down from %d,%d\n", point.X, point.Y)
		return dropSandIntoAbyss(Point{point.X, point.Y + 1}) // Recursivly drop the sand one field down
	} else { //Can't move down, check diagonal down left
		if canMove(Point{point.X - 1, point.Y + 1}) { // Check if can move left
			//fmt.Printf("Continue dropping diag left from %d,%d\n", point.X, point.Y)
			return dropSandIntoAbyss(Point{point.X - 1, point.Y + 1})
		} else if canMove(Point{point.X + 1, point.Y + 1}) { //Can't move left, check diagonal down right directly
			//fmt.Printf("Continue dropping diag right from %d,%d\n", point.X, point.Y)
			return dropSandIntoAbyss(Point{point.X + 1, point.Y + 1})
		} else {
			//fmt.Printf("Finished dropping down sand unit marking %d,%d as o\n", point.X, point.Y)
			WorldMap[point] = "o"
		}
	}
	return false // First corn finished dropping
}

func fallingIntoAbyss(point Point) bool {
	lowest := getLowestWall()
	//fmt.Printf("Lowest: %d,%d \n", lowest.X, lowest.Y)
	return point.Y > lowest.Y
}

func isFloor(point Point) bool {
	lowest := getLowestWall()
	//fmt.Printf("Lowest: %d,%d \n", lowest.X, lowest.Y)
	return point.Y == lowest.Y+2 //Cave has a floor two
}

func canMove(point Point) bool {
	_, ok := WorldMap[point]
	return !ok //Flip ok because ok is true if there is a value, this means there is a wall or a sand
}

func canMoveP2(point Point) bool {

	_, ok := WorldMap[point]
	ok = !ok //Flip ok because ok is true if there is a value, this means there is a wall or a sand
	if isFloor(point) {
		return false
	}
	return ok
}

func parsePoint(rawCoord string) Point {
	split := strings.Split(rawCoord, ",")
	point := Point{stringutil.ParseNumber(split[0]), stringutil.ParseNumber(split[1])}
	return point
}

func parseWalls(bluePrints []string) []Wall {
	walls := []Wall{}
	for _, row := range bluePrints {
		wallCoords := strings.Split(row, " -> ")
		wall := Wall{}
		for i := 0; i < len(wallCoords)-1; i++ {
			startPoint := parsePoint(wallCoords[i])
			endPoint := parsePoint(wallCoords[i+1])
			wall.Start = startPoint
			wall.End = endPoint
			walls = append(walls, wall)
		}
	}
	return walls
}

// Expand the Walls from their Start point to their endpoint in the
// World map
func buildWalls(walls []Wall) {
	for _, wall := range walls {
		if wall.Start.X < wall.End.X {
			for i := wall.Start.X; i <= wall.End.X; i++ {
				WorldMap[Point{i, wall.Start.Y}] = "#"
			}
		}
		if wall.Start.X > wall.End.X {
			for i := wall.End.X; i <= wall.Start.X; i++ {
				WorldMap[Point{i, wall.Start.Y}] = "#"
			}
		}
		if wall.Start.Y < wall.End.Y {
			for i := wall.Start.Y; i <= wall.End.Y; i++ {
				WorldMap[Point{wall.Start.X, i}] = "#"
			}
		}
		if wall.Start.Y > wall.End.Y {
			for i := wall.End.Y; i <= wall.Start.Y; i++ {
				WorldMap[Point{wall.Start.X, i}] = "#"
			}
		}
	}
}

func getLowestWall() Point {
	lowestPoint := Point{0, 0}
	for point, value := range WorldMap {
		if point.Y > lowestPoint.Y && value == "#" {
			lowestPoint = point
		}
	}
	return lowestPoint
}

func getLowestX() Point {
	lowestPoint := Point{numbers.MaxInt(), 0}
	for point := range WorldMap {
		if point.X < lowestPoint.X {
			lowestPoint = point
		}
	}
	return lowestPoint
}

func printWorld() {
	x := getLowestX().X
	fmt.Println("-----------")
	for column := 0; column <= 175; column++ {
		for row := 0; row <= 400; row++ {
			char, ok := WorldMap[Point{x + row, column}]
			if ok {
				fmt.Printf("%s", char)
			} else {
				fmt.Printf(".")
			}
		}
		fmt.Printf("\n")
	}
	fmt.Println("-----------")
}
