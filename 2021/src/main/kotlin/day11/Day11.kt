package day11
//Not happy with this
class DumboOctopuss(var energyLevel: Int, var didBlink: Boolean, var didInc: Boolean, var x: Int, var y: Int, var marked: Boolean)

class Day11(private var input: List<String>) {
    private var blinkCounter = 0
    private var prevCounter = 0
    private var uniqueIncrement = 0
    private var dumboOctoList: HashMap<Pair<Int, Int>, DumboOctopuss> = HashMap()

    private fun initDumboOctos() {
        for ((y) in input.withIndex()) {
            for ((x) in input[y].toCharArray().withIndex()) {
                dumboOctoList[Pair(x, y)] = DumboOctopuss(input[y].toCharArray()[x].toString().toInt(), false, false, x, y, false)

            }
        }
    }

    fun solvePartOne(): Int {
        initDumboOctos()
        resetBlinks()
        println("Leggo")
        flashOctos(1000)
        return blinkCounter
    }

    private fun flashOctos(steps: Int): Int {
        var flashCount = 0
        for (i in 0 until steps) {
            var shouldParse = true
            while (shouldParse) {
                for ((y) in input.withIndex()) {
                    for ((x) in input[y].toCharArray().withIndex()) {
                        dumboOctoList[Pair(x, y)]!!.marked = true
                        var currentOcto: DumboOctopuss = dumboOctoList[Pair(x, y)]!!
                        flash(currentOcto)
                    }
                }
                shouldParse = isOctoReady()
            }

            if(blinkCounter - prevCounter == 100 && uniqueIncrement == 0){
                uniqueIncrement = i + 1
            }
            prevCounter = blinkCounter
            resetBlinks()
        }
        return flashCount
    }

    private fun resetBlinks() {
        var ls = ""
        for ((y) in input.withIndex()) {
            for ((x) in input[y].toCharArray().withIndex()) {
                dumboOctoList[Pair(x, y)]!!.didBlink = false
                dumboOctoList[Pair(x, y)]!!.didInc = false
                if(dumboOctoList[Pair(x, y)]!!.energyLevel >= 10){
                    dumboOctoList[Pair(x, y)]!!.energyLevel = 0
                }
                ls += dumboOctoList[Pair(x, y)]!!.energyLevel.toString()
            }
            //println(ls)
            ls = ""
        }
    }

    private fun flash(currentOcto: DumboOctopuss) {
        if(dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.energyLevel > 9 && !dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.didBlink){
            blinkCounter++
            dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.didBlink = true
            dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.energyLevel = 0
            //set neighbours +1
            var r = Pair(currentOcto.x+1, currentOcto.y)
            var l = Pair(currentOcto.x-1, currentOcto.y)
            var u = Pair(currentOcto.x, currentOcto.y+1)
            var d = Pair(currentOcto.x, currentOcto.y-1)
            var ru = Pair(currentOcto.x+1, currentOcto.y+1)
            var rd = Pair(currentOcto.x+1, currentOcto.y-1)
            var lu = Pair(currentOcto.x-1, currentOcto.y+1)
            var ld = Pair(currentOcto.x-1, currentOcto.y-1)
            if(dumboOctoList.containsKey(r)) {
                if(!dumboOctoList[r]!!.didBlink)
                    dumboOctoList[r]!!.energyLevel = dumboOctoList[r]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(l)){
                if(!dumboOctoList[l]!!.didBlink)
                    dumboOctoList[l]!!.energyLevel = dumboOctoList[l]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(u)) {
                if(!dumboOctoList[u]!!.didBlink)
                    dumboOctoList[u]!!.energyLevel = dumboOctoList[u]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(d)){
                if(!dumboOctoList[d]!!.didBlink)
                    dumboOctoList[d]!!.energyLevel = dumboOctoList[d]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(ru)) {
                if(!dumboOctoList[ru]!!.didBlink)
                    dumboOctoList[ru]!!.energyLevel = dumboOctoList[ru]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(rd)) {
                if(!dumboOctoList[rd]!!.didBlink)
                    dumboOctoList[rd]!!.energyLevel = dumboOctoList[rd]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(lu)) {
                if(!dumboOctoList[lu]!!.didBlink)
                    dumboOctoList[lu]!!.energyLevel = dumboOctoList[lu]!!.energyLevel + 1
            }
            if(dumboOctoList.containsKey(ld)) {
                if(!dumboOctoList[ld]!!.didBlink)
                    dumboOctoList[ld]!!.energyLevel = dumboOctoList[ld]!!.energyLevel + 1
            }
        }else{
            if(!dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.didInc && !dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.didBlink) {
                dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.energyLevel = dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.energyLevel + 1
                dumboOctoList[Pair(currentOcto.x, currentOcto.y)]!!.didInc = true
            }
        }
    }

    private fun isOctoReady(): Boolean {
        for ((y) in input.withIndex()) {
            for ((x) in input[y].toCharArray().withIndex()) {
                if (dumboOctoList[Pair(x, y)]!!.energyLevel >= 10 && !dumboOctoList[Pair(x, y)]!!.didBlink) {
                    return true
                }
            }
        }
        return false
    }

    fun solvePartTwo(): Int {
        return uniqueIncrement
    }
}