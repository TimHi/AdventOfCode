package day15

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/distance"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 15 Part 01: Covered area from beacons %d \n", SolvePartOne(input, useSampleFlag))
	elapsed := time.Since(start)
	fmt.Printf("Day 15 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 15 Part 02: TODO: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 15 Part 02: finished in: %s \n", elapsed)
}

type Point struct {
	X int
	Y int
}

type Sensor struct {
	location         Point
	beacon           Point
	distanceToBeacon int
}

func (s Sensor) getDistanceToBeacon() {

}

var Cave map[Point]int = map[Point]int{}

const SENSOR = 1
const BEACON = 2
const COVERED = 0

func SolvePartOne(input []string, isSample bool) int {
	sensors := parseSensors(input)

	for i, sensor := range sensors {
		fmt.Printf("Expanding Sensor %d of %d \n", i, len(sensors))
		coverScanArea(sensor)
	}

	coveredArea := 0
	if isSample {
		coveredArea = getCoveredInRow(sensors, 10)
	} else {
		coveredArea = getCoveredInRow(sensors, 2000000)
	}

	return coveredArea
}

func getLeftMostSensor(sensors []Sensor) Sensor {
	leftMostSensor := sensors[0]
	for _, s := range sensors {
		if s.location.X < leftMostSensor.location.X {
			leftMostSensor = s
		}
	}
	return leftMostSensor
}

func getRightMostSensor(sensors []Sensor) Sensor {
	rightMost := sensors[0]
	for _, s := range sensors {
		if s.location.X > rightMost.location.X {
			rightMost = s
		}
	}
	return rightMost
}

func getCoveredInRow(sensors []Sensor, y int) int {
	fmt.Println("Counting the covered area....")
	leftBound := getLeftMostSensor(sensors)
	rightBound := getRightMostSensor(sensors)
	covered := 0
	for x := leftBound.location.X - leftBound.distanceToBeacon; x <= rightBound.location.X+rightBound.distanceToBeacon; x++ {
		value, ok := Cave[Point{x, y}]
		if ok {
			if value == COVERED {
				covered++
			}
		}
	}
	return covered
}

func SolvePartTwo(input []string) int {
	return 0
}

func coverScanArea(sensor Sensor) {
	fmt.Println(sensor)
	fmt.Println("Cover right down")
	coverDownRight(sensor)
	fmt.Println("Cover right top")
	coverTopRight(sensor)
	fmt.Println("Cover top left")
	coverTopLeft(sensor)
	fmt.Println("Cover left down")
	coverDownLeft(sensor)

	//printCave()
}

// GOOOOD MORNING VIETNAM!
func coverDownRight(sensor Sensor) {
	tracker := 0
	for y := sensor.location.Y; y <= sensor.location.Y+sensor.distanceToBeacon; y++ {
		for x := sensor.location.X; x <= sensor.location.X+sensor.distanceToBeacon-tracker; x++ {
			_, ok := Cave[Point{x, y}]
			if !ok {
				Cave[Point{x, y}] = COVERED
			}
		}
		tracker++
	}
}

func coverTopRight(sensor Sensor) {
	tracker := 0
	for y := sensor.location.Y; y >= sensor.location.Y-sensor.distanceToBeacon; y-- {
		for x := sensor.location.X; x <= sensor.location.X+sensor.distanceToBeacon-tracker; x++ {
			_, ok := Cave[Point{x, y}]
			if !ok {
				Cave[Point{x, y}] = COVERED
			}
		}
		tracker++
	}
}

func coverTopLeft(sensor Sensor) {
	tracker := 0
	for y := sensor.location.Y; y >= sensor.location.Y-sensor.distanceToBeacon; y-- {
		for x := sensor.location.X; x >= sensor.location.X-sensor.distanceToBeacon+tracker; x-- {
			_, ok := Cave[Point{x, y}]
			if !ok {
				Cave[Point{x, y}] = COVERED
			}
		}
		tracker++
	}
}

func coverDownLeft(sensor Sensor) {
	tracker := 0
	for y := sensor.location.Y; y <= sensor.location.Y+sensor.distanceToBeacon; y++ {
		for x := sensor.location.X; x >= sensor.location.X-sensor.distanceToBeacon+tracker; x-- {
			_, ok := Cave[Point{x, y}]
			if !ok {
				Cave[Point{x, y}] = COVERED
			}
		}
		tracker++
	}
}

func parseSensors(sensors []string) []Sensor {
	parsedSensors := []Sensor{}
	for _, s := range sensors {
		parsedSensors = append(parsedSensors, parseSensor(s))
	}
	return parsedSensors
}

func parseSensor(s string) Sensor {
	//Sensor at x=2, y=0: closest beacon is at x=2, y=10
	split := strings.Split(s, ": ")
	sensorX, sensorY := getCoordinates(split[0])
	beaconX, beaconY := getCoordinates(split[1])

	sensorPoint := Point{sensorX, sensorY}
	beaconPoint := Point{beaconX, beaconY}
	Cave[sensorPoint] = SENSOR
	Cave[beaconPoint] = BEACON
	dist := distance.GetManhattanDistance(sensorPoint.X, sensorPoint.Y, beaconPoint.X, beaconPoint.Y)
	return Sensor{sensorPoint, beaconPoint, dist}
}

func getCoordinates(s string) (int, int) {
	x := strings.Split(s, "x=")[1]
	x = strings.Split(x, ",")[0]
	y := strings.Split(s, "y=")[1]
	return stringutil.ParseNumber(x), stringutil.ParseNumber(y)
}

func printCave() {
	fmt.Println("Cave looks like this:")
	for y := -2; y < 22; y++ {
		for x := -2; x < 26; x++ {
			char, ok := Cave[Point{x, y}]
			if ok {
				fmt.Printf("%d", char)
			} else {
				fmt.Printf(".")
			}
		}
		fmt.Printf("\n")
	}
}
