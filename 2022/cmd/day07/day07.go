package day07

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetPuzzleInput(useSampleFlag, day)
	fmt.Printf("Day 07 Part 01: Size of all directories with a total size of at most 100000: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 07 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 07 Part 02: Message marker at Position: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 07 Part 02: finished in: %s \n", elapsed)
}

type Node struct {
	files    map[string]File
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
		fmt.Println("Read line: " + line)
		if isCommand(line) {
			if isCdCommand(line) {
				target := getTargetDirectory(line)
				if target == ".." {
					currentNode = currentNode.parent
					fmt.Println("cd ..: " + line)
				} else {
					fmt.Println("cd : " + target)

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
			fmt.Printf("ls output %d : \n", size)
			// File size does not change in the input, no need to check for updates (handle ok path)
			if _, ok := currentNode.files[fileName]; !ok {
				currentNode.files[fileName] = File{name: fileName, size: size}
			}
		}
	}
	dirMap := map[string]int64{}
	fmt.Println("Ok Leeeets Go")
	rootNode = *rootNode.children[0]
	rootNode.parent = nil
	initDirMap(&rootNode, dirMap)
	sum := getSumOfDirectories(dirMap, 100000)
	fmt.Println(test)
	fmt.Println(len(test))
	fmt.Println(dirMap)
	return sum
}

// TODO: Naming
func getSumOfDirectories(dirMap map[string]int64, limit int64) int64 {
	var sum int64 = 0
	for key, value := range dirMap {
		if key != "root" {
			if value <= limit {
				fmt.Printf("Adding: %s %d \n", key, value)
				sum += value
			}
		}
	}
	return sum
}

func initDirMap(node *Node, dirMap map[string]int64) {
	if node.name != "root" {
		dirSize := getDirSize(node)
		fmt.Printf("Currently at Node: %s with Dirsize %d \n", node.name, dirSize)
		_, ok := dirMap[node.name]
		if !ok {
			fmt.Printf("Node: %s has empty dirMap, enter Dirsize %d \n", node.name, dirSize)
			dirMap[node.name] = dirSize
		}

		for _, c := range node.children {
			fmt.Printf("Child %s of %s \n", c.name, node.name)
			initDirMap(c, dirMap)
		}
		addDirSizeToParent(node, dirMap)
	}
}

func addDirSizeToParent(node *Node, dirMap map[string]int64) {
	if node.parent != nil {
		nodeValue, ok := dirMap[node.name]
		if ok {
			if node.parent != nil {
				value, ok := dirMap[node.parent.name]
				if ok {
					fmt.Printf("Parent Node: %s of %s has dirMap value %d, add Dirsize %d \n", node.parent.name, node.name, value, nodeValue)
					dirMap[node.parent.name] = nodeValue + value
				} else {
					fmt.Printf("Parent Node: %s of %s has empty dirMap, enter Dirsize %d \n", node.parent.name, node.name, nodeValue)
					dirMap[node.parent.name] = nodeValue
				}
			}
		}
		//addDirSizeToParent(node.parent, dirMap)
	}
}

func getDirSize(node *Node) int64 {
	var size int64 = 0
	for _, f := range node.files {
		size += f.size
	}
	return size
}

func SolvePartTwo(input []string) int64 {
	return -1
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
