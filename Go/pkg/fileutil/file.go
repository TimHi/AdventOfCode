package fileutil

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

// readLines reads a whole file into memory
// and returns a slice of its lines.
func ReadLines(path string) []string {
	fullpath, err := filepath.Abs(path)
	if err != nil {
		log.Fatal(err)
	}
	file, err := os.Open(fullpath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	// optionally, resize scanner's capacity for lines over 64K, see next example
	fileContent := []string{}

	for scanner.Scan() {
		fileContent = append(fileContent, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return fileContent
}

const sampleFileName = "sampleinput.txt"
const fullFileName = "fullinput.txt"

func GetStringInputs(useSampleFlag bool, day int, year int) []string {
	prefix := fmt.Sprintf("cmd/%d/day%d/", year, day)
	if day < 10 {
		prefix = fmt.Sprintf("cmd/%d/day0%d/", year, day)
	}
	file := prefix + fullFileName
	if useSampleFlag {
		file = prefix + sampleFileName
	}
	return ReadLines(file)
}
