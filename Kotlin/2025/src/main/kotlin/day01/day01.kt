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

fun partTwo(sampleFlag: Boolean): Int {
    val path = if (sampleFlag) "/day01/sample.txt" else "/day01/input.txt";
    val turns = readFile(path)
    var dial = 50
    var zeroHits = 0

    turns.forEach {

        val hits = hitsWhileDialing(it, dial)

        if (it.direction) {
            dial += it.steps
        } else {
            dial -= it.steps
        }

        dial = dial.mod(100)

        if(it.direction) {
            println("The dial is rotated R${it.steps} to point at $dial")
        }else {
            println("The dial is rotated L${it.steps} to point at $dial")
        }


        if (dial == 0){
            zeroHits++
            if(hits > 1) {
                zeroHits += hits
            }
        }
        else {
            if(hits != 0) println("during this rotation, it points at 0 $hits times")
            zeroHits += hits
        }
    }

    println("Result: $zeroHits")
    return zeroHits
}

fun hitsWhileDialing(turn: Turn, dial: Int): Int {
    var total = 0
    var hits = 0
    if(dial == 0) return 0
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
//4150
//4350 too low
//4960 not right
//5222
//5436
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
