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
       if(it.direction) {
           val delta = 100 - dial
           if (delta == it.steps) {
               zeroHits++
               dial = 0
           } else if (it.steps > delta) {
                val tSteps = it.steps - delta
               val dialTurns = tSteps / 100
               if (dialTurns == 0) zeroHits++
               else zeroHits += dialTurns

               dial += it.steps
               dial = dial.mod(100)
               if(dial == 0) zeroHits++
           } else {
               dial += it.steps
           }
       } else {
           var delta = dial
           if(delta == 0) delta = 100
           if (delta == it.steps) {
            zeroHits++
               dial = 0
           } else if (it.steps > delta) {
               val tSteps = it.steps - delta
               val dialTurns = tSteps / 100
               if (dialTurns == 0) zeroHits++
               else zeroHits += dialTurns

               dial -= it.steps
               dial = dial.mod(100)
               if(dial == 0) zeroHits++
           } else {
               dial -= it.steps
           }
       }
    }

    println("Result: $zeroHits")
    return zeroHits
}

//4150
//4350 too low
//4960 not right
//5222
//5436
//5585
//5819
//6223
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
