package day07

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 07 Part 01: Size of all directories with a total size of at most 100000: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 07 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 07 Part 02: Size of directory to delete: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 07 Part 02: finished in: %s \n", elapsed)
}

type Node struct {
	files    map[string]File
	dirSize  int64
	name     string
	children []*Node
	parent   *Node
}

type File struct {
	name string
	size int64
}

func SolvePartOne(input []string) int64 {
	rootNode := Node{files: make(map[string]File), name: "root", children: []*Node{}, parent: nil}
	currentNode := &rootNode
	var test = make(map[string]int)
	for _, line := range input {
		if isCommand(line) {
			if isCdCommand(line) {
				target := getTargetDirectory(line)
				if target == ".." {
					currentNode = currentNode.parent
				} else {
					if value, ok := test[target]; ok {
						test[target] = value + 1
					} else {
						test[target] = 1
					}
					n := &Node{files: make(map[string]File), name: target, children: []*Node{}, parent: currentNode}
					currentNode.children = append(currentNode.children, n)
					currentNode = n
				}
			}
		} else if isLsOutput(line) {
			size, fileName := getLsOutput(line)
			// File size does not change in the input, no need to check for updates (handle ok path)
			if _, ok := currentNode.files[fileName]; !ok {
				currentNode.files[fileName] = File{name: fileName, size: size}
			}
		}
	}

	initNodeSizes(&rootNode)
	var sum int64 = 0
	getSumOfDirectories(&rootNode, 100000, &sum)
	return sum
}

func SolvePartTwo(input []string) int64 {
	rootNode := Node{files: make(map[string]File), name: "root", children: []*Node{}, parent: nil}
	currentNode := &rootNode
	var test = make(map[string]int)
	for _, line := range input {
		if isCommand(line) {
			if isCdCommand(line) {
				target := getTargetDirectory(line)
				if target == ".." {
					currentNode = currentNode.parent
				} else {
					if value, ok := test[target]; ok {
						test[target] = value + 1
					} else {
						test[target] = 1
					}
					n := &Node{files: make(map[string]File), name: target, children: []*Node{}, parent: currentNode}
					currentNode.children = append(currentNode.children, n)
					currentNode = n
				}
			}
		} else if isLsOutput(line) {
			size, fileName := getLsOutput(line)
			// File size does not change in the input, no need to check for updates (handle ok path)
			if _, ok := currentNode.files[fileName]; !ok {
				currentNode.files[fileName] = File{name: fileName, size: size}
			}
		}
	}

	initNodeSizes(&rootNode)
	var size int64 = 70000000
	var counter int64 = 0
	var usedSpace int64 = rootNode.dirSize
	var requiredSpace int64 = 30000000
	sumOfDeleted(&rootNode, requiredSpace, &usedSpace, &size)
	fmt.Println(counter)
	return size
}

func sumOfDeleted(node *Node, requiredSpace int64, usedSpace *int64, size *int64) {
	if *usedSpace-node.dirSize < 70000000-requiredSpace {
		if node.dirSize < *size {
			*size = node.dirSize
		}
	}
	for _, c := range node.children {
		sumOfDeleted(c, requiredSpace, usedSpace, size)
	}
}

func getSumOfDirectories(node *Node, limit int64, sum *int64) {
	if node.dirSize < limit {
		*sum += node.dirSize
	}
	for _, c := range node.children {
		getSumOfDirectories(c, limit, sum)
	}
}

func initNodeSizes(node *Node) {
	dirSize := getDirSize(node)
	node.dirSize += dirSize
	for _, c := range node.children {
		initNodeSizes(c)
	}
	addDirSizeToParent(node)
}

func addDirSizeToParent(node *Node) {
	if node.parent != nil {
		node.parent.dirSize += node.dirSize
	}
}

func getDirSize(node *Node) int64 {
	var size int64 = 0
	for _, f := range node.files {
		size += f.size
	}
	return size
}

// utilize strings.Split?
func isCommand(c string) bool {
	return stringutil.NotEmpty(c) && string(c[0]) == "$"
}

func isCdCommand(c string) bool {
	if !stringutil.NotEmpty(c) || len(c) < 4 {
		return false
	}
	command := string(c[0:4])
	return command == "$ cd"
}

func isLsOutput(c string) bool {
	if !stringutil.NotEmpty(c) {
		return false
	}
	output := string(c[0:1])
	parts := strings.Split(c, " ")
	return output != "$" && len(parts) == 2 && stringutil.IsNumber(parts[0])
}

func getLsOutput(c string) (int64, string) {
	parts := strings.Split(c, " ")
	return stringutil.ParseInt64(parts[0]), parts[1]
}

func getTargetDirectory(c string) string {
	//$ cd dir = from the 6th index
	return string(c[5:])
}
