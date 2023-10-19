package day07

import kotlin.math.absoluteValue

class Day07 (private var input: List<String>) {
    fun SolvePartOne(): Int {
        val crabList = input[0].split(",")
        var totalFuel = Int.MAX_VALUE
        var tempFuel = 0
        for(i in 0..crabList.size) {
            tempFuel = 0
            for (c in crabList) {
                tempFuel += (c.toInt() - i).absoluteValue
            }
            if(tempFuel < totalFuel){
                totalFuel = tempFuel
            }
        }
        return totalFuel
    }

    fun SolvePartTwo(): Int {
        val crabList = input[0].split(",")
        var totalFuel = Int.MAX_VALUE
        var tempFuel = 0
        var pos = 0
        for(i in 0..crabList.size) {
            tempFuel = 0
            for (c in crabList) {
                tempFuel += IntArray((c.toInt() - i).absoluteValue) { it + 1 }.sum() // Take the steps needed, create an array with increasing numbers and take their sum https://de.wikipedia.org/wiki/Summe#Notation_mit_dem_Summenzeichen
            }
            if(tempFuel < totalFuel){
                totalFuel = tempFuel
                pos = i
            }
        }
        println("Pos: $pos, Fuel: $totalFuel")
        return totalFuel
    }
}