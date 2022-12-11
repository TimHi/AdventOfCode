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

func ParseFloat64(s string) float64 {
	number, err := strconv.ParseFloat(s, 64)
	if err != nil {
		log.Fatal(err)
	}
	return number
}

func ParseInt64(s string) int64 {
	number := ParseNumber(s)
	return int64(number)
}

func ParseInt64WithError(s string) (int64, error) {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return -1, err
	}
	return i, nil
}

func NotEmpty(s string) bool {
	return len(s) > 0
}
