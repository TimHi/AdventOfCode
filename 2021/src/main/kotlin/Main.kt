import day01.Day01
import day02.Day02
import java.io.File


fun readFileAsLinesUsingBufferedReader(fileName: String): List<String>
        = 2021::class.java.getResource(fileName).readText().lines()
fun main(args: Array<String>) {
    /*
    var day01 = Day01(readFileAsLinesUsingBufferedReader("day01_input.txt"));
    val part01 = day01.solvePartOne()
    println("Day 01 Part 01: $part01")
    val part02 = day01.solvePartTwo()
    println("Day 01 Part 02: $part02")
    */
     var day02 = Day02(readFileAsLinesUsingBufferedReader("day02_input.txt"))
     val day02part1 = day02.SolvePartOne()
     println("Day 02 Part 01: $day02part1")
     val day02part2 = day02.SolvePartTwo()
     println("Day 02 Part 02: $day02part2")
}