package sliceutil_test

import (
	"fmt"
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/sliceutil"
	"github.com/stretchr/testify/assert"
)

var TestBloatSliceData = []struct {
	min          int
	max          int
	bloatedSlice []int
}{
	{3, 3, []int{3}},
	{0, 0, []int{0}},
	{0, 4, []int{0, 1, 2, 3, 4}},
	{1, 4, []int{1, 2, 3, 4}},
	{4, 2, []int{}},
	{-1, 3, []int{-1, 0, 1, 2, 3}},
	{3, -1, []int{}},
}

func TestBloatSlice(t *testing.T) {
	for _, testData := range TestBloatSliceData {
		r := sliceutil.BloatSlice(testData.min, testData.max)
		m := fmt.Sprintf("BloatSlice failed: Min: %d, Max: %d", testData.min, testData.max)
		assert.Equal(t, testData.bloatedSlice, r, m)
	}
}

var TestStringToIntSliceData = []struct {
	in  []string
	out []int
}{
	{[]string{}, []int{}},
	{[]string{"1", "0", "-1"}, []int{1, 0, -1}},
}

func TestStringToIntSlice(t *testing.T) {
	for _, testData := range TestStringToIntSliceData {
		r := sliceutil.StringToIntSlice(testData.in)
		assert.Equal(t, testData.out, r, "StringToIntSlice failed!")
	}
}

func TestStringToIntFail(t *testing.T) {
	in := []string{"NaN"}
	assert.Panics(t, func() { sliceutil.StringToIntSlice(in) })
}
