package day03

fun readFile(path: String): List<String> {
    val ranges = mutableListOf<String>();
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        ranges.add(it)
    }
    return ranges
}

fun main() {
    println("Day 03:")
    println("Sample Part 01:")
    partOne(true)
    println("Real Input Part 01:")
    partOne(false)
    println("Sample Part 02:")
    partTwo(true)
    println("Real Input Part 02:")
    partTwo(false)


}

fun getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurrence(a: List<Int>): Int {
    val highestNumber = a.maxOrNull()
    return a.indexOfFirst { it == highestNumber }
}

fun partOne(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day03/sample.txt" else "/day03/input.txt";
    val bat = readFile(path)
    bat.forEach {
        val iList1 = it.split("").filter { l -> l.isNotEmpty() && l.isNotBlank() }
        val iList = iList1.map { n -> n.toInt() }
        val noEnd = iList.subList(0, iList.size - 1)
        val highestNumber = getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurrence(noEnd)
        val restOfTheBattery = iList.subList(highestNumber + 1, iList.size)
        val secondHighestNumber = getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurrence(restOfTheBattery)
        val putTogether =
            listOf(noEnd[highestNumber].toString(), restOfTheBattery[secondHighestNumber].toString()).joinToString("")
        sum += putTogether.toInt()
    }
    println("Output joltage $sum")
}

fun partTwo(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day03/sample.txt" else "/day03/input.txt";
    val bat = readFile(path)
    bat.forEach {
        val iList1 = it.split("").filter { l -> l.isNotEmpty() && l.isNotBlank() }.map { n -> n.toInt() }
        var checkList = iList1
        val batteryRange = 12
        val batteryDigits = mutableListOf<Int>()

        for (r in batteryRange downTo 1) {
            val highestNumberIndex = getIndexOfHighestNumberInRange(checkList, r)
            batteryDigits.add(checkList[highestNumberIndex])

            //We have the highest number, now build from sublist
            checkList = checkList.subList(highestNumberIndex + 1, checkList.size)
        }

        val builtNum = batteryDigits.joinToString("")
        sum += builtNum.toLong()
    }

    println("Sum: $sum")
}

fun getIndexOfHighestNumberInRange(list: List<Int>, range: Int): Int {
    var checkList = list
    var highestNumberIndex = 0
    while (true) {
        highestNumberIndex = getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurrence(checkList)
        if ((highestNumberIndex + range) >= list.size + 1) {
            checkList = list.subList(0, highestNumberIndex)
        } else {
            break
        }
    }
    return highestNumberIndex
}
