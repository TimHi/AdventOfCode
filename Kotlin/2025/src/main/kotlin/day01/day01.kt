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
    //println("Real Input Part 02:")
    //partTwo(false)
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

fun partTwo(sampleFlag: Boolean) {
    val path = if (sampleFlag) "/day01/sample.txt" else "/day01/input.txt";
    val turns = readFile(path)
    var dial = 50
    var zeroHits = 0

    turns.forEach {
        println(it)
        val hits = hitsWhileDialing(it, dial)
        println("Hits: $hits")
        zeroHits += hits
        if (it.direction) {
            dial += it.steps
        } else {
            dial -= it.steps
        }

        dial = dial.mod(100)
        if (dial == 0 && hits == 0) zeroHits++
        println("Dial now: $dial")
    }

    println("Result: $zeroHits")
}

fun hitsWhileDialing(turn: Turn, dial: Int): Int {
    var total = 0
    var hits = 0
      if (turn.direction) {
          total = dial + turn.steps
          hits = total / 100
      }
    else {
        total = dial - turn.steps
        if (total < 0){
            hits++
        }
          hits += abs(total) / 100
    }

    return hits
}
//4350 too low
//4960 not right
//6242 too high

/* Cooked Sample:
L150 3 während spinnen, steht danach auf der 0

L68
L30
R48
L5
R60
L55
L1
L99
R14
L82

 */