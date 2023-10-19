package day12

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/beefsack/go-astar"
)

type Tile struct {
	Char      rune
	X         int
	Y         int
	W         World
	elevation int
}

// World is a two dimensional map of Tiles.
type World map[int]map[int]*Tile

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day)
	start2 := time.Now()
	fmt.Printf("Day 12 Part 01: Shortest route from the Start: %f \n", SolvePartOne(input))
	elapsed := time.Since(start2)
	fmt.Printf("Day 12 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 12 Part 02: Shortest scenic hiking route: %f \n", SolvePartTwo(input))
	elapsed = time.Since(start2)
	fmt.Printf("Day 12 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) float64 {
	return findPath(input, true)
}

func SolvePartTwo(input []string) float64 {
	return findPath(input, false)
}

func findPath(worldInput []string, isPartOne bool) float64 {
	world := ParseWorld(worldInput)
	shortestDistance := math.MaxFloat64
	pathAscii := ""
	startTiles := []*Tile{}

	if isPartOne {
		startTiles = getStartTiles(world, []rune{'S'})
	} else {
		startTiles = getStartTiles(world, []rune{'S', 'a'})
	}

	for _, start := range startTiles {
		_, dist, found := astar.Path(start, world.To())
		if found && dist < shortestDistance {
			//pathAscii = world.RenderPath(p)
			shortestDistance = dist
		}
	}

	fmt.Println(pathAscii)
	return shortestDistance
}

func (t *Tile) PathNeighbors() []astar.Pather {
	neighbors := []astar.Pather{}
	for _, offset := range [][]int{
		{0, -1},
		{-1, 0},
		{1, 0},
		{0, 1},
	} {
		if n := t.W.Tile(t.X+offset[0], t.Y+offset[1]); n != nil {
			if t.elevation > n.elevation || t.elevation+1 == n.elevation || t.elevation == n.elevation { //Elves can move one elevation up and n elevations down
				neighbors = append(neighbors, n)
			}
		}

	}
	return neighbors
}

func (t *Tile) PathNeighborCost(to astar.Pather) float64 {
	// This can be one since we filter already when creating neighbours
	return 1
}

// https://github.com/beefsack/go-astar/blob/master/pather_test.go#L97
// Uses: https://en.wikipedia.org/wiki/Taxicab_geometry
func (t *Tile) PathEstimatedCost(to astar.Pather) float64 {
	toT := to.(*Tile)
	absX := toT.X - t.X
	if absX < 0 {
		absX = -absX
	}
	absY := toT.Y - t.Y
	if absY < 0 {
		absY = -absY
	}
	return float64(absX + absY)
}

// Tile gets the tile at the given coordinates in the world.
func (w World) Tile(x, y int) *Tile {
	if w[x] == nil {
		return nil
	}
	return w[x][y]
}

// SetTile sets a tile at the given coordinates in the world.
func (w World) SetTile(t *Tile, x, y int) {
	if w[x] == nil {
		w[x] = map[int]*Tile{}
	}
	w[x][y] = t
	t.X = x
	t.Y = y
	t.W = w
}

// To gets the to tile from the world.
func (w World) To() *Tile {
	return w.FirstOfKind('E')
}

// FirstOfKind gets the first tile on the board of a kind, used to get the from
// and to tiles as there should only be one of each.
func (w World) FirstOfKind(kind rune) *Tile {
	for _, row := range w {
		for _, t := range row {
			if t.Char == kind {
				return t
			}
		}
	}
	return nil
}

// ParseWorld parses a textual representation of a world into a world map.
func ParseWorld(input []string) World {
	w := World{}
	rows := len(input)
	columns := len(input[0])
	for x := 0; x < columns; x++ {
		for y := 0; y < rows; y++ {
			elevation := int(rune(input[y][x])) // Cast the rune to an int a=97, b=98, c=99.....
			if rune(input[y][x]) == 'S' {
				elevation = int(rune('a')) // S is the lowest point, set it to a
			}
			if rune(input[y][x]) == 'E' {
				elevation = int(rune('z')) //z is the highest point, E should equal the highest point
			}
			w.SetTile(&Tile{
				Char:      rune(input[y][x]),
				elevation: elevation,
			}, x, y)
		}
	}
	return w
}

func getStartTiles(world World, startRunes []rune) []*Tile {
	startTiles := []*Tile{}
	width := len(world)
	height := len(world[0])

	for _, s := range startRunes {
		for x := 0; x < width; x++ {
			for y := 0; y < height; y++ {
				t := world.Tile(x, y)
				if t.Char == s {
					startTiles = append(startTiles, t)
				}
			}
		}
	}
	return startTiles
}

// RenderPath renders a path on top of a world.
func (w World) RenderPath(path []astar.Pather) string {
	width := len(w)
	if width == 0 {
		return ""
	}
	height := len(w[0])
	pathLocs := map[string]bool{}
	for _, p := range path {
		pT := p.(*Tile)
		pathLocs[fmt.Sprintf("%d,%d", pT.X, pT.Y)] = true
	}
	rows := make([]string, height)
	for x := 0; x < width; x++ {
		for y := 0; y < height; y++ {
			t := w.Tile(x, y)
			r := ' '
			if pathLocs[fmt.Sprintf("%d,%d", x, y)] {
				r = '.'
			} else if t != nil {
				r = rune(t.elevation)
			}
			rows[y] += string(r)
		}
	}
	return strings.Join(rows, "\n")
}
