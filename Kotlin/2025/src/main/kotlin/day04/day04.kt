package day04

data class Point (val x: Int, val y: Int)

fun readFile(path: String): HashMap<Point, Boolean> {
    val map = HashMap<Point, Boolean>();
    var y = 0;
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val splitChars = it.toCharArray()
        for(x in splitChars.indices) {
            if(splitChars[x] == '@') map[Point(x, y)] = false
        }
        y++;
    }
    return map
}

fun main() {
    println("Day 04:")
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
    var sum = 0
    val path = if (sampleFlag) "/day04/sample.txt" else "/day04/input.txt";
    val map = readFile(path)
    map.forEach { (t) ->
        val sumOfNeighbours = getSumOfNeighboursButCheckIfItWasRemoved(map, t, null)
        if(sumOfNeighbours < 4) sum++;
    }
    println("$sum rolls can be accessed by an elf on a forklift")
}

fun partTwo(sampleFlag: Boolean) {
    var sum = 0
    val path = if (sampleFlag) "/day04/sample.txt" else "/day04/input.txt";
    val map = readFile(path)

    while(true) {
        var deletedFlag = false;
        map.forEach { (t, u) ->
            val sumOfNeighbours = getSumOfNeighboursButCheckIfItWasRemoved(map, t, u)
            if (sumOfNeighbours < 4) {
                sum++;
                map[t] = true
                deletedFlag = true;
            }
        }
        if(!deletedFlag) break;

    }
    println("$sum rolls can be accessed by an elf on a forklift")
}
fun getSumOfNeighboursButCheckIfItWasRemoved(map: Map<Point, Boolean>, p: Point, removed: Boolean?): Int {
    if (removed == true) return 5

    val directions = listOf(
        Point(-1, 0), Point(1, 0),   // Left, Right
        Point(-1, -1), Point(1, -1), // Top-left, Top-right
        Point(1, 1), Point(-1, 1),   // Down-right, Down-left
        Point(0, 1), Point(0, -1)    // Down, Up
    )

    var sum = 0
    for (d in directions) {
        val neighbour = Point(p.x + d.x, p.y + d.y)
        if (map[neighbour] == false) {
            sum++
        }
    }

    return sum
}
