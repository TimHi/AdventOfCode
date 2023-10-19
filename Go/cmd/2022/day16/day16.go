package day16

import (
	"fmt"
	"strings"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
	"github.com/TimHi/AdventOfCode/m/v2/pkg/stringutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 16 Part 01: Covered area from beacons %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 16 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 16 Part 02: Beacon frequency: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 16 Part 02: finished in: %s \n", elapsed)
}

func SolvePartOne(input []string) int {
	Vertices := []Vertex{}
	// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
	for _, pipeLine := range input {
		pipe := Vertex{}
		pipe.Vertices = map[string]*Vertex{}
		split := strings.Split(pipeLine, " ")
		pipe.Key = split[1]
		pipe.FlowRate = stringutil.ParseNumber(strings.Split(strings.Split(split[4], "=")[1], ";")[0])
		for i := 9; i < len(split); i++ {
			if len(split[i]) > 2 {
				pipe.Destinations = append(pipe.Destinations, split[i][0:2])
			} else {
				pipe.Destinations = append(pipe.Destinations, split[i])
			}
		}
		Vertices = append(Vertices, pipe)
	}

	graph := NewUndirectedGraph()

	for _, pipe := range Vertices {
		graph.AddVertex(pipe)
	}

	for _, pipe := range Vertices {
		for _, dest := range pipe.Destinations {
			graph.AddEdge(pipe.Key, dest)
		}
	}

	visitedOrder := []string{}
	minute := 0

	tick := func() {
		minute++
	}
	for _, v := range Vertices {
		visitedOrder := []string{}
		endpoint := v.Key
		minute = 0

		cb := func(i string) {
			minute++
			visitedOrder = append(visitedOrder, i)
			fmt.Println("Current node: " + i)
			fmt.Println("Checking " + endpoint)
			if endpoint == i {
				fmt.Println("Endpoint reached lol")
				minute = 30
				fmt.Println(visitedOrder)
			}
		}
		DFS(graph, graph.Vertices["AA"], cb, tick, &minute)
	}

	// add assertions here
	fmt.Println(visitedOrder)
	return 0
}

func SolvePartTwo(input []string) int {

	return 0
}

var visited = map[string]bool{}

func DFS(g *Graph, startVertex *Vertex, visitCb func(string), tick func(), minute *int) {
	tick() // Movement

	if startVertex == nil || *minute >= 30 { //add minutes
		return
	}

	fmt.Printf("At %s \n", startVertex.Key)

	visited[startVertex.Key] = true
	visitCb(startVertex.Key)

	// for each of the adjacent vertices, call the function recursively
	// if it hasn't yet been visited
	if len(startVertex.Vertices) == 1 {
		fmt.Println("Endpoint")
	}
	for _, v := range startVertex.Vertices {
		if visited[v.Key] {
			continue
		}
		DFS(g, v, visitCb, tick, minute)
	}
}

func getHighestFlowRate(g *Graph, vertices map[string]*Vertex, parent *Vertex) *Vertex {
	highest := &Vertex{}
	for _, v := range vertices {
		if v.FlowRate > highest.FlowRate && !v.IsOpen {
			highest = v
		}
	}

	if highest.Key == "" {
		for _, v := range vertices {
			if !v.IsOpen && v.FlowRate > 0 {
				highest = v
			}
		}
	}

	if highest.Key == "" {
		for _, v := range vertices {
			if !v.IsOpen {
				highest = v
			}
		}
	}
	if highest.Key == "" {
		for key, vert := range g.Vertices {
			for _, destinations := range vert.Vertices {
				if destinations.Key == parent.Key {
					highest = g.Vertices[key]
				}
			}
		}
	}
	return highest
}

type Vertex struct {
	// Key is the unique identifier of the vertex
	Key          string
	FlowRate     int
	Destinations []string
	IsOpen       bool
	Vertices     map[string]*Vertex
}

// We then create a constructor function for the Vertex
func NewVertex(key string, flowRate int, destinations []string) *Vertex {
	return &Vertex{
		Key:          key,
		FlowRate:     flowRate,
		Destinations: destinations,
		Vertices:     map[string]*Vertex{},
		IsOpen:       false,
	}
}

func (v *Vertex) String() string {
	s := v.Key + ":"

	for _, neighbor := range v.Vertices {
		s += " " + neighbor.Key
	}

	return s
}

type Graph struct {
	// Vertices describes all vertices contained in the graph
	// The key will be the Key value of the connected vertice
	// with the value being the pointer to it
	Vertices map[string]*Vertex
	// This will decide if it's a directed or undirected graph
	directed bool
}

// We defined constructor functions that create
// new directed or undirected graphs respectively

func NewDirectedGraph() *Graph {
	return &Graph{
		Vertices: map[string]*Vertex{},
		directed: true,
	}
}

func NewUndirectedGraph() *Graph {
	return &Graph{
		Vertices: map[string]*Vertex{},
	}
}

// AddVertex creates a new vertex with the given
// key and adds it to the graph
func (g *Graph) AddVertex(v Vertex) {

	g.Vertices[v.Key] = &v
}

// The AddEdge method adds an edge between two vertices in the graph
func (g *Graph) AddEdge(k1, k2 string) {
	v1 := g.Vertices[k1]
	v2 := g.Vertices[k2]

	// return an error if one of the vertices doesn't exist
	if v1 == nil || v2 == nil {
		panic("not all vertices exist")
	}

	// do nothing if the vertices are already connected
	if _, ok := v1.Vertices[v2.Key]; ok {
		return
	}

	// Add a directed edge between v1 and v2
	// If the graph is undirected, add a corresponding
	// edge back from v2 to v1, effectively making the
	// edge between v1 and v2 bidirectional
	v1.Vertices[v2.Key] = v2
	if !g.directed && v1.Key != v2.Key {
		v2.Vertices[v1.Key] = v1
	}

	// Add the vertices to the graph's vertex map
	g.Vertices[v1.Key] = v1
	g.Vertices[v2.Key] = v2
}

func (g *Graph) String() string {
	s := ""
	i := 0
	for _, v := range g.Vertices {
		if i != 0 {
			s += "\n"
		}
		s += v.String()
		i++
	}
	return s
}
