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
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day11"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day12"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day13"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day14"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day15"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day16"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day17"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day18"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day19"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day20"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day21"
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
	case 11:
		day11.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 11 took: %s", time.Since(start))
	case 12:
		day12.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 12 took: %s", time.Since(start))
	case 13:
		day13.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 13 took: %s", time.Since(start))
	case 14:
		day14.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 14 took: %s", time.Since(start))
	case 15:
		day15.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 15 took: %s", time.Since(start))
	case 16:
		day16.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 16 took: %s", time.Since(start))
	case 17:
		day17.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 17 took: %s", time.Since(start))
	case 18:
		day18.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 18 took: %s", time.Since(start))
	case 19:
		day19.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 19 took: %s", time.Since(start))
	case 20:
		day20.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 20 took: %s", time.Since(start))
	case 21:
		day21.Solve(start, useSampleFlag, dayFlag)
		log.Printf("Day 21 took: %s", time.Since(start))
	default:
		log.Fatalf("Day %d not found.", dayFlag)
	}
}
