package day18

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 18 Part 01: Covered sides: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 18 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 18 Part 02: Beacon frequency: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 18 Part 02: finished in: %s \n", elapsed)
}

type Point3D struct {
	X int
	Y int
	Z int
}

func SolvePartOne(input []string) int {
	coords := parseCoords(input)
	covered := 0
	for _, cube := range coords {
		covered += coveredSides(cube, coords)
	}
	return possibleSides(coords) - covered
}

func SolvePartTwo(input []string) int {
	return 0
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

func parseCoords(input []string) []Point3D {
	coords := []Point3D{}
	for _, coord := range input {
		split := strings.Split(coord, ",")
		coords = append(coords, Point3D{stringutil.ParseNumber(split[0]), stringutil.ParseNumber(split[1]), stringutil.ParseNumber(split[2])})
	}
	return coords
}
