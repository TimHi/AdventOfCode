package day08

class Digit(var length: Int, var signals: String)

/**
 * Part 2 was solved by my cousar grozhek, dont judge!
 */
class Day08(private var input: List<String>) {
    var digitMap: HashMap<Int, Digit> = HashMap() // Contains the digits with their mapped string value
    var charMap: HashMap<String, String> = HashMap() // Contains the 'a', 'b' etc value with their mapped value
    var digitSignalMap: HashMap<String, String> = HashMap()
    private fun getOutPutValues(input: List<String>): List<List<String>> {
        var outPutList = emptyList<List<String>>().toMutableList()
        for (l in input) {
            outPutList.add(l.split(" | ")[1].split(" "))
        }
        return outPutList
    }

    private fun getFullLine(input: List<String>): List<List<String>> {
        var inPutList = emptyList<List<String>>().toMutableList()
        for (l in input) {
            inPutList.add(l.split(" | ")[0].split(" "))
            inPutList.add(l.split(" | ")[1].split(" "))
        }
        return inPutList
    }

    private fun getLengthGrouping(lengthToGroup: Int, inputDigits: List<String>, outputDigits: List<String>): MutableList<Digit> {
        var lengthGrouping = emptyList<Digit>().toMutableList()

        for (di in inputDigits) {
            if (di.length == lengthToGroup) {
                val signals = sortString(di)
                val digitToTest = Digit(di.length, signals)
                if (!lengthGrouping.any{ it.signals == signals}) {
                    lengthGrouping.add(digitToTest)
                }
            }
        }
        for (di in outputDigits) {
            if (di.length == lengthToGroup) {
                val signals = sortString(di)
                val digitToTest = Digit(di.length, signals)
                if (!lengthGrouping.any{ it.signals == signals}) {
                    lengthGrouping.add(digitToTest)
                }
            }
        }
        return lengthGrouping
    }

    private fun getUniqueDigits(digitList: List<String>, decodeMap: HashMap<Int, Digit>): HashMap<Int, Digit> {
        for (l in digitList) {
            when (l.length) {
                2 -> {
                    decodeMap[1] = Digit(l.length, l)
                }
                4 -> {
                    decodeMap[4] = Digit(l.length, l)
                }
                3 -> {
                    decodeMap[7] = Digit(l.length, l)
                }
                7 -> {
                    decodeMap[8] = Digit(l.length, l)
                }
            }
        }
        return decodeMap
    }
    private fun sortString(s: String): String {
        return s.toCharArray().sorted().joinToString("")
    }

    /**
     * Prequisite: the unique numbers 1,4,7,8 have been filtered
     * We can use the 1 and the 7 to determine how "a" is mapped
     */
    private fun findAMapping(){
        if (!charMap.containsKey("a")) {
            var digitSeven = digitMap.getOrElse(7) { throw Exception("Not in Map") }
            var digitOne = digitMap.getOrElse(1) { throw Exception("Not in Map") }
            var digitOneNoRef = Digit(digitOne.length, digitOne.signals)
            var digitSevenNoRef = Digit(digitSeven.length, digitSeven.signals)
            for (d1 in digitOneNoRef.signals.toCharArray()) {
                digitSevenNoRef.signals = digitSevenNoRef.signals.replace(d1.toString(), "")
            }
            if (digitSevenNoRef.signals.length == 1) {
                charMap["a"] = digitSevenNoRef.signals
                println("Found a Mapping: a -> ${digitSevenNoRef.signals}")
            } else {
                throw Exception("Top of 7 could not be deducted")
            }
        }
    }

    /**
     * Prequisite: we know the digit 1 and their signals (not mapped to the correct position we just need the bar on the right
     * With that we can deduct what 6 chars are the digit 6
     */
    private fun get6Digit(inputDigits: List<String>, outputDigits: List<String>) {
        if (!digitMap.containsKey(6)) {
            var lengthSixGrouping = getLengthGrouping(6, inputDigits, outputDigits)
            //Preemptive check
            if (lengthSixGrouping.size != 3) {
                throw Exception("Not enough digits to get the 6")
            }
            val origList = emptyList<Digit>().toMutableList()
            //Stop modifiying both lists (got to be a smarter way)
            for(i in lengthSixGrouping){
                origList.add(Digit(i.length, i.signals))
            }
            var aMappedChar = charMap.getOrElse("a") { throw java.lang.Exception("No a mapped in charmap") }
            var digitOne = digitMap.getOrElse(1){throw java.lang.Exception("One not mapped in Digit map")}
            lengthSixGrouping.forEach { l6 ->
                l6.signals = l6.signals.replace(aMappedChar, "")
                //Remove the two chars from 1
                l6.signals = l6.signals.replace(digitOne.signals.toCharArray()[0].toString(), "")
                l6.signals = l6.signals.replace(digitOne.signals.toCharArray()[1].toString(), "")
            }
            for((i) in lengthSixGrouping.withIndex()){
                if(lengthSixGrouping[i].signals.length == 4){
                    digitMap[6] = origList[i]
                    break
                }
            }
            println("Found Digit 6: ${digitMap[6]?.signals}")
        }
    }

    /**
     * Prequisite: Know what signals are used by digit 1
     */
    private fun get3Digit(inputDigits: List<String>, outputDigits: List<String>){
        if (!digitMap.containsKey(3)) {
            var lengthFiveGrouping = getLengthGrouping(5, inputDigits, outputDigits)

            //Preemptive check
            if (lengthFiveGrouping.size != 3) {
                throw Exception("Not enough digits to get the 2")
            }
            val origList = emptyList<Digit>().toMutableList()
            //Stop modifiying both lists (got to be a smarter way)
            for(i in lengthFiveGrouping){
                origList.add(Digit(i.length, i.signals))
            }

            var digitOne = digitMap.getOrElse(1){throw java.lang.Exception("One not mapped in Digit map")}

            lengthFiveGrouping.forEach { l5 ->
                //Remove the two chars from 1
                l5.signals = l5.signals.replace(digitOne.signals.toCharArray()[0].toString(), "")
                l5.signals = l5.signals.replace(digitOne.signals.toCharArray()[1].toString(), "")
            }
            for((i) in lengthFiveGrouping.withIndex()){
                if(lengthFiveGrouping[i].signals.length == 3){
                    digitMap[3] = Digit(origList[i].length, origList[i].signals)
                    break
                }
            }
            println("Found Digit 3: ${digitMap[3]?.signals}")
        }
    }

    /**
     * Prequisite: We know the signal of 6 and 1, then we can check which of the one is missing in the 6
     */
    private fun getCFMapping(){
        if(!charMap.containsKey("c") && !charMap.containsKey("f")) {
            var digitSix = digitMap.getOrElse(6) { throw java.lang.Exception("Cant deduct C/F without digit 6") }
            var digitOne = digitMap.getOrElse(1) { throw java.lang.Exception("Cant deduct C/F without digit 1") }
            var C = ""
            var F = ""
            for (c in digitOne.signals.toCharArray()) {
                if (digitSix.signals.toCharArray().contains(c)) {
                    F = c.toString()
                    C = digitOne.signals.replace(F, "")
                }
            }
            if (C != "" && F != "") {
                charMap["c"] = C
                println("Found c Mapping: c -> $C")
                charMap["f"] = F
                println("Found f Mapping: f -> $F")
            } else {
                throw Exception("Deducting C/F Failed")
            }
        }
    }

    private fun get25DigitAndDEMapping(inputDigits: List<String>, outputDigits: List<String>){
        if(!charMap.containsKey("d") && !charMap.containsKey("e") && !digitMap.containsKey(2) && !digitMap.containsKey(5)){
            var lengthFiveGrouping = getLengthGrouping(5, inputDigits, outputDigits)
            var digit3 = digitMap.getOrElse(3) {throw Exception("Digit 3 needed to deduct this stuff")}
            var d3Signals = digit3.signals
            lengthFiveGrouping.removeIf { d -> d.signals == d3Signals }
            var p0 = Digit(lengthFiveGrouping.get(0).length, lengthFiveGrouping.get(0).signals)
            var p1 = Digit(lengthFiveGrouping.get(1).length, lengthFiveGrouping.get(1).signals)
            var aMapping = charMap.getOrElse("a"){throw java.lang.Exception("Cant get 25 and DE")}
            var bMapping = charMap.getOrElse("b"){throw java.lang.Exception("Cant get 25 and DE")}
            var cMapping = charMap.getOrElse("c"){throw java.lang.Exception("Cant get 25 and DE")}
            var fMapping = charMap.getOrElse("f"){throw java.lang.Exception("Cant get 25 and DE")}
            var gMapping = charMap.getOrElse("g"){throw java.lang.Exception("Cant get 25 and DE")}
            lengthFiveGrouping.forEach { i ->
                i.signals = i.signals.replace(aMapping, "")
                i.signals = i.signals.replace(bMapping, "")
                i.signals = i.signals.replace(cMapping, "")
                i.signals = i.signals.replace(fMapping, "")
                i.signals = i.signals.replace(gMapping, "")
            }
            for ((i) in lengthFiveGrouping.withIndex()){
                if(i == 0) {
                    if (lengthFiveGrouping[i].signals.length == 2) {
                        //2
                        digitMap[2] = Digit(p0.length, p0.signals)
                        var eString = lengthFiveGrouping[i].signals
                        eString = eString.replace(lengthFiveGrouping[1].signals, "")
                        charMap["e"] = eString
                    } else {
                        //5
                        digitMap[5] = Digit(p0.length, p0.signals)
                        charMap["d"] = lengthFiveGrouping[i].signals
                    }
                }else{
                    if (lengthFiveGrouping[i].signals.length == 2) {
                        //2
                        digitMap[2] = Digit(p1.length, p1.signals)
                        var eString = lengthFiveGrouping[i].signals
                        eString = eString.replace(lengthFiveGrouping[0].signals, "")
                        charMap["e"] = eString
                    } else {
                        //5
                        digitMap[5] = Digit(p1.length, p1.signals)
                        charMap["d"] = lengthFiveGrouping[i].signals
                    }
                }
            }
            println("Found digit 2: ${digitMap[2]?.signals} and 5: ${digitMap[5]?.signals}")
            println("Found d mapping: d -> ${charMap["d"]}")
            println("Found e mapping: e -> ${charMap["e"]}")
        }
    }

    private fun getBGMapping(){
        if(!charMap.containsKey("b") && !charMap.containsKey("g")){
            var aMapping = charMap.getOrElse("a"){throw java.lang.Exception("Cant deduct BG without a")}
            var cMapping = charMap.getOrElse("c"){throw java.lang.Exception("Cant deduct BG without c")}
            var fMapping = charMap.getOrElse("f"){throw java.lang.Exception("Cant deduct BG without f")}
            var digit3 = digitMap.getOrElse(3){throw java.lang.Exception("Cant deduct BG without 3")}
            var digit4 = digitMap.getOrElse(4){throw java.lang.Exception("Cant deduct BG without 4")}
            var d3Signals = digit3.signals
            var d4Signals = digit4.signals
            d3Signals = d3Signals.replace(aMapping, "")
            d3Signals = d3Signals.replace(cMapping, "")
            d3Signals = d3Signals.replace(fMapping, "")
            d4Signals = d4Signals.replace(cMapping, "")
            d4Signals = d4Signals.replace(fMapping, "")
            var oldD3 = d3Signals
            for (c in d4Signals.toCharArray()){
                d3Signals = d3Signals.replace(c.toString(), "")
            }
            for (c in oldD3.toCharArray()){
                d4Signals = d4Signals.replace(c.toString(), "")
            }
            if(d4Signals.length == 1 && d3Signals.length == 1){
                println("Found g Mapping: g -> $d3Signals")
                charMap["g"] = d3Signals
                println("Found b Mapping: b -> $d4Signals")
                charMap["b"] = d4Signals
            }else{
                throw Exception("Something went wrong getting BG from 3&4")
            }
        }
    }

    private fun get0And9Digit(inputDigits: List<String>, outputDigits: List<String>) {
        val aMapping = charMap.getOrElse("a"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val bMapping = charMap.getOrElse("b"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val cMapping = charMap.getOrElse("c"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val dMapping = charMap.getOrElse("d"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val eMapping = charMap.getOrElse("e"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val fMapping = charMap.getOrElse("f"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        val gMapping = charMap.getOrElse("g"){throw java.lang.Exception("Not enough info to get 0 and 9")}
        var zeroBlueprint = aMapping + bMapping + cMapping + eMapping + fMapping + gMapping
        var nineBlueprint = aMapping + bMapping + cMapping + dMapping + fMapping + gMapping
        zeroBlueprint = zeroBlueprint.toCharArray().sorted().joinToString().replace(",", "").replace(" ", "") // Only god knows why this needs the replaces and the line below does not
        nineBlueprint = nineBlueprint.toCharArray().sorted().joinToString().replace(",", "").replace(" ", "")
        var sixLengthGroup = getLengthGrouping(6, inputDigits, outputDigits)
        sixLengthGroup.forEach { i -> i.signals.toCharArray().sorted().joinToString() }
        for (d in sixLengthGroup){
            if(d.signals == zeroBlueprint){
                digitMap[0] = Digit(d.signals.length, d.signals)
            }
            if(d.signals == nineBlueprint){
                digitMap[9] = Digit(d.signals.length, d.signals)
            }
        }
        println("Found digit 0: ${digitMap[0]?.signals} and 9: ${digitMap[9]?.signals}")
    }

    private fun decodeLine(inputDigits: List<String>, outputDigits: List<String>): Int {
        digitMap = HashMap() // Contains the digits with their mapped string value
        charMap = HashMap() // Contains the 'a', 'b' etc value with their mapped value
        digitSignalMap = HashMap()
        digitMap = getUniqueDigits(inputDigits, digitMap)
        digitMap = getUniqueDigits(outputDigits, digitMap)
        findAMapping()
        get6Digit(inputDigits, outputDigits)
        getCFMapping()
        get3Digit(inputDigits, outputDigits)
        getBGMapping()
        get25DigitAndDEMapping(inputDigits, outputDigits)
        get0And9Digit(inputDigits, outputDigits)
        sortDigitMap()
        val sumOfLine = getSumOfLine(outputDigits)
        return sumOfLine
    }

    private fun sortDigitMap() {
        for(i in digitMap){
            var sorted = i.value.signals.toCharArray().sorted().joinToString("")
            digitMap[i.key] = Digit(i.value.length, sorted)
            digitSignalMap[sorted] = i.key.toString()
        }
    }

    private fun getSumOfLine(outputDigits: List<String>): Int {
        var lineString = ""
        for(o in outputDigits){
            val oSorted = sortString(o)
            val digit = digitSignalMap.getOrElse(oSorted) {throw java.lang.Exception("Not present: $oSorted sad trombone")}
            lineString += digit
        }
        println("Line decoded: $lineString")
        return lineString.toInt()
    }

    fun SolvePartOne(): Int {
        val outPutValues = getOutPutValues(input)
        var vCounter = 0
        outPutValues.forEach { v -> vCounter += v.count { d -> d.length == 2 || d.length == 4 || d.length == 3 || d.length == 7 } }
        return vCounter
    }

    fun SolvePartTwo(): Int {
        val allValues = getFullLine(input)
        var sumOfOutput = 0
        for ((i) in allValues.withIndex()) {
            if (allValues[i].size == 10) {
                sumOfOutput += decodeLine(allValues[i], allValues[i + 1])
            }
        }
        return sumOfOutput
    }
}