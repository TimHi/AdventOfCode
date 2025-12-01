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
}