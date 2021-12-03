package day03

class Day03 (_input: List<String>){
    private var input: List<String> = _input
    private var gamma = MutableList(input[0].length){ 0 }
    fun SolvePartOne(): Int{
        var counter = 0
        for(value in input){
            for(char in value.chars()){
                if(char == 49){ //'1'
                    gamma[counter] = gamma[counter] + 1
                }
                counter++
            }
            counter = 0;
        }
        var gammaString = ""
        for(c in gamma){
            gammaString += if(c > input.size - c){
                "1"
            }else{
                "0"
            }
        }
        var epsilonString = ""
        gammaString.forEach { c->
            run {
                epsilonString += if (c == '1') {
                    "0"
                } else {
                    "1"
                }
            }
        }
        return Integer.parseInt(gammaString, 2) * Integer.parseInt(epsilonString, 2)
    }
}