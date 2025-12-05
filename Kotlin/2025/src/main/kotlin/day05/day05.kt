package day05

import kotlin.math.max
import kotlin.math.min

fun readFreshId(path: String): List<String> {
    val map = mutableListOf<String>();
    var ignore = false
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        if (it.isEmpty() || it.isBlank() || it == "\n") {
            ignore = true
        }
        if (!ignore) {
            map.add(it)
        }
    }
    return map
}

fun readAvailableIngredients(path: String, freshIds: List<String>): List<Long> {
    val availableIngredients = mutableListOf<Long>();
    var read = false
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        var found = false
        if (read) {
            freshIds.forEach { rawId ->
                if (!found) {
                    val lower = rawId.split("-")[0].toLong()
                    val upper = rawId.split("-")[1].toLong()
                    val num = it.toLong()
                    if (num in lower..upper) {
                        availableIngredients.add(num)
                        found = true
                    }
                }
            }
        }

        if (it.isEmpty() || it.isBlank()) {
            read = true
        }
    }
    return availableIngredients
}

fun main() {
    println("Day 05:")
    println("Sample Part 01:")
    partOne(true)
    println("Real Input Part 01:")
    partOne(false)
    println("Sample Part 02:")
    partTwo(true)
    println("Real Input Part 02:")
    partTwo(false)
}

fun partOne(sampleFlag: Boolean) {
    val path = if (sampleFlag) "/day05/sample.txt" else "/day05/input.txt";
    val freshIngredients = readFreshId(path)
    val availableIngredients = readAvailableIngredients(path, freshIngredients)
    println("${availableIngredients.size} of the available ingredients are fresh")
}

data class IngredientId(var lower: Long, var upper: Long)

fun partTwo(sampleFlag: Boolean) {
    var sum = 0L
    val path = if (sampleFlag) "/day05/sample.txt" else "/day05/input.txt";
    val freshIds = readFreshId(path)
    var ids = mutableListOf<IngredientId>()

    var min = 0L
    var max = 0L
    freshIds.forEach {
        val lower = it.split("-")[0].toLong()
        val upper = it.split("-")[1].toLong()

        if (upper > max) max = upper
        if (lower < min) min = lower
        ids.add(IngredientId(lower, upper))
    }

    //For some reason the sorting is needed, i did it randomly, cant be bothered to check why
    ids.sortBy { it.lower }

    //Merge IDs as long as its possible, after merging one, break and restart
    while (true) {
        val acceptedIds = mutableListOf<IngredientId>()
        var didUpdate = false
        for (i in 0..ids.size) {
            val a = ids[i]
            var b = IngredientId(0, 0)

            //Can't be arsed
            if (i + 1 != ids.size) b = ids[i + 1]
            //if its the last one it cant be merged, therefore just add it
            if (b.lower == 0L && b.upper == 0L) {
                acceptedIds.add(a)
                break;
            }
            if (isOverlapping(a, b)) {
                val merged = mergeOverlapping(a, b)
                val existing = acceptedIds.find { it.lower == merged.lower && it.upper == merged.upper }
                if (existing == null) {
                    acceptedIds.add(merged)
                    val restOf = ids.subList(i + 2, ids.size)
                    acceptedIds.addAll(restOf)
                    didUpdate = true
                    break
                }
            } else {
                val existing = acceptedIds.find { it.lower == a.lower && it.upper == a.upper }
                if (existing == null) {
                    acceptedIds.add(a)
                }
            }
        }

        if (didUpdate) {
            ids = acceptedIds
            ids.sortBy { it.lower }
        } else {
            break
        }
    }
    ids.forEach {
        sum = sum + it.upper - it.lower
    }
    sum += ids.size
    println("$sum ingredient IDs are considered to be fresh")
}

// 10-14 12-18 -> 10-18
fun mergeOverlapping(a: IngredientId, b: IngredientId): IngredientId {
    val min = min(a.lower, b.lower)
    val max = max(a.upper, b.upper)
    return IngredientId(min, max)
}

fun isOverlapping(a: IngredientId, b: IngredientId): Boolean {
    return a.lower <= b.upper && b.lower <= a.upper;
}
