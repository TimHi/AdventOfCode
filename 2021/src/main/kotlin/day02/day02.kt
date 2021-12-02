package day02

class Day02  (_input: List<String>){
    private var input: List<String> = _input
    private var depth: Int = 0
    private var horizontal: Int = 0
    private var aim = 0

    fun SolvePartOne(): Int{
        for (instruction in input) {
            var move = instruction.split(" ").get(0)
            var amount = instruction.split(" ").get(1).toInt()

            when (move) {
                "forward" -> horizontal += amount
                "down" -> depth += amount
                "up" -> depth -= amount
                else -> {
                    print("Instruction unkown")
                }
            }
        }
        return depth * horizontal
    }

    fun SolvePartTwo(): Int {
        horizontal = 0
        depth = 0
        for (instruction in input) {
            var move = instruction.split(" ").get(0)
            var amount = instruction.split(" ").get(1).toInt()

            when (move) {
                "forward" -> {horizontal += amount; depth += (aim * amount);}
                "down" -> aim += amount
                "up" -> aim -= amount
                else -> {
                    print("Instruction unkown")
                }
            }
        }
        return depth * horizontal
    }
}