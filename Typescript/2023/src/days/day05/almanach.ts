export interface AlmanachMapping {
  sourceRangeStart: number;
  destinationRangeStart: number;
  length: number;
}

enum PARSING {
  seedToSoil,
  soilToFertilizer,
  fertilizerToWater,
  waterToLightMap,
  lightToTemperature,
  temperatureToHumidity,
  humidityToLocation
}

export class Almanach {
  public seeds: number[] = [];
  public seedToSoilMap: AlmanachMapping[] = [];
  public soilToFertilizerMap: AlmanachMapping[] = [];
  public fertilizerToWaterMap: AlmanachMapping[] = [];
  public waterToLightMap: AlmanachMapping[] = [];
  public lightToTemperature: AlmanachMapping[] = [];
  public temperatureToHumidity: AlmanachMapping[] = [];
  public humidityToLocation: AlmanachMapping[] = [];
}

export function parseAlamanach(lines: string[]): Almanach {
  const numReg = new RegExp("[0-9]+", "g");
  let parsing = PARSING.seedToSoil;
  const almanach: Almanach = new Almanach();
  lines.forEach((line, i) => {
    if (i === 0) {
      almanach.seeds.push(...(line.match(numReg)?.map((v) => Number(v)) ?? []));
    } else if (line.includes("map")) {
      parsing = getCurrentMap(line);
    } else if (line === "") {
      //
    } else {
      const values = line.split(" ").map((v) => Number(v));
      const mapping: AlmanachMapping = { destinationRangeStart: values[0], sourceRangeStart: values[1], length: values[2] };
      switch (parsing) {
        case PARSING.seedToSoil:
          almanach.seedToSoilMap.push(mapping);
          break;
        case PARSING.soilToFertilizer:
          almanach.soilToFertilizerMap.push(mapping);
          break;
        case PARSING.fertilizerToWater:
          almanach.fertilizerToWaterMap.push(mapping);
          break;
        case PARSING.waterToLightMap:
          almanach.waterToLightMap.push(mapping);
          break;
        case PARSING.lightToTemperature:
          almanach.lightToTemperature.push(mapping);
          break;
        case PARSING.temperatureToHumidity:
          almanach.temperatureToHumidity.push(mapping);
          break;
        case PARSING.humidityToLocation:
          almanach.humidityToLocation.push(mapping);
          break;
      }
    }
  });
  return almanach;
}

function getCurrentMap(line: string) {
  switch (line) {
    case "seed-to-soil map:":
      return PARSING.seedToSoil;
    case "soil-to-fertilizer map:":
      return PARSING.soilToFertilizer;
    case "fertilizer-to-water map:":
      return PARSING.fertilizerToWater;
    case "water-to-light map:":
      return PARSING.waterToLightMap;
    case "light-to-temperature map:":
      return PARSING.lightToTemperature;
    case "temperature-to-humidity map:":
      return PARSING.temperatureToHumidity;
    case "humidity-to-location map:":
      return PARSING.humidityToLocation;
    default:
      throw Error("Not recognized mapping");
  }
}
