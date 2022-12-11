package sliceutil

import (
	"strconv"
)

func Intersection(s1, s2 []string) (inter []string) {
	hash := make(map[string]bool)
	for _, e := range s1 {
		hash[e] = true
	}
	for _, e := range s2 {
		// If elements present in the hashmap then append intersection list.
		if hash[e] {
			inter = append(inter, e)
		}
	}
	//Remove dups from slice.
	inter = removeDups(inter)
	return
}

// Remove dups from slice.
func removeDups(elements []string) (nodups []string) {
	encountered := make(map[string]bool)
	for _, element := range elements {
		if !encountered[element] {
			nodups = append(nodups, element)
			encountered[element] = true
		}
	}
	return
}

func StringToIntSlice(stringSlice []string) []int {
	var intSlice = []int{}
	for _, s := range stringSlice {
		i, e := strconv.Atoi(s)
		if e != nil {
			panic(e)
		}
		intSlice = append(intSlice, i)
	}
	return intSlice
}

// Creates a slice with the size max-min+1 and fills
// the slice with ascending numbers starting from min
// if max < min is passed a empty slice is returned
func BloatSlice(min, max int) []int {
	if max < min {
		return make([]int, 0)
	}
	a := make([]int, max-min+1)

	for i := range a {
		a[i] = min + i
	}
	return a
}

func ReverseSlice[T any](s []T) {
	first := 0
	last := len(s) - 1
	for first < last {
		s[first], s[last] = s[last], s[first]
		first++
		last--
	}
}

// TODO: Test
func Remove(slice []int, s int) []int {
	return append(slice[:s], slice[s+1:]...)
}
