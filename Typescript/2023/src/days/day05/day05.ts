import * as fs from "fs";
import { Almanach, parseAlamanach } from "./almanach";

const isSample = false;
const seedToSoil = new Map<number, number>();
const soilToFert = new Map<number, number>();
const fertToWater = new Map<number, number>();
const waterToLight = new Map<number, number>();
const lightToTemp = new Map<number, number>();
const tempToHum = new Map<number, number>();
const humToLoc = new Map<number, number>();
const defaultMap = Array.from(Array(100).keys());

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day05/sample.txt" : "/src/days/day05/full.txt";

  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");

  const almanach: Almanach = parseAlamanach(lines);
  defaultMap.forEach((v, i) => {
    seedToSoil.set(i, v);
    soilToFert.set(i, v);
    fertToWater.set(i, v);
    waterToLight.set(i, v);
    lightToTemp.set(i, v);
    tempToHum.set(i, v);
    humToLoc.set(i, v);
  });

  almanach.seedToSoilMap.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      seedToSoil.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.soilToFertilizerMap.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      soilToFert.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.fertilizerToWaterMap.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      fertToWater.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.waterToLightMap.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      waterToLight.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.lightToTemperature.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      lightToTemp.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.temperatureToHumidity.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      tempToHum.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.humidityToLocation.forEach((map) => {
    let offset = 0;
    for (let i = map.destinationRangeStart; i < map.destinationRangeStart + map.length; i++) {
      humToLoc.set(map.sourceRangeStart + offset, i);
      offset++;
    }
  });

  almanach.seeds.forEach((seed) => {
    const soil = seedToSoil.get(seed);
    if (soil === undefined) throw Error("Soil not found");

    const fert = soilToFert.get(soil);
    if (fert === undefined) throw Error("Fert not found");

    const water = fertToWater.get(fert);
    if (water === undefined) throw Error("Water not found");

    const light = waterToLight.get(water);
    if (light === undefined) throw Error("light not found");

    const temp = lightToTemp.get(light);
    if (temp === undefined) throw Error("temp not found");

    const hum = tempToHum.get(temp);
    if (hum === undefined) throw Error("hum not found");

    const loc = humToLoc.get(hum);
    if (loc === undefined) throw Error("loc not found");
    console.log(
      `Seed ${seed}, soil ${soil}, fertilizer ${fert}, water ${water}, light ${light}, temperature ${temp}, humidity ${hum}, location ${loc}`
    );
  });
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
