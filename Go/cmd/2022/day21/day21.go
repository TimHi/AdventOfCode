package day21

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	fmt.Printf("Day 21 Part 01: root yells: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 21 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 21 Part 02: TBD: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 21 Part 02: finished in: %s \n", elapsed)
}

type monkeyMath struct {
	id            string
	operation     string
	firstOperand  string
	secondOperand string
	result        bool
}

func SolvePartOne(input []string) int {
	monkeyNumbers := map[string]int{}
	monkeys := []monkeyMath{}
	for _, v := range input {
		splits := strings.Split(v, " ")
		splits[0] = strings.TrimSuffix(splits[0], ":")
		//Is Number
		if len(splits) == 2 {
			monkeyNumbers[splits[0]] = stringutil.ParseNumber(splits[1])
		} else {
			monkey := monkeyMath{}
			monkey.id = strings.TrimSuffix(splits[0], ":")
			monkey.firstOperand = splits[1]
			monkey.operation = splits[2]
			monkey.secondOperand = splits[3]
			monkey.result = false
			monkeys = append(monkeys, monkey)
		}
	}

	fmt.Println(monkeyNumbers)
	return doMonkeyMath(monkeyNumbers, monkeys)
}

func SolvePartTwo(input []string) int {
	monkeyNumbers := map[string]int{}
	monkeys := []monkeyMath{}
	for _, v := range input {
		splits := strings.Split(v, " ")
		splits[0] = strings.TrimSuffix(splits[0], ":")
		//Is Number
		if len(splits) == 2 {
			if splits[0] != "humn" {
				monkeyNumbers[splits[0]] = stringutil.ParseNumber(splits[1])
			}
		} else {
			monkey := monkeyMath{}
			monkey.id = strings.TrimSuffix(splits[0], ":")
			monkey.firstOperand = splits[1]
			monkey.operation = splits[2]
			if monkey.id == "root" {
				monkey.operation = "="
			}
			monkey.secondOperand = splits[3]
			monkey.result = false
			monkeys = append(monkeys, monkey)
		}
	}

	return doStuffyStuff(monkeyNumbers, monkeys)
}

func doMonkeyMathP2(monkeyNumbers map[string]int, monkeys []monkeyMath) (map[string]int, []monkeyMath) {
	for _, monkey := range monkeys {
		if !monkey.result {
			successOp1, op1 := tryGetMonkeyNumber(monkeyNumbers, monkey.firstOperand)
			successOp2, op2 := tryGetMonkeyNumber(monkeyNumbers, monkey.secondOperand)

			if successOp1 && successOp2 {
				result := calc(op1, op2, monkey.operation)
				monkeyNumbers[monkey.id] = result
				monkey.result = true
			}
		}
	}
	return monkeyNumbers, monkeys
}

func doStuffyStuff(monkeyNumbers map[string]int, monkeys []monkeyMath) int {
	found := false
	result := 1
	minInput := -(1 << 31)
	maxInput := (1 << 31) - 1
	lastMid := 0
	for !found {

		midInput := (minInput + maxInput) / 2
		if lastMid == midInput {
			midInput = 0
		}
		fmt.Printf("Trying %d \n", midInput)
		monkeyNumbers["humn"] = midInput
		monkeyNumbers, monkeys = doMonkeyMathP2(monkeyNumbers, monkeys)
		found, result = getRootResult(monkeyNumbers, monkeys)

		if found {
			return midInput
		} else {

			if result > 0 {
				// The output is too large, so search the lower half of the range
				maxInput = midInput - 1
			} else {
				// The output is too small, so search the upper half of the range
				minInput = midInput + 1
			}
		}
		lastMid = midInput
	}
	return 0
}

func getRootResult(monkeyNumbers map[string]int, monkeys []monkeyMath) (bool, int) {
	rootMonke := getMonkeyFromList("root", monkeys)
	successOp1, op1 := tryGetMonkeyNumber(monkeyNumbers, rootMonke.firstOperand)
	successOp2, op2 := tryGetMonkeyNumber(monkeyNumbers, rootMonke.secondOperand)

	if successOp1 && successOp2 {
		result := calc(op1, op2, rootMonke.operation)
		return result == 0, result
	}
	return false, 0
}

// No checks wether the monkey exists are implemented
func getMonkeyFromList(id string, monkeys []monkeyMath) monkeyMath {
	for _, m := range monkeys {
		if m.id == id {
			return m
		}
	}
	return monkeyMath{}
}

func calc(op1, op2 int, operation string) int {
	switch operation {
	case "+":
		return op1 + op2
	case "-":
		return op1 - op2
	case "*":
		return op1 * op2
	case "/":
		return op1 / op2
	case "=":
		return op1 - op2
	default:
		panic("Monkes operation not found")
	}
}

func tryGetMonkeyNumber(monkeyNumbers map[string]int, id string) (bool, int) {
	value, ok := monkeyNumbers[id]
	if ok {
		return true, value
	} else {
		return false, -1
	}
}

func doMonkeyMath(monkeyNumbers map[string]int, monkeys []monkeyMath) int {
	rootKnown := false
	for !rootKnown {
		for _, monkey := range monkeys {
			if !monkey.result {
				successOp1, op1 := tryGetMonkeyNumber(monkeyNumbers, monkey.firstOperand)
				successOp2, op2 := tryGetMonkeyNumber(monkeyNumbers, monkey.secondOperand)

				if successOp1 && successOp2 {
					result := calc(op1, op2, monkey.operation)
					monkeyNumbers[monkey.id] = result
					monkey.result = true
				}

				value, ok := monkeyNumbers["root"]
				if ok {
					return value
				}
			}
		}
	}
	return -1
}
