package pairs

import "sort"

// Taken from: https://stackoverflow.com/a/18695740/11962431
type Pair struct {
	Key   int
	Value int
}

func SortMapToPairs(elfMap map[int]int) PairList {
	pl := make(PairList, len(elfMap))
	i := 0
	for k, v := range elfMap {
		pl[i] = Pair{Key: k, Value: v}
		i++
	}
	sort.Sort(sort.Reverse(pl))
	return pl
}

type PairList []Pair

func (p PairList) Len() int           { return len(p) }
func (p PairList) Less(i, j int) bool { return p[i].Value < p[j].Value }
func (p PairList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
