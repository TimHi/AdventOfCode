package day02


fun readFile(path: String): List<String> {
    var ranges = mutableListOf<String>();
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        ranges = it.split(",").toMutableList()
    }
    return ranges
}

fun main() {
    println("Day 02:")
    println("Sample Part 01:")
    partOne(true)
    println("Real Input Part 01:")
    partOne(false)
    println("Sample Part 02:")
    partTwo(true)
    println("Real Input Part 02:")
    partTwo(false)
}

data class ID(val start: Long, val end: Long)

fun partOne(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day02/sample.txt" else "/day02/input.txt";
    val ids = readFile(path)
    ids.forEach {
        val id = parseId(it)
        for (i in id.start..id.end) {
            val stringId = i.toString()
            val firstHalf = stringId.substring(0, stringId.length / 2)
            val secondHalf = stringId.substring(stringId.length / 2, stringId.length)
            if (firstHalf == secondHalf) sum += i
        }
    }
    println("Sum of invalid IDs $sum")
}

fun partTwo(sampleFlag: Boolean) {
    var sum: Long = 0
    val path = if (sampleFlag) "/day02/sample.txt" else "/day02/input.txt";
    val ids = readFile(path)
    ids.forEach {
        val id = parseId(it)
        for (i in id.start..id.end) {
            val stringId = i.toString()
            val idList = stringId.toCharArray().toMutableList()

            val possibleCombinations = idList.size / 2
            for (comboLength in 1..possibleCombinations) {
                val splits = idList.chunked(comboLength)
                val comboNum = splits[0].joinToString()
                var isInvalidId = true

               splits.forEach { split ->
                   val joined = split.joinToString()
                   if (joined != comboNum) isInvalidId = false
               }

                if (isInvalidId) {
                   sum += i
                   break
                }
            }
        }
    }
    println("Sum: $sum")
}

fun parseId(rawId: String): ID {
    val splits = rawId.split("-")
    return ID(splits[0].toLong(), splits[1].toLong())
}