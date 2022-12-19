package day18

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/numbers"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 18 Part 01: Covered sides: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 18 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 18 Part 02: Covered sides that are exposed: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 18 Part 02: finished in: %s \n", elapsed)
}

type Point3D struct {
	X int
	Y int
	Z int
}

var Cube = map[Point3D]string{}

func SolvePartTwo(input []string) int {
	coords := parseCoords(input)

	initCube(coords)
	xMin, xMax, yMin, yMax, zMin, zMax := getBounds(coords)
	floodFill(Point3D{xMin - 1, yMin - 1, zMin - 1}, xMin, xMax, yMin, yMax, zMin, zMax)

	return getExposedSides(coords)
}

func getExposedSides(coords []Point3D) int {
	c := 0
	for _, cube := range coords {
		v, ok := Cube[cube]
		if ok {
			if v == "x" || v == "o" {
				c += coveredSidesP2(cube)
			}
		}
	}
	return c
}

func coveredSidesP2(cube Point3D) int {
	coveredSides := 0

	v, ok := Cube[Point3D{cube.X + 1, cube.Y, cube.Z}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	v, ok = Cube[Point3D{cube.X - 1, cube.Y, cube.Z}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	v, ok = Cube[Point3D{cube.X, cube.Y + 1, cube.Z}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	v, ok = Cube[Point3D{cube.X, cube.Y - 1, cube.Z}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	v, ok = Cube[Point3D{cube.X, cube.Y, cube.Z + 1}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	v, ok = Cube[Point3D{cube.X, cube.Y, cube.Z - 1}]
	if ok {
		if v == "-" {
			coveredSides++
		}
	}
	return coveredSides
}

func initCube(coords []Point3D) {
	for _, c := range coords {
		Cube[c] = "o"
	}
}

func getBounds(cubes []Point3D) (int, int, int, int, int, int) {
	xMin, xMax, yMin, yMax, zMin, zMax := numbers.MaxInt(), -1, numbers.MaxInt(), -1, numbers.MaxInt(), -1
	for _, cube := range cubes {
		if cube.X < xMin {
			xMin = cube.X - 2
		}
		if cube.X > xMax {
			xMax = cube.X + 2
		}
		if cube.Y < yMin {
			yMin = cube.Y - 2
		}
		if cube.Y > yMax {
			yMax = cube.Y + 2
		}
		if cube.Z < zMin {
			zMin = cube.Z - 2
		}
		if cube.Z > zMax {
			zMax = cube.Z + 2
		}
	}
	return xMin, xMax, yMin, yMax, zMin, zMax
}

func floodFill(point Point3D, xMin, xMax, yMin, yMax, zMin, zMax int) {
	value, ok := Cube[point]
	if !ok {
		Cube[point] = "-"
		if point.Z <= zMax {
			floodFill(Point3D{point.X, point.Y, point.Z + 1}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
		if point.Z >= zMin {
			floodFill(Point3D{point.X, point.Y, point.Z - 1}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
		if point.Y <= yMax {
			floodFill(Point3D{point.X, point.Y + 1, point.Z}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
		if point.Y >= yMin {
			floodFill(Point3D{point.X, point.Y - 1, point.Z}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
		if point.X <= xMax {
			floodFill(Point3D{point.X + 1, point.Y, point.Z}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
		if point.X >= xMin {
			floodFill(Point3D{point.X - 1, point.Y, point.Z}, xMin, xMax, yMin, yMax, zMin, zMax)
		}
	} else {
		if value == "o" {
			Cube[point] = "x"
		}
	}
}

func parseCoords(input []string) []Point3D {
	coords := []Point3D{}
	for _, coord := range input {
		split := strings.Split(coord, ",")
		coords = append(coords, Point3D{stringutil.ParseNumber(split[0]), stringutil.ParseNumber(split[1]), stringutil.ParseNumber(split[2])})
	}
	return coords
}

func SolvePartOne(input []string) int {
	coords := parseCoords(input)
	covered := 0
	for _, cube := range coords {
		covered += coveredSides(cube, coords)
	}
	return possibleSides(coords) - covered
}

func possibleSides(cubes []Point3D) int {
	return len(cubes) * 6
}

func coveredSides(cube Point3D, cubes []Point3D) int {
	coveredSides := 0
	for _, otherCube := range cubes {
		if cube.X == otherCube.X && cube.Y == otherCube.Y && cube.Z == otherCube.Z {
			continue // skip the same
		}
		if cube.X == otherCube.X+1 && cube.Y == otherCube.Y && cube.Z == otherCube.Z {
			coveredSides += 1
		}
		if cube.X == otherCube.X-1 && cube.Y == otherCube.Y && cube.Z == otherCube.Z {
			coveredSides += 1
		}
		if cube.Y == otherCube.Y+1 && cube.X == otherCube.X && cube.Z == otherCube.Z {
			coveredSides += 1
		}
		if cube.Y == otherCube.Y-1 && cube.X == otherCube.X && cube.Z == otherCube.Z {
			coveredSides += 1
		}
		if cube.Z == otherCube.Z+1 && cube.Y == otherCube.Y && cube.X == otherCube.X {
			coveredSides += 1
		}
		if cube.Z == otherCube.Z-1 && cube.Y == otherCube.Y && cube.X == otherCube.X {
			coveredSides += 1
		}
	}
	return coveredSides
}
