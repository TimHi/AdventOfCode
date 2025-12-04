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

fun getSumOfNeighboursButCheckIfItWasRemoved(map: HashMap<Point, Boolean>, p: Point, removed: Boolean?): Int {
    if(removed != null && removed) return 5;
    var sum = 0
    if(map.containsKey(Point(p.x - 1, p.y)) && map[Point(p.x - 1, p.y)] == false) sum++; //Left
    if(map.containsKey(Point(p.x + 1, p.y)) && map[Point(p.x + 1, p.y)] == false) sum++; //Right, Left eyyoo captain jack
    if(map.containsKey(Point(p.x - 1, p.y - 1)) && map[Point(p.x - 1, p.y - 1)] == false) sum++; //Top left
    if(map.containsKey(Point(p.x + 1, p.y - 1)) && map[Point(p.x + 1, p.y -1)] == false) sum++;// Top right
    if(map.containsKey(Point(p.x + 1, p.y + 1)) && map[Point(p.x + 1, p.y + 1)] == false) sum++; //Down right
    if(map.containsKey(Point(p.x - 1, p.y + 1)) && map[Point(p.x - 1, p.y + 1)] == false) sum++; //Down left
    if(map.containsKey(Point(p.x, p.y + 1)) && map[Point(p.x, p.y + 1)] == false) sum++; //Down
    if(map.containsKey(Point(p.x, p.y - 1)) && map[Point(p.x, p.y - 1)] == false) sum++; //Up
    return sum
}