package day03

class Day03 (_input: List<String>){
    private var input: List<String> = _input
    private var gamma = MutableList(input[0].length){ 0 }
    private var oxy_list :  MutableList<String> = emptyList<String>().toMutableList()
    private var CO2_list : MutableList<String> = emptyList<String>().toMutableList()
    private var oxygen_generator_rating : Int = 0
    private var CO2_scrubber_rating : Int = 0
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

    fun SolvePartTwo(): Int {
        for(value in input){
            oxy_list.add(value)
            CO2_list.add(value)
        }

        var counter = 0
        var oxy = MutableList(input[0].length){ 0 }
        for(value in input){
            for(char in value.chars()){
                if(char == 49){ //'1'
                    oxy[counter] = oxy[counter] + 1
                }
                counter++
            }
            counter = 0
        }


        for((i) in oxy.withIndex()){
            val majorityBitOxy = GetMajorityBitOxy(i)
            val majorityBitCO2 = GetMajorityBitCO2(i)
            if(oxy_list.size > 1) {
                oxy_list.removeIf { item -> item.chars().toArray()[i] != majorityBitOxy }
            }
            if(CO2_list.size > 1) {
                CO2_list.removeIf { item -> item.chars().toArray()[i] != majorityBitCO2 }
            }
        }

        return Integer.parseInt(oxy_list[0], 2) * Integer.parseInt(CO2_list[0], 2)
    }

    private fun GetMajorityBitCO2(i: Int): Int {
        val majority: Int
        var occurenceOne = 0
        for (v in CO2_list){
            if(v.chars().toArray()[i] == 49){
                occurenceOne++
            }
        }
        majority = if(occurenceOne >= CO2_list.size - occurenceOne){
            48
        }else {
            49
        }
        return majority
    }

    private fun GetMajorityBitOxy(i: Int): Int {
        var majority: Int
        var occurenceOne = 0
        for (v in oxy_list){
            if(v.chars().toArray()[i] == 49){
                occurenceOne++
            }
        }
        majority = if(occurenceOne >= oxy_list.size - occurenceOne){
            49
        }else {
            48
        }
        return majority
    }
}