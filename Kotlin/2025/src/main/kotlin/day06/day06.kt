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
            operands = splitLine.map { c -> c.toString() }.toMutableList()
        }
    };

    //Now do the fucking numbers
    {}.javaClass.getResourceAsStream(path)?.bufferedReader()?.forEachLine {
        val splitLine = it.toList()

        if (!isOperandLine(it)) {
            if (splitLine.size != operands.size) throw Error("Fucked it")
            val n = mutableListOf<Number>()
            var currentNum = ""
            for (x in splitLine.indices) {
                if (x > 0 && (operands[x] == "+" || operands[x] == "*")) {
                    val strippedEnd = currentNum.substring(0, currentNum.length - 1)
                    val isLeft = strippedEnd[0] == ' '
                    n.add(Number(strippedEnd.filter { f -> f != ' ' }.toLong(), isLeft))
                    currentNum = splitLine[x].toString()
                } else {
                    currentNum += splitLine[x]
                }
            }

            val isLeft = currentNum[0] == ' '
            n.add(Number(currentNum.filter { f -> f != ' ' }.toLong(), isLeft))
            numRows.add(n)
        }
    }


    return MathHomeWork(numRows, operands.filter { o -> o != " " }.toMutableList(), operandGap)
}

fun isOperandLine(line: String): Boolean {
    val firstChar = line.toCharArray()[0];
    return firstChar == '+' || firstChar == '*'
}

fun main() {
    println("Day 06:")
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
    val path = if (sampleFlag) "/day06/sample.txt" else "/day06/input.txt";
    val homeWork = parseHomework(path)
    val grandTotal = doCorrectHomework(homeWork)
    println("Grand total: $grandTotal")
}

fun doCorrectHomework(homeWork: MathHomeWork): Long {
    val grandTotals = mutableListOf<Long>()
    for (x in homeWork.operands.indices) {
        val operand = homeWork.operands[x]
        var intermediateGrandTotal = if (operand == "+") 0L else 1L
        val intNums = mutableListOf<Number>()

        var longestNumberInSplit = 0
        for (y in homeWork.numRows.indices) {
            val num = homeWork.numRows[y][x]
            intNums.add(num)
            if (num.num.toString().length > longestNumberInSplit) longestNumberInSplit = num.num.toString().length
        }

        //Pad left or right with X
        val pad = if (operand == "+") "X" else "X"
        val paddedNumbers = mutableListOf<String>()
        intNums.forEach { n ->
            if (n.num.toString().length < longestNumberInSplit) {
                val missingPadding = longestNumberInSplit - n.num.toString().length
                var tNum = if (n.left) "" else n.num.toString()

                for (p in 0..<missingPadding) {
                    tNum += pad
                }

                if (n.left) {
                    tNum += n.num.toString()
                }
                paddedNumbers.add(tNum)
            } else paddedNumbers.add(n.num.toString())
        }

        //Build numbers by going -> then V and filtering the padded X
        val builtNumbers = mutableListOf<Long>()
        for (c in 0..<paddedNumbers[0].length) {
            var built = ""
            for (y in 0..<paddedNumbers.size) {
                built += paddedNumbers[y][c]
            }
            builtNumbers.add(built.filter { b -> b != 'X' }.toLong())
        }

        //Sum up the shit
        builtNumbers.forEach { b ->
            if (operand == "+") intermediateGrandTotal += b
            else intermediateGrandTotal *= b
        }
        grandTotals.add(intermediateGrandTotal)
    }
    return grandTotals.sum()
}