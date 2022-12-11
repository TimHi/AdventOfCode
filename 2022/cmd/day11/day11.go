package day11

import (
	"fmt"
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
	fmt.Printf("Day 08 Part 01: Visible Trees: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 08 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 08 Part 02: Highest Scenic View Score: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 08 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	monkeys := parseInput(input)
	fmt.Println(monkeys)
	doMonkeyBuisness(monkeys, 1)
	fmt.Println(monkeys)
	for _, m := range monkeys {
		fmt.Println(m.inspected)
	}
	return 0
}

func doMonkeyBuisness(monkeys []Monkey, times int) {
	for round := 0; round < times; round++ {
		for index, monkey := range monkeys {
			fmt.Printf("Monkey %d:\n", index)
			fmt.Println(monkey.items)
			for _, item := range monkey.items {
				fmt.Printf("Monkey inspects an item with a worry level of %d.\n", item)
				monkey.inspected = monkey.inspected + 1
				worryLevel := calculateWorryLevel(monkey.operationOne, monkey.operationTwo, monkey.operation, item)
				worryLevel = worryLevel / 3
				if worryLevel%monkey.testWorryLevel == 0 {
					test := append(monkeys[monkey.destTrue].items, worryLevel)
					fmt.Println(test)
					monkeys[monkey.destTrue].items = test
				} else {
					monkeys[monkey.destFalse].items = append(monkeys[monkey.destFalse].items, worryLevel)
				}
			}
			fmt.Println("Before deletion")
			fmt.Println(monkey.items)
			monkey.items = []int{}
			monkeys[index] = monkey
			fmt.Println(monkey.items)
		}
		fmt.Printf("After Round %d: \n", round)
		for _, affe := range monkeys {
			fmt.Println(affe.items)
		}
	}
}

func remove(slice []int, s int) []int {
	return append(slice[:s], slice[s+1:]...)
}

func calculateWorryLevel(op1 string, op2 string, operand string, item int) int {
	worryLevel := 0
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
			if len(words) > 5 {
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

func SolvePartTwo(input []string) int {
	visibleTrees := 0
	return visibleTrees
}
