package day01

import kotlin.test.Test
import kotlin.test.assertEquals
import io.mockk.every
import io.mockk.mockkStatic

class Day01Test {

    @Test
    fun testPartTwoNoOverflow() {
        mockkStatic("day01.Day01Kt")
        val mockedTurns = listOf(Turn(false, 10))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(0, result)
    }

    @Test
    fun testPartTwoOneOverflowLeft() {
        mockkStatic("day01.Day01Kt")
        val mockedTurns = listOf(Turn(false, 51))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(1, result)
    }

    @Test
    fun testPartTwoMultiple() {
        mockkStatic("day01.Day01Kt")
        //L51 -> 99, 1x über 0
        //L199 -> 0, 1x über 0, steht danach auf 0
        val mockedTurns = listOf(Turn(false, 51), Turn(false, 199))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(3, result)
    }

    @Test
    fun testPartTwoEdge() {
        mockkStatic("day01.Day01Kt")
        //50 - 450 = -400 //4 hits
        // -400 % 100 = 0
        val mockedTurns = listOf(Turn(false, 450))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(5, result)
    }

    @Test
    fun testPartTwoOverUnder() {
        mockkStatic("day01.Day01Kt")
        val mockedTurns = listOf(Turn(false, 50), Turn(true, 200))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(3, result)
    }

    @Test
    fun testPartZeros() {
        mockkStatic("day01.Day01Kt")
        // 50 -> 0 | 1
        // 0 -> 0 | 1 -> 2
        // 0 -> 1 | 2
        // 1 -> 0 | 2 -> 4
        val mockedTurns = listOf(Turn(false, 50), Turn(true, 100), Turn(true, 1), Turn(false, 101))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(4, result)
    }

    @Test
    fun testPartZero() {
        mockkStatic("day01.Day01Kt")
        // 50 -> 0 | 1
        // 0 -> 0 | 1 -> 2
        val mockedTurns = listOf(Turn(false, 50), Turn(true, 100))
        every { readFile("/day01/sample.txt") } returns mockedTurns
        val result = partTwo(true)
        assertEquals(2, result)
    }
}