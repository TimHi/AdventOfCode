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
        for(i in 0..crabList.size) {
            tempFuel = 0
            for (c in crabList) {
                var stepsNeeded = (c.toInt() - i).absoluteValue
                val steps = IntArray(stepsNeeded) { it + 1 }
                tempFuel += steps.sum()
            }
            if(tempFuel < totalFuel){
                totalFuel = tempFuel
            }
        }
        return totalFuel
    }
}