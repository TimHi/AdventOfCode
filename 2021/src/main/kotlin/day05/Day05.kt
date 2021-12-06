package day05

class Pipe(xStart: Int, yStart: Int, xEnd: Int, yEnd: Int) {
    val xStart = xStart
    val yStart = yStart
    val xEnd = xEnd
    val yEnd = yEnd
}

class Day05(_input: List<String>) {
    private var input: List<String> = _input
    private var pipeList: MutableList<Pipe> = emptyList<Pipe>().toMutableList()
    private var collisions: HashMap<Pair<Int, Int>, Int> = HashMap()

    private fun fillPipeList(isPartOne: Boolean) {
        pipeList = emptyList<Pipe>().toMutableList()
        for (line in input) {
            var coordinates = line.split(" -> ") // "0,9"   "5,9"
            val startCoordinates = coordinates[0].split(",")
            val endCoordinates = coordinates[1].split(",")
            val xStart = startCoordinates[0].toInt()
            val yStart = startCoordinates[1].toInt()
            val xEnd = endCoordinates[0].toInt()
            val yEnd = endCoordinates[1].toInt()
            if (isPartOne) {
                if (xStart == xEnd || yStart == yEnd) {
                    pipeList.add(Pipe(xStart, yStart, xEnd, yEnd))
                }
            } else {
                pipeList.add(Pipe(xStart, yStart, xEnd, yEnd))
            }
        }
    }

    private fun sumCollisions(x: Int): Int {
        var sum = 0
        collisions.forEach { (_, u) -> if (u >= x) sum += 1 }
        return sum
    }

    fun SolvePartOne(): Int {
        fillPipeList(true)
        for (pipe in pipeList) {
            val pointListPipe = GetPointList(pipe)
            pointListPipe.forEach { p -> addOrIncrementPoint(p) }
        }
        return sumCollisions(2)
    }

    fun SolvePartTwo(): Int {
        fillPipeList(false)
        collisions = HashMap()
        for (pipe in pipeList) {
            val pointListPipe = GetPointList(pipe)
            pointListPipe.forEach { p -> addOrIncrementPoint(p) }
        }
        return sumCollisions(2)
    }

    private fun addOrIncrementPoint(point: Pair<Int, Int>) {
        if (collisions.containsKey(point)) {
            collisions[point] = collisions[point]!!.plus(1)
        } else {
            collisions[point] = 1
        }
    }

    private fun GetPointList(pipe: Pipe): List<Pair<Int, Int>> {
        var returnList: MutableList<Pair<Int, Int>> = emptyList<Pair<Int, Int>>().toMutableList()
        //Horizontal
        if (pipe.yStart == pipe.yEnd) {
            if (pipe.xStart < pipe.xEnd) {
                for (i in (pipe.xStart..pipe.xEnd)) {
                    returnList.add(Pair(i, pipe.yStart))
                }
            } else {
                for (i in (pipe.xEnd..pipe.xStart)) {
                    returnList.add(Pair(i, pipe.yStart))
                }
            }
        } else if (pipe.xStart == pipe.xEnd) { //Vertically
            if (pipe.yStart < pipe.yEnd) {
                for (i in (pipe.yStart..pipe.yEnd)) {
                    returnList.add(Pair(pipe.xStart, i))
                }
            } else {
                for (i in (pipe.yEnd..pipe.yStart)) {
                    returnList.add(Pair(pipe.xStart, i))
                }
            }
        } else { //Diagonal
            if (pipe.xStart < pipe.xEnd && pipe.yStart > pipe.yEnd) { //Diag up right
                for (i in (pipe.xStart..pipe.xEnd)) {
                    var index = i - pipe.xStart
                    val key = Pair(pipe.xStart + index, pipe.yStart - index)
                    returnList.add(key)
                }
            }
            if (pipe.xStart < pipe.xEnd && pipe.yStart < pipe.yEnd) { //Diag down right
                for (i in (pipe.xStart..pipe.xEnd)) {
                    var index = i - pipe.xStart
                    val key = Pair(pipe.xStart + index, pipe.yStart + index)
                    returnList.add(key)
                }
            }
            if (pipe.xStart > pipe.xEnd && pipe.yStart < pipe.yEnd) { //Diag down left
                for (i in (pipe.xEnd..pipe.xStart)) {
                    var index = i - pipe.xEnd
                    val key = Pair(pipe.xStart - index, pipe.yStart + index)
                    returnList.add(key)
                }
            }
            if (pipe.xStart > pipe.xEnd && pipe.yStart > pipe.yEnd) { //Diag up left
                for (i in (pipe.xEnd..pipe.xStart)) {
                    var index = i - pipe.xEnd
                    val key = Pair(pipe.xStart - index, pipe.yStart - index)
                    returnList.add(key)
                }
            }
        }
        return returnList
    }
}