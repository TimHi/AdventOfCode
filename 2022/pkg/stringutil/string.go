package stringutil

import "strconv"

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
