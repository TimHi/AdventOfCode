package day06

import java.math.BigInteger

class LanternFish(var count: Int, var day06: Day06) {
    fun simulateDay() {
        if (count == 0) {
            day06.lanternFishList.add(LanternFish(day06.freshSpawnCount, day06))
            count = 7
        }
        count -= 1
    }
}

class Day06(_input: List<String>) {
    private var input: List<String> = _input
    val freshSpawnCount: Int = 8
    var lanternFishList: MutableList<LanternFish> = emptyList<LanternFish>().toMutableList()

    private fun setInitialState(split: List<String>) {
        lanternFishList = emptyList<LanternFish>().toMutableList()
        for (f in split) {
            lanternFishList.add(LanternFish(f.toInt(), this))
        }
    }

    private fun simulateDays(dayCount: Int) {
        for (i in 1..dayCount) {
            for (i in 0 until lanternFishList.size) {
                lanternFishList[i].simulateDay()
            }
        }
    }

    private fun solveByArray(days: Int, initState: List<String>): Long {
        var zero: Long = 0
        var fishCountArray = Array(9) { zero }
        //Fill initial fish counts to the array
        for (l in initState) {
            fishCountArray[l.toInt()] = fishCountArray[l.toInt()] + 1
        }

        for (i in 0 until days) {
            var savedValOld: Long = 0
            var savedValNew: Long = 0
            for (i in fishCountArray.lastIndex downTo 0) {
                if(i == 8){
                    savedValOld = fishCountArray[i - 1]
                    fishCountArray[i - 1] = fishCountArray[i]
                } else if(i != 8 && i != 0) {
                    savedValNew = fishCountArray[i - 1]
                    fishCountArray[i - 1] = savedValOld
                    savedValOld = savedValNew
                }else if(i == 0) {
                    fishCountArray[6] = fishCountArray[6] + savedValOld
                    fishCountArray[8] = savedValOld
                }
            }

        }
        var fishSum: Long = 0
        for((i) in fishCountArray.withIndex()){
            fishSum += fishCountArray[i]
        }
        return fishSum
    }

    fun SolvePartOne(): Int {
        for (l in input) {
            setInitialState(l.split(","))
        }
        simulateDays(80)
        return lanternFishList.size
    }

    fun SolvePartTwo(): Long {
        return solveByArray(256, input[0].split(","))
    }
}