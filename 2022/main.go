package main

import (
	"log"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day01"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day02"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day03"
	"github.com/TimHi/AdventOfCode/m/v2/cmd/day04"
)

func main() {

	day := 4
	start := time.Now()
	switch day {
	case 1:
		day01.Solve(start)
		log.Printf("Day 01 took: %s", time.Since(start))
		break
	case 2:
		day02.Solve(start)
		log.Printf("Day 02 took: %s", time.Since(start))
		break
	case 3:
		day03.Solve(start)
		log.Printf("Day 03 took: %s", time.Since(start))
		break
	case 4:
		day04.Solve(start)
		log.Printf("Day 04 took: %s", time.Since(start))
		break
	default:
		log.Fatal("Day not found.")
	}
}
