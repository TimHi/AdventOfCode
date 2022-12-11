package day11

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

type Monkey struct {
	id             int
	items          []int
	operation      string
	operationOne   string
	operationTwo   string
	testWorryLevel int
	destTrue       int
	destFalse      int
	inspected      int
}

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 11 Part 01: Monkey buisness level: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 11 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 11 Part 02: Monkey buisness level: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 11 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	monkeys := parseInput(input)
	doMonkeyBuisness(monkeys, 20, true)
	return getMonkeyBuisnessLevel(monkeys)
}

func SolvePartTwo(input []string) int {
	monkeys := parseInput(input)
	doMonkeyBuisness(monkeys, 10000, false)
	return getMonkeyBuisnessLevel(monkeys)
}

func doMonkeyBuisness(monkeys []Monkey, times int, isWorried bool) {
	div := 3
	if !isWorried {
		div = getDivisor(monkeys)
	}

	for round := 0; round < times; round++ {
		for index, monkey := range monkeys {
			monkey.inspected = monkey.inspected + len(monkey.items)
			for _, item := range monkey.items {
				worryLevel := calculateWorryLevel(monkey.operationOne, monkey.operationTwo, monkey.operation, item)
				if isWorried {
					worryLevel = worryLevel / div
				} else {
					worryLevel = worryLevel % div
				}
				if worryLevel%monkey.testWorryLevel == 0 && worryLevel != 0 {
					monkeys[monkey.destTrue].items = append(monkeys[monkey.destTrue].items, worryLevel)
				} else {
					monkeys[monkey.destFalse].items = append(monkeys[monkey.destFalse].items, worryLevel)
				}
			}
			monkey.items = []int{}
			monkeys[index] = monkey
		}
	}
}

func getMonkeyBuisnessLevel(monkeys []Monkey) int {
	sort.Slice(monkeys, func(i, j int) bool {
		return monkeys[i].inspected > monkeys[j].inspected
	})

	return monkeys[0].inspected * monkeys[1].inspected
}

func getDivisor(monkeys []Monkey) int {
	div := 1
	//div = 13 * 23 * 19 * 17
	for _, monkey := range monkeys {
		div *= int(monkey.testWorryLevel)
	}
	return div
}

// not happy with this
func calculateWorryLevel(op1 string, op2 string, operand string, item int) int {
	var worryLevel int = 0
	//Try parse op1, it will throw an error if it should be "old", set iOp1 to the passed item then
	iOp1, err := strconv.Atoi(op1)
	if err != nil {
		iOp1 = item
	}

	iOp2, err := strconv.Atoi(op2)
	if err != nil {
		iOp2 = item
	}

	if operand == "*" {
		worryLevel = iOp1 * iOp2
	} else if operand == "+" {
		worryLevel = iOp1 + iOp2
	} else {
		panic("Operand not know")
	}
	return worryLevel
}

// Well.....
func parseInput(input []string) []Monkey {
	monkeys := []Monkey{}
	monkey := Monkey{}
	monkey.items = []int{}

	for _, line := range input {
		words := strings.Split(line, " ")
		if line == "" {
			monkeys = append(monkeys, monkey)
			monkey = Monkey{}
			monkey.items = []int{}

		} else if words[0] == "Monkey" {
			//Get the monkey id, cut of the : part at the end..
			monkey.id = stringutil.ParseNumber(words[1][:len(words[1])-1])
		} else if words[2] == "Starting" {
			if len(words) >= 5 {
				for i := 4; i < len(words); i++ {
					if i == len(words)-1 {
						item := stringutil.ParseNumber(words[i])
						monkey.items = append(monkey.items, item)
					} else { // Cut the , from the item
						item := stringutil.ParseNumber(words[i][:len(words[i])-1])
						monkey.items = append(monkey.items, item)
					}
				}
			}
		} else if words[2] == "Operation:" {
			monkey.operationOne = words[5]
			monkey.operation = words[6]
			monkey.operationTwo = words[7]
		} else if words[2] == "Test:" {
			monkey.testWorryLevel = stringutil.ParseNumber(words[5])
		} else if len(words) > 1 && words[5] == "true:" {
			monkey.destTrue = stringutil.ParseNumber(words[9])
		} else if len(words) > 1 && words[5] == "false:" {
			monkey.destFalse = stringutil.ParseNumber(words[9])
		}
	}
	monkeys = append(monkeys, monkey)
	return monkeys
}
