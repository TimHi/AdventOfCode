package day10

import kotlin.Exception
import kotlin.math.E

class Day10(private var input: List<String>) {
    private var corruptedList: MutableList<String> = emptyList<String>().toMutableList()
    private var incompleteList: MutableList<String> = emptyList<String>().toMutableList()
    private var scoreList: MutableList<Long> = emptyList<Long>().toMutableList()
    //TODO: Could be done as one object
    private val bracketMapping: HashMap<Char, Char> = mapOf(
        '(' to ')',
        '[' to ']',
        '{' to '}',
        '<' to '>'
    ) as HashMap<Char, Char>
    private val scoreMap: HashMap<Char, Int> = mapOf(
        ')' to 3,
        ']' to 57,
        '}' to 1197,
        '>' to 25137
    ) as HashMap<Char, Int>
    private val syntaxScoreMap: HashMap<Char, Int> = mapOf(
        ')' to 1,
        ']' to 2,
        '}' to 3,
        '>' to 4
    ) as HashMap<Char, Int>

    private fun getScore(): Int{
        var syntaxErrorSum = 0
        for(l in input){
            var chars = l.toCharArray()
            var openStack: MutableList<Char> = emptyList<Char>().toMutableList()
            for (c in chars){
                if(c == '(' || c == '[' || c == '{' || c == '<'){
                    openStack.add(c)
                }else if(c == ')' || c == ']' || c == '}' || c == '>'){
                    if(openStack.size > 0) {
                        var lastChar = openStack[openStack.size - 1]
                        var matchingChar = bracketMapping.getOrElse(lastChar){ throw Exception("Not mapped character $lastChar") }
                        if(matchingChar != c){
                            corruptedList.add(l)
                            syntaxErrorSum += scoreMap.getOrElse(c){ throw Exception("No score mapped for $c") }
                            break
                        }else{
                            openStack.removeLast()
                        }
                    }
                }else{
                    throw Exception("Unknown Char: $c")
                }
            }
        }
        return syntaxErrorSum
    }

    private fun doIncomplete(): Long{
        for(l in incompleteList){
            var autoCompleteList: MutableList<Char> = emptyList<Char>().toMutableList()
            var openStack: MutableList<Char> = emptyList<Char>().toMutableList()
            for(c in l.toCharArray()){
                if(c == '(' || c == '[' || c == '{' || c == '<'){
                    openStack.add(c)
                }else if(c == ')' || c == ']' || c == '}' || c == '>'){
                    if(openStack.size > 0) {
                        var lastChar = openStack[openStack.size - 1]
                        var matchingChar = bracketMapping.getOrElse(lastChar){ throw Exception("Not mapped character $lastChar") }
                        if(matchingChar != c){
                            autoCompleteList.add(c)
                        }
                        openStack.removeLast()
                    }else{
                        throw Exception("This shouldnt happen I guess")
                    }
                }else{
                    throw Exception("Unknown Char $c")
                }
            }
            for (o in openStack){
                var matchingChar = bracketMapping.getOrElse(o){ throw Exception("Not mapped character $o") }
                autoCompleteList.add(matchingChar)
            }
            var intermediateMiddleScore:Long = 0
            for(a in autoCompleteList.asReversed()){
                var score = syntaxScoreMap.getOrElse(a){ throw Exception("Score not mapped for $a") }
                intermediateMiddleScore = intermediateMiddleScore * 5 + score
            }
            scoreList.add(intermediateMiddleScore)
        }
        scoreList.sort()
        var i = scoreList.size / 2

        return scoreList[i]
    }

    fun solvePartOne(): Int {
        return getScore()
    }

    fun solvePartTwo(): Long {
        //Prepare part 2 by getting only the incomplete lines
        for(l in input){
            if(!corruptedList.contains(l))
                incompleteList.add(l)
        }
        return doIncomplete()
    }
}