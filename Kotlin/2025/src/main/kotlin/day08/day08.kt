package day08

import kotlin.math.pow
import kotlin.math.sqrt

data class Point3D(val x: Int, var y: Int, val z: Int)

fun parsePoints(path: String): MutableList<Point3D> {
    val grid = mutableListOf<Point3D>();

    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val splits = it.split(",")
        grid.add(Point3D(splits[0].toInt(), splits[1].toInt(), splits[2].toInt()))
    }
    return grid
}

fun dist(a: Point3D, b: Point3D): Double {
    return sqrt((b.x - a.x).toDouble().pow(2) + (b.y - a.y).toDouble().pow(2) + (b.z - a.z).toDouble().pow(2))
}

fun main() {
    println("Day 08:")
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
    val path = if (sampleFlag) "/day08/sample.txt" else "/day08/input.txt";
    val unconnectedPoints = parsePoints(path)
    val distances = hashMapOf<Point3D, HashMap<Point3D, Double>>()
    val neighbourMap = hashMapOf<Point3D, Point3D>()
    unconnectedPoints.forEach { a ->
        val distMap = hashMapOf<Point3D, Double>()
        unconnectedPoints.forEach { b ->
            val distance = dist(a, b)
            if (distance != (0.0)) distMap[b] = distance
        }
        distances[a] = distMap
    }

    distances.forEach { (t, u) ->
        var minD = Double.MAX_VALUE
        var p: Point3D? = null
        u.forEach { (cKey, cV) ->
            if (cV < minD) {
                minD = cV
                p = cKey
            }
        }
        if (p != null) neighbourMap[t] = p!!
        else throw Error("No Neighbor for ${formatPoint3D(t)} found")
        println("Point ${formatPoint3D(t)} has nearest neighbor ${formatPoint3D(p)}")
    }

    val cluster = mutableListOf<MutableList<Point3D>>()
    unconnectedPoints.forEach { p -> cluster.add(mutableListOf(p)) }

    for (i in 0..<10) {
        println(i)
        val singlePoints = cluster.find { c -> c.size == 1 }
        val singlePoint = singlePoints!![0]
        val n = neighbourMap[singlePoint]!!
        val foundCluster = cluster.find { c -> c.contains(n) }
        if (foundCluster != null) {
            foundCluster.add(singlePoint)
            val singlePointIndex = cluster.indexOfFirst { c -> c.size == 1 && c.contains(singlePoint) }
            cluster.removeAt(singlePointIndex)
        } else {
            println("WTF")
        }
    }


    var clusterSizeAdded = 0
    cluster.forEach { c -> clusterSizeAdded += c.size }
    cluster.sortBy { -it.size }
    //Cluster is 4, 3, 3, should be 5, 3, 2
    val topThreeCluster = cluster.subList(0, 3)
    println("Donezo")
}

fun formatPoint3D(p: Point3D?): String {
    return if (p == null) "null"
    else "${p.x},${p.y},${p.z}"
}

fun partTwo(sampleFlag: Boolean) {
    val path = if (sampleFlag) "/day08/sample.txt" else "/day08/input.txt";
    val unconnectedPoints = parsePoints(path)

}
