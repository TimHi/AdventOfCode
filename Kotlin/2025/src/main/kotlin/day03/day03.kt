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

fun getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurence(a: List<Int>): Int {
    val highestNumber = a.maxOrNull()
    return a.indexOfFirst { it == highestNumber }
}

//23 42 34 23 42 34 27 8
//43 58 54 34 24 52 35 43 45 16 34 32 24 26 44 52 23 33 43 23 14 23 33
//44 34 44 44 34 34 54 45 65 43 42 54 47 43 43 54 42 33 44 32 24 45 45 43 44 69 63
fun partOne(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day03/sample.txt" else "/day03/input.txt";
    val bat = readFile(path)
    bat.forEach {
        val iList1 = it.split("").filter { l -> l.isNotEmpty() && l.isNotBlank() }
        val iList = iList1.map { n -> n.toInt() }
        val noEnd = iList.subList(0, iList.size - 1)
        val highestNumber = getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurence(noEnd)
        val restOfTheBattery = iList.subList(highestNumber + 1, iList.size)
        val secondHighestNumber = getIndexOfHighestNumberInIntArrayWhenIJustNeedTheFirstOccurence(restOfTheBattery)
        val putTogether = listOf(noEnd[highestNumber].toString(), restOfTheBattery[secondHighestNumber].toString()).joinToString("")
        sum += putTogether.toInt()
    }
    println("Output joltage $sum")
}

fun partTwo(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day03/sample.txt" else "/day03/input.txt";

    println("Sum: $sum")
}

