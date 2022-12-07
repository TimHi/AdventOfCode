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

func ParseInt64(s string) int64 {
	number := ParseNumber(s)
	return int64(number)
}

func NotEmpty(s string) bool {
	return len(s) > 0
}
