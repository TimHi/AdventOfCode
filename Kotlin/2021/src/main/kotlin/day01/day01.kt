package day01

class Day01 (_input: List<String>){
    private var input: List<String> = _input

    fun solvePartOne(): Int {
        var previousMeasurement = 0
        var increaseCounter = 0
        for(line in input){
            if (line.toInt() > previousMeasurement && previousMeasurement != 0)
                increaseCounter++
            previousMeasurement = line.toInt()
        }
        return increaseCounter
    }

    fun solvePartTwo(): Int {
        var currentGroup = 0
        var previousGroup = 0
        var increaseCounter = 0
        for((groupCounter, line) in input.withIndex()) {
            currentGroup = line.toInt()
            if(input.size > groupCounter + 1){
                currentGroup += input[groupCounter + 1].toInt()
            }

            if(input.size > groupCounter + 2){
                currentGroup += input[groupCounter + 2].toInt()
            }

            if(currentGroup > previousGroup && previousGroup != 0){
                increaseCounter++;
            }

            previousGroup = currentGroup
        }
        return increaseCounter
    }
}