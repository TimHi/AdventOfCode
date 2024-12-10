package day15

import (
	"fmt"
	"strings"
	"time"

	"github.com/JamesLMilner/pip-go"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/distance"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/numbers"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 15 Part 01: Covered area from beacons %d \n", SolvePartOne(input, useSampleFlag))
	elapsed := time.Since(start)
	fmt.Printf("Day 15 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 15 Part 02: Beacon frequency: %d \n", SolvePartTwo(input, useSampleFlag))
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

var Cave map[Point]int = map[Point]int{}

const SENSOR = 1
const BEACON = 2
const COVERED = 0

func SolvePartOne(input []string, isSample bool) int {
	sensors := parseSensors(input)

	coveredArea := 0
	if isSample {
		coveredArea = getCoveredInRow(sensors, 10)
	} else {
		coveredArea = getCoveredInRow(sensors, 2000000)
	}

	return coveredArea
}

func SolvePartTwo(input []string, isSample bool) int64 {
	sensors := parseSensors(input)
	max := 20
	if !isSample {
		max = 4000000
	}
	for y := 0; y <= max; y++ {
		x := 0
		for x < max {
			found := true
			point := Point{x, y}
			for _, sensor := range sensors {
				sensorPointDistance := distance.GetManhattanDistance(sensor.location.X, sensor.location.Y, point.X, point.Y)
				if sensorPointDistance <= sensor.distanceToBeacon { //Sensor covers the current Point
					shiftBack := numbers.Abs(sensor.location.Y-point.Y) - 1       //Without this (X,Y) Would be too far out
					x = (sensor.location.X + sensor.distanceToBeacon) - shiftBack //Since x is covered by the sensor, add the covered area and take the shift back into account
					found = false
				}
			}
			if found {
				return getTuningFrequency(point)
			}
		}
	}
	return -1
}

func getTuningFrequency(point Point) int64 {
	var xTune int64 = int64(point.X) * 4000000
	return xTune + int64(point.Y)
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
	leftBound := getLeftMostSensor(sensors)
	rightBound := getRightMostSensor(sensors)
	covered := 0
	for x := leftBound.location.X - leftBound.distanceToBeacon - 5; x <= rightBound.location.X+rightBound.distanceToBeacon+6; x++ {
		isCovered := false
		point := Point{x, y}
		_, ok := Cave[point]
		if !ok {
			isCovered = isPointInRhombus(point, sensors)
		}
		if isCovered {
			covered++
		}
	}
	return covered - 1 // For some reason the lib has an one off error...
}

func isPointInRhombus(point Point, sensors []Sensor) bool {
	isCovered := false
	for _, sensor := range sensors {
		isCovered = isPointInPolygon(sensor, point)
		if isCovered {
			return true //Early out, since one coverage is enough
		}
	}
	return isCovered
}

func isPointInPolygon(sensor Sensor, point Point) bool {
	rectangle := pip.Polygon{
		Points: []pip.Point{
			{X: float64(sensor.location.X-1) - float64(sensor.distanceToBeacon), Y: float64(sensor.location.Y)}, //Left
			{X: float64(sensor.location.X), Y: float64(sensor.location.Y+1) + float64(sensor.distanceToBeacon)}, //Down
			{X: float64(sensor.location.X+1) + float64(sensor.distanceToBeacon), Y: float64(sensor.location.Y)}, //Right
			{X: float64(sensor.location.X), Y: float64(sensor.location.Y-1) - float64(sensor.distanceToBeacon)}, //Up
			{X: float64(sensor.location.X-1) - float64(sensor.distanceToBeacon), Y: float64(sensor.location.Y)}, //Left, Readme states startpoint is not needed but it returns a way to high number without
		},
	}
	pt1 := pip.Point{X: float64(point.X), Y: float64(point.Y)}
	return pip.PointInPolygon(pt1, rectangle)
}

func parseSensors(sensors []string) []Sensor {
	parsedSensors := []Sensor{}
	for _, s := range sensors {
		parsedSensors = append(parsedSensors, parseSensor(s))
	}
	return parsedSensors
}

// 4.000.000
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
