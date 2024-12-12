package util

import (
	"os"
	"strings"
)

func GetInputDataFromFile(fileName string) []string {
	file, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	contents := strings.Trim(string(file), "\n")

	data := strings.Split(contents, "\n")
	return data
}
