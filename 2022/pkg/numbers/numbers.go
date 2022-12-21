package numbers

import "math/big"

func MaxInt() int {
	const UintSize = 32 << (^uint(0) >> 32 & 1)
	const MaxInt = 1<<(UintSize-1) - 1
	return MaxInt
}

func Abs(i int) int {
	if i < 0 {
		return -i
	}
	return i
}

func Mod(x, y int64) int64 {
	bx, by := big.NewInt(x), big.NewInt(y)
	return new(big.Int).Mod(bx, by).Int64()
}
