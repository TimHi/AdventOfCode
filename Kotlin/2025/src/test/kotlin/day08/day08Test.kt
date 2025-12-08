package day08


import kotlin.test.Test
import kotlin.test.assertEquals

class Day08Test {
    @Test
    fun testDistance() {
        val a = Point3D(162, 817, 812)
        val b = Point3D(425, 690, 689)
        val result = dist(a, b)
        assertEquals(316.90219311326956, result)
    }
}