package day07

data class Point(val x: Int, var y: Int, val s: String)

fun parseGrind(path: String): List<List<Point>> {
    val grid = mutableListOf<List<Point>>();
    var y = 0;
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val splits = it.toList()
        val row = mutableListOf<Point>()
        for (x in splits.indices) {
            row.add(Point(x, y, splits[x].toString()))
        }
        grid.add(row)
        y++;
    }

    return grid
}


fun main() {
    println("Day 07:")
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
    val path = if (sampleFlag) "/day07/sample.txt" else "/day07/input.txt";
    val grid = parseGrind(path)
    var beamSum = 0
    val startPos = grid[0].find { p -> p.s == "S" }
    if (startPos == null) throw Error("Startpos undefined")
    var beamPos = mutableListOf(Point(startPos.x, startPos.y, "."))

    for (y in grid.indices) {
        val droppedBeamPos = mutableListOf<Point>()
        for (x in grid[y].indices) {

            val foundPoint = beamPos.find { p -> p.x == x && p.y == y }
            if (foundPoint != null && grid[y][x].s == "^") {
                beamSum++;
                droppedBeamPos.add(Point(x - 1, y + 1, "|"))
                droppedBeamPos.add(Point(x + 1, y + 1, "|"))
            } else if (foundPoint != null && grid[y][x].s == "." || grid[y][x].s == "S") {
                droppedBeamPos.add(Point(x, y + 1, "|"))
            } else if (foundPoint != null && grid[y][x].s != "." && grid[y][x].s != "^") {
                throw Error("Wtf: {$grid[y][x].s}")
            } else {
                // Do nothing?
            }
        }
        beamPos = droppedBeamPos
    }

    println("Beam splits: $beamSum times")
}


fun partTwo(sampleFlag: Boolean) {
    val path = if (sampleFlag) "/day07/sample.txt" else "/day07/input.txt";
    val grid = parseGrind(path)
    var beamSum = 0
    val startPos = grid[0].find { p -> p.s == "S" }
    if (startPos == null) throw Error("Startpos undefined")
    var beamPos = mutableListOf(Point(startPos.x, startPos.y, "."))

    //Worlds have to be for each line
    //now its 6 in the small sample, but it has to be 4, 6 because first split counts twice?
    var worlds = hashMapOf<Point, Int>()
    for (y in grid.indices) {
        val droppedBeamPos = mutableListOf<Point>()

        for (x in grid[y].indices) {
            val foundPoint = beamPos.find { p -> p.x == x && p.y == y }
            if (foundPoint != null && grid[y][x].s == "^") {

                val d1 = Point(x - 1, y + 1, foundPoint.s)
                val d2 = Point(x + 1, y + 1, foundPoint.s)

                worlds = checkAndUpdateWorld(d1, worlds)
                worlds = checkAndUpdateWorld(d2, worlds)

                droppedBeamPos.add(d1)
                droppedBeamPos.add(d2)
            } else if (foundPoint != null && grid[y][x].s == "." || grid[y][x].s == "S") {
                droppedBeamPos.add(Point(x, y + 1, grid[y][x].s))
            } else if (foundPoint != null && grid[y][x].s != "." && grid[y][x].s != "^") {
                throw Error("Wtf: {$grid[y][x].s}")
            } else {
                // Do nothing?
            }
        }
        beamPos = droppedBeamPos
    }

    worlds.forEach { (_, u) ->
        beamSum += u
    }
    println("Seperate Worlds: $beamSum")
}

fun checkAndUpdateWorld(p: Point, world: HashMap<Point, Int>): HashMap<Point, Int> {
    if (world.containsKey(p)) {
        val v = world[p]!!
        world[p] = v + 1
    } else {
        world[p] = 1
    }
    return world
}