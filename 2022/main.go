package main

import (
	"log"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/cmd/day02"
)

func main() {
	start := time.Now()
	/*
		day01.Solve(start)
		elapsed := time.Since(start)
		log.Printf("Day 01 took: %s", elapsed)
	*/
	elapsed := time.Since(start)
	log.Printf("Day 02 took: %s", elapsed)
	day02.Solve(start)
}
