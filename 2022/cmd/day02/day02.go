package day02

import (
	"log"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

// P1: A,X: Rock, B,Y: Paper, C,Z: Scissor
// X: lose, Y: draw, z: win
var winner = map[string]string{
	"A": "Z",
	"B": "X",
	"C": "Y",
	"X": "C",
	"Y": "A",
	"Z": "B",
}

var p2Winner = map[string]string{
	"A": "B",
	"B": "C",
	"C": "A",
}

var loser = map[string]string{
	"A": "C",
	"B": "A",
	"C": "B",
}

var Cards = map[string]int{
	"A": 1, "B": 2, "C": 3,
	"X": 1, "Y": 2, "Z": 3}

func didIWin(me string, enemy string) bool {
	loser := winner[me]
	return loser == enemy
}

func isDraw(me string, enemy string) bool {
	return Cards[me] == Cards[enemy]
}

func SolvePartOne(input []string) int {
	points := 0
	for _, round := range input {
		split := strings.Fields(round)
		points += Cards[split[1]]
		if didIWin(split[1], split[0]) {
			points += 6
		} else if isDraw(split[1], split[0]) {
			points += 3
		}
	}
	return points
}

func getLosePoints(me string, enemy string) int {
	cardToLose := loser[enemy]
	return Cards[cardToLose]
}

func getDrawPoints(me string, enemy string) int {
	return Cards[enemy]
}

func getWinPoints(me string, enemy string) int {
	cardToWin := p2Winner[enemy]
	return Cards[cardToWin]
}

// X means you need to lose,
// Y means you need to end the round in a draw, and
// Z means you need to win.
func SolvePartTwo(input []string) int {
	points := 0
	for _, round := range input {
		split := strings.Fields(round)
		if split[1] == "X" {
			points += getLosePoints(split[1], split[0])
		}
		if split[1] == "Y" {
			points += getDrawPoints(split[1], split[0])
			points += 3
		}
		if split[1] == "Z" {
			points += getWinPoints(split[1], split[0])
			points += 6
		}
	}
	return points
}

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetPuzzleInput(useSampleFlag, day)

	partOne := SolvePartOne(input)
	log.Printf("Day 02 Part 01: Rock, Paper, Scissor Tournament Points: %d", partOne)
	elapsed := time.Since(start)
	log.Printf("Day 02: Part 01 took: %s", elapsed)
	partTwo := SolvePartTwo(input)
	log.Printf("Day 02 Part 02: Rock, Paper, Scissor Tournament Points: %d", partTwo)
	elapsed = time.Since(start)
	log.Printf("Day 02: Part 02 took: %s", elapsed)
}
