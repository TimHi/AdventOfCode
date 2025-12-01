package day01

import kotlin.math.abs

//Dir false = left
data class Turn(val direction: Boolean, val steps: Int)


fun readFile(path: String): List<Turn>{
    val turns = mutableListOf<Turn>();
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val direction = it[0] == 'R'
        val steps = it.substring(1, it.length).toInt()
        turns.add(Turn(direction, steps))
    }
    return turns
}

fun main() {
    println("Day 01:")
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
    val path = if(sampleFlag) "/day01/sample.txt" else "/day01/input.txt";
    val turns = readFile(path)
    var dial = 50
    var zeroHits = 0

    turns.forEach {
        if (it.direction) {
            dial += it.steps
        } else {
            dial -= it.steps
        }

        dial = dial.mod(100)
        if (dial == 0) zeroHits++
    }

    println(zeroHits)

}

fun partTwo(sampleFlag: Boolean): Int {
    val path = if (sampleFlag) "/day01/sample.txt" else "/day01/input.txt";
    val turns = readFile(path)
    var dial = 50
    var zeroHits = 0


    turns.forEach {
        var tCounter = 0
        val dir = if(it.direction) "R" else "L"

        if(it.direction) {
            if(dial == 100) dial = 0
         for (i in 0..<it.steps) {
             dial++
             if(dial == 100) {
                 dial = 0
                 zeroHits++
                 tCounter++
             }

         }
     } else {
         if(dial == 0) dial = 100
         for (i in 0..<it.steps) {
             dial--
             if (dial == 0) {
                 zeroHits++
                 tCounter++
                 dial = 100
             }
         }
     }
        if(tCounter == 0)
        println("The dial is rotated $dir${it.steps} to point at $dial")
        else {
            println("The dial is rotated $dir${it.steps} to point at $dial; during this rotation, it points at zero: $tCounter times.")
        }
    }

    println("Result: $zeroHits")
    return zeroHits
}

