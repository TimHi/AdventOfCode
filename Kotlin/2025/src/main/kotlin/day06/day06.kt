package day06

data class Number(val num: Long, val left: Boolean)
class MathHomeWork(
    val numRows: MutableList<MutableList<Number>>,
    val operands: MutableList<String>,
    val operandGap: Int
)

fun parseHomework(path: String): MathHomeWork {
    val numRows = mutableListOf<MutableList<Number>>();
    var operands = mutableListOf<String>();
    var operandGap = 0

    //Get operands and width of the cols
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine { it ->
        val splitLine = it.toList()
        if (isOperandLine(it)) {
            for (r in 1..splitLine.size) {
                if (splitLine[r] == '+' || splitLine[r] == '*') {
                    operandGap = r - 1
                    break
                }
            }
            operands = splitLine.filter { c -> c != ' ' }.map { c -> c.toString() }.toMutableList()
        }
    };

    //Now do the fucking numbers
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val splitLine = it.toList()
        if (!isOperandLine(it)) {
            var tickTockTicker = 0
            var currentParsingNumber = ""
            val newList = mutableListOf<Number>()
            for (i in splitLine.indices) {
                if (i == 51) {
                    println("Oooa")
                }
                if (tickTockTicker < operandGap) {
                    currentParsingNumber += splitLine[i]
                    tickTockTicker++
                } else {
                    val isLeft = currentParsingNumber[0] != ' ';
                    val parsedNumber = currentParsingNumber.filter { n -> n != ' ' }.toLong()

                    newList.add(Number(parsedNumber, isLeft))

                    tickTockTicker = 0
                    currentParsingNumber = ""
                }
            }

            //add last num, fix later lol
            val isLeft = currentParsingNumber[0] != ' ';
            val parsedNumber = currentParsingNumber.filter { n -> n != ' ' }.toLong()

            newList.add(Number(parsedNumber, isLeft))
            numRows.add(newList)
        }
    }


    return MathHomeWork(numRows, operands, operandGap)
}

fun isOperandLine(line: String): Boolean {
    val firstChar = line.toCharArray()[0];
    return firstChar == '+' || firstChar == '*'
}

fun main() {
    println("Day 05:")
    println("Sample Part 01:")
    partOne(true)
    println("Real Input Part 01:")
    partOne(false)
    println("Sample Part 02:")
    //partTwo(true)
    println("Real Input Part 02:")
    //partTwo(false)
}

fun partOne(sampleFlag: Boolean) {
    val path = if (sampleFlag) "/day06/sample.txt" else "/day06/input.txt";
    val homeWork = parseHomework(path)
    val result = doHomework(homeWork)
    println("Grand total: $result")

}

fun doHomework(homeWork: MathHomeWork): Long {
    val grandTotals = mutableListOf<Long>()
    for (x in homeWork.operands.indices) {
        val operand = homeWork.operands[x]
        var intermediateGrandTotal = if (operand == "+") 0L else 1L
        for (y in homeWork.numRows.indices) {
            val num = homeWork.numRows[y][x]
            if (operand == "+") intermediateGrandTotal += num.num
            else intermediateGrandTotal *= num.num
        }
        grandTotals.add(intermediateGrandTotal)
    }
    return grandTotals.sum()
}

fun partTwo(sampleFlag: Boolean) {
    var sum = 0L
    val path = if (sampleFlag) "/day05/sample.txt" else "/day05/input.txt";
}
