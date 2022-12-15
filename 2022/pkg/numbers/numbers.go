package numbers

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
