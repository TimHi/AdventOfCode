package day19

import (
	"fmt"
	"time"

	"github.com/TimHi/AdventOfCode/m/v2/pkg/fileutil"
)

func Solve(start time.Time, useSampleFlag bool, day int) {
	input := fileutil.GetStringInputs(useSampleFlag, day, 2022)
	fmt.Printf("Day 19 Part 01: Highest quality level: %d \n", SolvePartOne(input))
	elapsed := time.Since(start)
	fmt.Printf("Day 19 Part 01: finished in: %s \n", elapsed)
	fmt.Printf("Day 19 Part 02: TBD: %d \n", SolvePartTwo(input))
	elapsed = time.Since(start)
	fmt.Printf("Day 19 Part 02: finished in: %s \n", elapsed)
}

type RobotInventory struct {
	OreRobot      int
	ClayRobot     int
	ObsidianRobot int
	GeodeRobot    int
}

type ResourceInventory struct {
	Ore      int
	Clay     int
	Obsidian int
	Geode    int
}

type Blueprint struct {
	BlueprintNumber        int
	OreRobotOreCost        int
	ClayRobotOreCost       int
	ObsidianRobotOreCost   int
	ObsidianRobotClayCost  int
	GeodeRobotOreCost      int
	GeodeRobotObsidianCost int
}

func NewBlueprint(blueprintNumber int, oreRobotOreCost int, clayRobotOreCost int, obsidianRobotOreCost int, geodeRobotOreCost int, obsidianRobotClayCost int, geodeRobotObsidianCost int) Blueprint {
	return Blueprint{
		BlueprintNumber:        blueprintNumber,
		OreRobotOreCost:        oreRobotOreCost,
		ClayRobotOreCost:       clayRobotOreCost,
		ObsidianRobotOreCost:   obsidianRobotOreCost,
		GeodeRobotOreCost:      geodeRobotOreCost,
		ObsidianRobotClayCost:  obsidianRobotClayCost,
		GeodeRobotObsidianCost: geodeRobotObsidianCost,
	}
}
func SolvePartOne(input []string) int {
	bluePrints := parseBlueprints(input)
	scores := map[int]int{}

	for _, bluePrint := range bluePrints {
		result := simulate(24, bluePrint, ResourceInventory{0, 0, 0, 0}, RobotInventory{1, 0, 0, 0})
		scores[bluePrint.BlueprintNumber] = result
	}

	result := 0
	for key, value := range scores {
		result += key * value
	}
	return result
}

func simulate(duration int, bluePrint Blueprint, resources ResourceInventory, robots RobotInventory) int {
	building := "" // Only one robot is built at a time just keep track with a string
	for i := 0; i < 24; i++ {
		if building != "" {
			robots = buildRobot(building, robots)
			building = ""
		}
		resources, building = tryBuildRobot(bluePrint, resources, robots)
		resources = mineResources(resources, robots)
	}
	return resources.Geode
}

func tryBuildRobot(bluePrint Blueprint, resources ResourceInventory, robots RobotInventory) (ResourceInventory, string) {
	maxOre := 1
	maxClay := maxClayNeededPerRound(bluePrint)
	//Ore robots should be maxed to the point where it does not make sense anymore (gather = possible output, ore costs seem to be low in every blueprint)
	/*if robots.OreRobot < maxOre && resources.Ore >= bluePrint.OreRobotOreCost {
		resources.Ore -= bluePrint.OreRobotOreCost
		return resources, "Ore"
	}*/
	//This could be wrong idk
	if robots.OreRobot == maxOre && robots.ClayRobot < maxClay && resources.Ore >= bluePrint.ClayRobotOreCost {
		resources.Ore -= bluePrint.ClayRobotOreCost
		return resources, "Clay"
	}
	//Geode Robots should have the highest priorit
	if robots.OreRobot == maxOre && robots.ClayRobot == maxClay && resources.Ore >= bluePrint.GeodeRobotOreCost && resources.Obsidian >= bluePrint.GeodeRobotObsidianCost {
		resources.Ore -= bluePrint.GeodeRobotOreCost
		resources.Obsidian -= bluePrint.GeodeRobotObsidianCost
		return resources, "Geode"
	}
	//Obsidian should be high priority too
	if robots.OreRobot == maxOre && robots.ClayRobot == maxClay && resources.Ore >= bluePrint.ObsidianRobotOreCost && resources.Clay >= bluePrint.ObsidianRobotClayCost {
		resources.Ore -= bluePrint.ObsidianRobotOreCost
		resources.Clay -= bluePrint.ObsidianRobotClayCost
		return resources, "Obsidian"
	}
	return resources, "" // No Robot can/should be built this round
}

func maxOreNeededPerRound(bluePrint Blueprint) int {
	maxOre := 0
	if bluePrint.ClayRobotOreCost > maxOre {
		maxOre = bluePrint.ClayRobotOreCost
	}
	if bluePrint.OreRobotOreCost > maxOre {
		maxOre = bluePrint.OreRobotOreCost
	}
	if bluePrint.ObsidianRobotOreCost > maxOre {
		maxOre = bluePrint.ObsidianRobotOreCost
	}
	if bluePrint.GeodeRobotOreCost > maxOre {
		maxOre = bluePrint.GeodeRobotOreCost
	}
	return maxOre / 2
}

func maxClayNeededPerRound(bluePrint Blueprint) int {
	return maxOreNeededPerRound(bluePrint) * 2
}

func buildRobot(robotToBuild string, robots RobotInventory) RobotInventory {
	switch robotToBuild {
	case "Ore":
		robots.OreRobot += 1
	case "Clay":
		robots.ClayRobot += 1
	case "Obsidian":
		robots.ObsidianRobot += 1
	case "Geode":
		robots.GeodeRobot += 1
	}
	return robots
}

func mineResources(resources ResourceInventory, robots RobotInventory) ResourceInventory {
	resources.Ore += robots.OreRobot
	resources.Clay += robots.ClayRobot
	resources.Obsidian += robots.ObsidianRobot
	resources.Geode += robots.GeodeRobot
	return resources
}

func parseBlueprints(input []string) []Blueprint {
	bluePrints := []Blueprint{}
	for _, blueprint := range input {
		var blueprintNumber, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, geodeRobotOreCost, obsidianRobotClayCost, geodeRobotObsidianCost int
		fmt.Sscanf(blueprint, "Blueprint %d: Each ore robot costs %d ore. Each clay robot costs %d ore. Each obsidian robot costs %d ore and %d clay. Each geode robot costs %d ore and %d obsidian.", &blueprintNumber, &oreRobotOreCost, &clayRobotOreCost, &obsidianRobotOreCost, &obsidianRobotClayCost, &geodeRobotOreCost, &geodeRobotObsidianCost)
		bluePrints = append(bluePrints, NewBlueprint(blueprintNumber, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, geodeRobotOreCost, obsidianRobotClayCost, geodeRobotObsidianCost))
	}
	return bluePrints
}

func SolvePartTwo(input []string) int {
	return 0
}
