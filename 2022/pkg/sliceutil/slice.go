package sliceutil

import (
	"log"
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
			log.Fatal(e)
		}
		intSlice = append(intSlice, i)
	}
	return intSlice
}

func BloatSlice(min, max int) []int {
	a := make([]int, max-min+1)
	for i := range a {
		a[i] = min + i
	}
	return a
}
