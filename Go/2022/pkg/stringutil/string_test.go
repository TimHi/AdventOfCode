package stringutil_test

import (
	"testing"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
	"github.com/stretchr/testify/assert"
)

func TestIsUpper(t *testing.T) {
	upperString := "ISUPPER"
	mixedString := "mIxEdStRiNg"
	lowerString := "lower"
	assert.True(t, stringutil.IsUpper(upperString))
	assert.False(t, stringutil.IsUpper(mixedString))
	assert.False(t, stringutil.IsUpper(lowerString))
}
