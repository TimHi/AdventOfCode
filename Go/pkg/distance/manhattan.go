package distance

import (
	"github.com/TimHi/AdventOfCode/m/v2/pkg/numbers"
)

func GetManhattanDistance(x1, y1, x2, y2 int) int {
	return numbers.Abs(x2-x1) + numbers.Abs(y2-y1)
}
