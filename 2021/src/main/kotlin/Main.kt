import day03.Day03
import day04.Day04
import day05.Day05
import day06.Day06
import day07.Day07
import day08.Day08
import day09.Day09


fun readInput(fileName: String): List<String>
        = 2021::class.java.getResource(fileName).readText().lines()
fun main(args: Array<String>) {
    /*
    var day01 = Day01(readFileAsLinesUsingBufferedReader("day01_input.txt"));
    val part01 = day01.solvePartOne()
    println("Day 01 Part 01: $part01")
    val part02 = day01.solvePartTwo()
    println("Day 01 Part 02: $part02")

     var day02 = Day02(readFileAsLinesUsingBufferedReader("day02_input.txt"))
     val day02part1 = day02.SolvePartOne()
     println("Day 02 Part 01: $day02part1")
     val day02part2 = day02.SolvePartTwo()
     println("Day 02 Part 02: $day02part2")

     var day03 = Day03(readInput("day03_input.txt"))
     val day03part1 = day03.SolvePartOne();
     println("Day 03 Part 01: $day03part1")
     val day03part2 = day03.SolvePartTwo();
     println("Day 03 Part 02: $day03part2")

     var day04 = Day04(readInput("day04_input.txt"))
     val day04part1 = day04.SolvePartOne()
     println("Day 04 Part 01: $day04part1")
     val day04part2 = day04.SolvePartTwo()
     println("Day 04 Part 02: $day04part2")

     var day05 = Day05(readInput("day05_input.txt"))
     val day05part1 = day05.SolvePartOne()
     println("Day 05 Part 01: $day05part1")
     val day05part2 = day05.SolvePartTwo()
     println("Day 05 Part 02: $day05part2")

     var day06 = Day06(readInput("day06_input.txt"))
     val day06part1 = day06.SolvePartOne()
     println("Day 06 Part 01: $day06part1")
     val day06part2 = day06.SolvePartTwo()
     println("Day 06 Part 02: $day06part2")

     var day07 = Day07(readInput("day07_input.txt"))
     val day07part1 = day07.SolvePartOne()
     println("Day 07 Part 01: $day07part1")
     val day07part2 = day07.SolvePartTwo()
     println("Day 07 Part 02: $day07part2")

     var day08 = Day08(readInput("day08_input.txt"))
     val day08part1 = day08.SolvePartOne()
     println("Day 08 Part 01: $day08part1")
     val day08part2 = day08.SolvePartTwo()
     println("Day 08 Part 02: $day08part2")

     */
     var day09 = Day09(readInput("day09_input.txt"))
     val day09part1 = day09.solvePartOne()
     println("Day 09 Part 01: $day09part1")
     val day09part2 = day09.solvePartTwo()
     println("Day 09 Part 02: $day09part2")
}