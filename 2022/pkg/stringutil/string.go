package stringutil

import (
	"log"
	"strconv"
)

func Reverse(s string) (result string) {
	for _, v := range s {
		result = string(v) + result
	}
	return
}

func IsNumber(s string) bool {
	_, err := strconv.Atoi(s)
	return err == nil
}

func ParseNumber(s string) int {
	number, err := strconv.Atoi(s)
	if err != nil {
		log.Fatal(err)
	}
	return number
}
