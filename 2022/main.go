package main

import (
	"flag"
	"log"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day01"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day02"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day03"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day04"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day05"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day06"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day07"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day08"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day09"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day10"
)

var dayFlag int
var useSampleFlag bool

func init() {
	flag.IntVar(&dayFlag, "day", -1, "Specify the day you want to solve")
	flag.BoolVar(&useSampleFlag, "sample", true, "Specify wether you want to use sample [true] or the full [false] input")
}

func main() {
	flag.Parse()
	start := time.Now()
	switch dayFlag {
	case 1:
		day01.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 01 took: %s", time.Since(start))
	case 2:
		day02.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 02 took: %s", time.Since(start))
	case 3:
		day03.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 03 took: %s", time.Since(start))
	case 4:
		day04.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 04 took: %s", time.Since(start))
	case 5:
		day05.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 05 took: %s", time.Since(start))
	case 6:
		day06.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 06 took: %s", time.Since(start))
	case 7:
		day07.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 07 took: %s", time.Since(start))
	case 8:
		day08.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 08 took: %s", time.Since(start))
	case 9:
		day09.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 09 took: %s", time.Since(start))
	case 10:
		day10.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 10 took: %s", time.Since(start))
	default:
		log.Fatalf("Day %d not found.", dayFlag)
	}
}
