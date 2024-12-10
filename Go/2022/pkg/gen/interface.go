package gen

import (
	"reflect"

	"github.com/mohae/deepcopy"
)

func IsSlice(a interface{}) bool {
	return reflect.ValueOf(a).Kind() == reflect.Slice
}

func IsBigger(a []interface{}, b []interface{}) bool {
	return len(a) > len(b)
}

func InterfaceSlice(slice interface{}) []interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() != reflect.Slice {
		panic("InterfaceSlice() given a non-slice type")
	}

	// Keep the distinction between nil and empty slice input
	if s.IsNil() {
		return nil
	}

	ret := make([]interface{}, s.Len())

	for i := 0; i < s.Len(); i++ {
		ret[i] = s.Index(i).Interface()
	}

	return ret
}

// Clone deep-copies in and returns a newly-allocated value.
func Clone[T any](in T) T {
	return deepcopy.Copy(in).(T)
}
