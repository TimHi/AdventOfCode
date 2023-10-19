package day04


class Day04(_input: List<String>) {
    private var input: List<String> = _input
    var boardList: MutableList<MutableList<MutableList<Int>>> =
        emptyList<MutableList<MutableList<Int>>>().toMutableList()
    var board: MutableList<MutableList<Int>> = emptyList<MutableList<Int>>().toMutableList()
    var bingoNumbers: List<Int> = emptyList<Int>().toMutableList()
    private val marker: Int = -1

    fun fillBoards() {

        boardList = emptyList<MutableList<MutableList<Int>>>().toMutableList()
        board = emptyList<MutableList<Int>>().toMutableList()
        bingoNumbers = emptyList<Int>().toMutableList()

        bingoNumbers = input[0].split(",").map { it.toInt() }

        for ((index, line) in input.withIndex()) {
            if (index > 1) {
                if (line == "") {
                    boardList.add(board)
                    board = emptyList<MutableList<Int>>().toMutableList()
                } else {
                    var boardLineString = line.split(" ").toMutableList()
                    boardLineString.removeIf { num -> num == "" }
                    var boardLine = boardLineString.map { it.toInt() }
                    board.add(boardLine.toMutableList())
                }
            }
        }
    }

    private fun sumOfUnmarked(boardIndex: Int): Int {
        val boardToSum = boardList[boardIndex]
        var sum = 0
        for (line in boardToSum) {
            for (n in line) {
                if (n != -1) {
                    sum += n
                }
            }
        }
        return sum
    }

    private fun checkBoards(boardIndex: Int): Boolean {
        var isRowMarker = false
        val boardToCheck = boardList[boardIndex]
        for (line in boardToCheck) {
            if (line.filter { n -> n == marker }.size == line.size) {
                return true
            }
        }

        for (line in boardToCheck) {
            if (line[0] == marker) {
                isRowMarker = true
            } else {
                isRowMarker = false
                break
            }
        }
        return isRowMarker
    }

    fun SolvePartTwo(): Int {
        fillBoards()
        var finishedBoards = emptyList<Int>().toMutableList()
        var lastBoard = 0
        for (bingoNumber in bingoNumbers) {
            for ((boardIndex, _board) in boardList.withIndex()) {
                if (!finishedBoards.contains(boardIndex)) {
                    for ((lineIndex, line) in _board.withIndex()) {
                        for ((numIndex, number) in line.withIndex()) {
                            if (bingoNumber == number) {
                                boardList[boardIndex][lineIndex][numIndex] = marker
                                val isWinner = checkBoards(boardIndex)
                                if (isWinner) {
                                    finishedBoards.add(boardIndex)
                                    lastBoard = bingoNumber * sumOfUnmarked(boardIndex)
                                }
                            }
                        }
                    }
                }
            }
        }
        return lastBoard
    }

    fun SolvePartOne(): Int {
        fillBoards()
        for (bingoNumber in bingoNumbers) {
            for ((boardIndex, _board) in boardList.withIndex()) {
                for ((lineIndex, line) in _board.withIndex()) {
                    for ((numIndex, number) in line.withIndex()) {
                        if (bingoNumber == number) {
                            boardList[boardIndex][lineIndex][numIndex] = marker
                            val isWinner = checkBoards(boardIndex)
                            if (isWinner) {
                                return bingoNumber * sumOfUnmarked(boardIndex)
                            }
                        }
                    }
                }
            }
        }
        return 0
    }
}