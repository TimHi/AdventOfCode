package day09

class Day09(private var input: List<String>) {
    private var heightMap: MutableList<MutableList<Int>> = emptyList<MutableList<Int>>().toMutableList()
    private var marker: MutableList<MutableList<Int>> = emptyList<MutableList<Int>>().toMutableList()
    private var lowPoints: MutableList<Int> = emptyList<Int>().toMutableList()
    private var basins: MutableList<Int> = emptyList<Int>().toMutableList()

    private fun populateHeightMap(){
        for (l in input){
            var row : MutableList<Int> = emptyList<Int>().toMutableList()
            var c = l.toCharArray()
            c.forEach { row.add(it.toString().toInt()) }
            heightMap.add(row)
        }
        println()
    }

    private fun isLowerThanAdjacent(x: Int, y: Int, num: Int): Boolean{
        var isLower = false
        var left = heightMap.getOrNull(y)?.getOrNull(x - 1)
        var right = heightMap.getOrNull(y)?.getOrNull(x + 1)
        var up = heightMap.getOrNull(y - 1)?.getOrNull(x)
        var down = heightMap.getOrNull(y + 1)?.getOrNull(x)
        //TODO: This should be possible in a nicer and smaller way
        if(left != null){
            if(num >= left){
                return false
            }else{
                isLower = true
            }
        }
        if(right != null){
            if(num >= right){
                return false
            }else{
                isLower = true
            }
        }
        if(up != null){
            if(num >= up){
                return false
            }else{
                isLower = true
            }
        }
        if(down != null){
            if(num >= down){
                return false
            }else{
                isLower = true
            }
        }
        return isLower
    }

    fun solvePartOne(): Int{
        populateHeightMap()
        for((y) in heightMap.withIndex()) {
            for ((x) in heightMap[y].withIndex()) {
                if(isLowerThanAdjacent(x, y, heightMap[y][x])){
                    lowPoints.add(heightMap[y][x])
                }
            }
        }
        return lowPoints.sum() + lowPoints.count()
    }

    private fun fillMarker(){
        marker = heightMap
    }

    private fun findBiggestBasins(){
        fillMarker()
        for((y) in heightMap.withIndex()) {
            for ((x) in heightMap[y].withIndex()) {
                detectBasin(x, y, heightMap[y][x])
                addBasinIfBigger(basinCounter)
                basinCounter = 0
            }
        }
    }
    private var basinCounter = 0
    private fun detectBasin(x: Int, y: Int, num: Int) {
        if(isPosOutOfBoundsOrMax(x, y)){
            return
        }
        if(marker[y][x] == 10){
            return
        }
        marker[y][x] = 10

        basinCounter += 1
        detectBasin(x + 1, y, num)
        detectBasin(x - 1, y, num)
        detectBasin(x, y + 1, num)
        detectBasin(x, y - 1, num)
    }


    private fun addBasinIfBigger(basinCounter: Int) {
        basins.add(basinCounter)
    }

    private fun isPosOutOfBoundsOrMax(x: Int, y: Int): Boolean {
        var pos = heightMap.getOrNull(y)?.getOrNull(x)
        return pos == null || pos == 9
    }

    fun solvePartTwo(): Int{
        findBiggestBasins()
        basins.sort()
        return basins[basins.size - 1] * basins[basins.size - 2] * basins[basins.size - 3]
    }
}